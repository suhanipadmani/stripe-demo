import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import checkoutRoutes from "./routes/checkout.js";
import webhookRoutes from "./routes/webhook.js";

dotenv.config();

const app = express();

// Webhook needs raw body
app.use("/webhook", express.raw({ type: "application/json" }));

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/checkout", checkoutRoutes);
app.use("/webhook", webhookRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});