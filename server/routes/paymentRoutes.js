const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Campaign = require('../models/Campaign');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1: Create an Order
router.post('/orders', async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100, // Razorpay works in paise (₹1 = 100 paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Step 2: Verify Payment
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, campaignId, amount } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Update the Campaign total and add donor in Database
        await Campaign.findByIdAndUpdate(campaignId, {
            $inc: { currentAmount: amount },
            $push: { donors: { name: req.body.donorName || "Anonymous", amount: amount, method: "online" } }
        });
        res.json({ status: "success" });
    } else {
        res.status(400).json({ status: "failure" });
    }
});

// Step 3: Add Offline Donation
router.post('/offline', async (req, res) => {
    try {
        const { campaignId, donorName, amount } = req.body;

        if (!campaignId || !donorName || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Update the Campaign total and add offline donor
        const updated = await Campaign.findByIdAndUpdate(
            campaignId,
            {
                $inc: { currentAmount: amount },
                $push: { donors: { name: donorName, amount: amount, method: "offline" } }
            },
            { new: true }
        );

        res.json({ status: "success", campaign: updated });
    } catch (error) {
        res.status(500).json({ message: "Error adding offline donation", error });
    }
});

module.exports = router;