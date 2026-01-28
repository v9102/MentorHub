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
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
