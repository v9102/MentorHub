import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGO_URI environment variable inside .env.local",
    );
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("MongoDB Connected");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("MongoDB connection established");
    } catch (e) {
        console.error("MongoDB connection failed:", e);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};
