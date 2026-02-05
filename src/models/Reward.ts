import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IReward extends Document {
    userId: Types.ObjectId;
    name: string;
    price: number;
    imageUrl?: string;
    status: "locked" | "active" | "redeemed";
    savedAmount: number;
    linkedHabits: Types.ObjectId[];
    createdAt: Date;
}

const RewardSchema = new Schema<IReward>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true, maxlength: 100 },
        price: { type: Number, required: true, min: 1 },
        imageUrl: { type: String },
        status: {
            type: String,
            enum: ["locked", "active", "redeemed"],
            default: "active",
        },
        savedAmount: { type: Number, default: 0, min: 0 },
        linkedHabits: [{ type: Schema.Types.ObjectId, ref: "Habit" }],
    },
    { timestamps: true }
);

// Index for fast lookups
RewardSchema.index({ userId: 1, status: 1 });

export const Reward: Model<IReward> =
    mongoose.models.Reward || mongoose.model<IReward>("Reward", RewardSchema);
