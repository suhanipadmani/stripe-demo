import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email: { 
        type: String, 
        unique: true 
    },
    stripeCustomerId: String,

    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
    },
});

export const User = mongoose.model("User", userSchema);
