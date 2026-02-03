import express from "express";
import stripe from "../config/stripe.js";

const router = express.Router();

// One-time payment 

router.post("/one-time", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: { name: "Premium Access" },
                    unit_amount: 500 * 100,
                },
                quantity: 1,
            },
        ],
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({url: session.url});
});

// Subscription payment

router.post("/subscription", async (req, res) => {

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],

        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: { name: "Premium Subscription" },
                    unit_amount: 500 * 100,
                    recurring: { interval: "month" },
                },
                quantity: 1,
            },
        ],

        allow_promotion_codes: true,

        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({url: session.url});
});


export default router;