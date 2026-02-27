import mongoose from "mongoose";

const examDetailSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
        trim: true,
    },
    college: {
        type: String,
        trim: true,
    },
    rank: {
        type: String,
        trim: true,
    },
    percentile: {
        type: String,
        trim: true,
    },
    attempts: {
        type: String,
        trim: true,
    },
    interview: {
        type: String,
        trim: true,
    },
    selectionYear: {
        type: String,
        trim: true,
    }
}, { _id: true });

const UserSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    name: {
        type: String,
        trim: true,
        index: true,
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
    },
    imageUrl: {
        type: String,
    },
    role: {
        type: String,
        enum: ["student", "mentor", "admin"],
        default: "student",
        index: true,
    },
    languages: [{
        type: String,
        trim: true,
    }],
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
        availability: [{
            day: {
                type: String,
                enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            },
            slots: [{
                startTime: String,
                endTime: String,
                sessionDuration: {
                    type: Number,
                    default: 15,
                },
            }],
        }],
        upcomingSessions: [{
            date: Date,
            startTime: String,
            endTime: String,
            sessionDuration: Number,
            isBooked: {
                type: Boolean,
                default: false,
            },
            bookedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },
        }],
        pricing: {
            pricePerSession: Number,
            sessionDuration: Number,
            isFreeTrialEnabled: Boolean,
        },
        examDetails: [examDetailSchema],
        bio: String,
        languages: [String],
        rating: {
            type: Number,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        verification: {
            idType: String,
            idNumber: String,
            documentUrl: String,
            isVerified: {
                type: Boolean,
                default: false,
                index: true,
            },
            applicationStatus: {
                type: String,
                enum: ["pending", "approved", "rejected"],
                default: "pending",
                index: true,
            },
        },
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
        index: true,
    },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
