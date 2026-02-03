import express from "express";
import stripe from "../config/stripe.js";

const router = express.Router();

// Customer Portal

router.post("/portal", async (req, res) => {
    const { stripeCustomerId } = req.body;

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: process.env.CLIENT_URL,
    });

    res.json({ url: portalSession.url });
});

export default router;
