import User from "../models/user.js";

export const getPendingApplications = async (req, res) => {
    try {
        const applications = await User.find({
            role: "mentor",
            "mentorProfile.verification.applicationStatus": "pending"
        })
            .select("name email imageUrl mentorProfile createdAt")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error("Error fetching admin applications:", error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const verifyMentor = async (req, res) => {
    try {
        const { id } = req.params;

        const mentor = await User.findOneAndUpdate(
            { _id: id, role: "mentor" },
            {
                $set: {
                    "mentorProfile.verification.isVerified": true,
                    "mentorProfile.verification.applicationStatus": "approved"
                }
            },
            { new: true }
        );

        if (!mentor) {
            return res.status(404).json({ success: false, msg: "Mentor not found" });
        }

        res.status(200).json({
            success: true,
            msg: "Mentor verified successfully",
            data: mentor
        });
    } catch (error) {
        console.error("Error verifying mentor:", error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const rejectMentor = async (req, res) => {
    try {
        const { id } = req.params;

        const mentor = await User.findOneAndUpdate(
            { _id: id, role: "mentor" },
            {
                $set: {
                    "mentorProfile.verification.isVerified": false,
                    "mentorProfile.verification.applicationStatus": "rejected"
                }
            },
            { new: true }
        );

        if (!mentor) {
            return res.status(404).json({ success: false, msg: "Mentor not found" });
        }

        res.status(200).json({
            success: true,
            msg: "Mentor application rejected",
            data: mentor
        });
    } catch (error) {
        console.error("Error rejecting mentor:", error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};
