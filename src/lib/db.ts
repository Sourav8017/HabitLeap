import mongoose from "mongoose";
import { z } from "zod";

// Validate environment variables
const envSchema = z.object({
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
});

const env = envSchema.safeParse(process.env);

if (!env.success && process.env.NODE_ENV === "production") {
    console.error("❌ Invalid environment variables:", env.error.format());
    throw new Error("Invalid environment variables");
}

const MONGODB_URI = process.env.MONGODB_URI || "";

// Prevent multiple connections in development (Next.js hot reload)
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
    conn: null,
    promise: null,
};

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("✅ MongoDB Connected");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
