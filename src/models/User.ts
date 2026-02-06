import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
    email?: string;
    name?: string;
    provider: "google" | "guest";
    currency: string;
    // Gamification fields
    level: number;
    xp: number;
    currentStreak: number;
    longestStreak: number;
    createdAt?: Date;
}

export interface IUserDocument extends IUser, Document { }

const UserSchema = new Schema<IUserDocument>(
    {
        email: { type: String, sparse: true, unique: true },
        name: { type: String },
        provider: { type: String, enum: ["google", "guest"], default: "guest" },
        currency: { type: String, default: "INR" },
        // Gamification fields
        level: { type: Number, default: 1 },
        xp: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const User: Model<IUserDocument> =
    mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
