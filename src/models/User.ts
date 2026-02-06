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
    // Social fields
    isPublic: boolean;
    displayName?: string;
    image?: string;
    // Notification fields
    pushSubscription?: string;
    notificationsEnabled: boolean;
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
        // Social fields
        isPublic: { type: Boolean, default: true },
        displayName: { type: String },
        image: { type: String },
        // Notification fields
        pushSubscription: { type: String },
        notificationsEnabled: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const User: Model<IUserDocument> =
    mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
