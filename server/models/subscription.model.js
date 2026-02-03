import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    stripeSubscriptionId: { 
        type: String, 
        unique: true 
    },
    
    stripeCustomerId: String,
    stripePriceId: String,

    status: {
        type: String,
        enum: ["trialing", "active", "past_due", "canceled", "unpaid"],
    },

    currentPeriodEnd: Date,
    cancelAtPeriodEnd: Boolean,

});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);