import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    role: {
        type: String,
        enum: ["student", "mentor", "admin"],
        default: "student",
    },
    name: {
        type: String,
    },
    mentorProfile: {
        basicInfo: {
            gender: String,
            currentOrganisation: String,
            industry: String,
            currentRole: String,
            workExperience: Number,
            profilePhoto: String,
        },
        professionalInfo: {
            highestQualification: String,
            college: String,
            branch: String,
            passingYear: Number,
        },
        expertise: {
            subjects: [String],
            specializations: String,
        },
        availability: {
            days: [String],
            timeSlots: [String],
        },
        pricing: {
            pricePerSession: Number,
            sessionDuration: Number,
            isFreeTrialEnabled: Boolean,
        }
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
