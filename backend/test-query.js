import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        try {
            const users = await mongoose.connection.collection('users').find({
                role: "mentor",
                "mentorProfile.verification.isVerified": { $ne: false },
                name: /Rakshit/i
            }).toArray();
            console.log('Query result:', users.length);
            console.log('Details:', JSON.stringify(users, null, 2));
        } catch (err) {
            console.error(err);
        } finally {
            process.exit(0);
        }
    });
