import cron from "node-cron";
import Booking from "../models/Booking.js";

// Mock email sending function
const sendReminderEmail = (email, name, role, timeToSession, sessionId) => {
    console.log(`\n\n[CRON MOCK EMAIL] To: ${email} (${role})`);
    console.log(`Subject: Reminder: Mentoring Session in ${timeToSession}`);
    console.log(`Hi ${name},\n\nYour session is starting in ${timeToSession}. Join here: http://localhost:3000/meeting/${sessionId}\n\n`);
};

const checkAndSendReminders = async () => {
    try {
        const now = new Date();

        // We want to find bookings that are exactly 24h, 6h, or 30m away.
        // Since cron runs every minute, we'll check for sessions starting within the target minute.

        const target24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const target6h = new Date(now.getTime() + 6 * 60 * 60 * 1000);
        const target30m = new Date(now.getTime() + 30 * 60 * 1000);

        const checkTimeWindow = async (targetTime, label) => {
            // We'll search for confirmed bookings where sessionDate + startTime is within this minute
            // Because of the way date + startTime are stored separately, we need to iterate or do a complex query.
            // For simplicity and efficiency in a small scale, we can query all 'confirmed' bookings for the target dates.

            const targetDateString = targetTime.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const targetHour = targetTime.getHours();
            const targetMinute = targetTime.getMinutes();

            // Convert to exactly HH:MM ignoring PM/AM for DB format (assuming 24h stored format, but let's check standard)
            // Wait, the DB stores startTime as string, e.g. "14:30" or "02:30 PM".
            // The controller converts it to 24h cleanly? Let's just pull all confirmed for the date and check in JS.

            // Find bookings for the date of the target
            const startOfDay = new Date(targetTime);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(targetTime);
            endOfDay.setHours(23, 59, 59, 999);

            const bookings = await Booking.find({
                status: "confirmed",
                sessionDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }).populate("mentor", "name email").populate("student", "name email");

            for (const booking of bookings) {
                // Parse startTime. Assumed format: HH:mm (from the controller it converts to 24h format HH:mm)
                if (!booking.startTime) continue;

                let hours, minutes;
                if (booking.startTime.includes("AM") || booking.startTime.includes("PM")) {
                    // Convert 12h to 24h just in case
                    const [time, modifier] = booking.startTime.trim().split(" ");
                    let [h, m] = time.split(":").map(Number);
                    if (modifier === "PM" && h !== 12) h += 12;
                    if (modifier === "AM" && h === 12) h = 0;
                    hours = h;
                    minutes = m;
                } else {
                    [hours, minutes] = booking.startTime.split(":").map(Number);
                }

                if (hours === targetHour && minutes === targetMinute) {
                    // Time matches the target exact minute!
                    // We shouldn't send it multiple times. We can just send the email.
                    // In a production system, we'd add a "remindersSent: ['24h', '6h']" array to the Booking schema 
                    // to avoid duplicate sending if cron retries.

                    if (booking.mentor) {
                        sendReminderEmail(booking.mentor.email, booking.mentor.name, "Mentor", label, booking._id);
                    }
                    if (booking.student) {
                        sendReminderEmail(booking.student.email, booking.student.name, "Student", label, booking._id);
                    }
                }
            }
        };

        await checkTimeWindow(target24h, "24 hours");
        await checkTimeWindow(target6h, "6 hours");
        await checkTimeWindow(target30m, "30 minutes");

    } catch (err) {
        console.error("Cron Error sending reminders:", err);
    }
};

export const initCronJobs = () => {
    // Run every minute
    cron.schedule("* * * * *", () => {
        checkAndSendReminders();
    });
    console.log("Cron jobs initialized.");
};
