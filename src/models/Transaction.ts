import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITransaction extends Document {
    userId: Types.ObjectId;
    habitId: Types.ObjectId;
    rewardId: Types.ObjectId;
    amountSaved: number;
    timestamp: Date;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true },
        rewardId: { type: Schema.Types.ObjectId, ref: "Reward", required: true },
        amountSaved: { type: Number, required: true, min: 0 },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Index for user's transaction history
TransactionSchema.index({ userId: 1, timestamp: -1 });

export const Transaction: Model<ITransaction> =
    mongoose.models.Transaction ||
    mongoose.model<ITransaction>("Transaction", TransactionSchema);
