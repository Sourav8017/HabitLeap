import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IHabit extends Document {
    userId: Types.ObjectId;
    name: string;
    costPerOccurrence: number;
    frequency: "daily" | "weekly" | "monthly";
    category: "food" | "transport" | "digital" | "smoking" | "other";
    isActive: boolean;
    createdAt: Date;
}

const HabitSchema = new Schema<IHabit>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true, maxlength: 50 },
        costPerOccurrence: { type: Number, required: true, min: 0 },
        frequency: {
            type: String,
            enum: ["daily", "weekly", "monthly"],
            default: "daily",
        },
        category: {
            type: String,
            enum: ["food", "transport", "digital", "smoking", "other"],
            default: "other",
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Index for fast lookups by user
HabitSchema.index({ userId: 1, isActive: 1 });

export const Habit: Model<IHabit> =
    mongoose.models.Habit || mongoose.model<IHabit>("Habit", HabitSchema);
