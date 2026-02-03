import express from "express";
import stripe from "../config/stripe.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(err.message);
    }

    // Customer created
    if (event.type === "customer.created") {
        const customer = event.data.object;

        await User.findOneAndUpdate(
            { stripeCustomerId: customer.id },
            {
                email: customer.email,
                stripeCustomerId: customer.id,
            },
            { upsert: true, new: true }
        );
    }

    // Subscription created
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        if (session.mode === "subscription") {
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription
            );

            // Find or create user
            let user = await User.findOne({ stripeCustomerId: subscription.customer });
            if (!user) {
                user = await User.create({
                    email: session.customer_details?.email,
                    stripeCustomerId: subscription.customer,
                });
            }

            const newSubscription = await Subscription.create({
                user: user._id,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer,
                stripePriceId: subscription.items.data[0].price.id,
                status: subscription.status,
                currentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            });

            // Update user with subscription
            await User.findByIdAndUpdate(user._id, { subscription: newSubscription._id });
        }
    }

    //Monthly payment success
    if (event.type === "invoice.paid") {
        const invoice = event.data.object;

        await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: invoice.subscription },
            { status: "active" },
        );
    }

    //Payment failed
    if (event.type === "invoice.payment_failed") {
        await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: event.data.object.subscription },
            { status: "past_due" }
        );
    }

    if (event.type === "customer.subscription.updated") {
        const sub = event.data.object;

        await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: sub.id },
            {
                stripePriceId: sub.items.data[0].price.id,
                status: sub.status,
                currentPeriodEnd: new Date(
                    sub.current_period_end * 1000
                ),
            }
        );
    }


    res.json({ received: true });
});

export default router;
