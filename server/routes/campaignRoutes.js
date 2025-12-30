const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const { protect } = require('../middleware/authMiddleware'); // Import the guard

// @desc    Get all active campaigns
// @route   GET /api/campaigns
router.get('/', async (req, res) => {
    try {
        // Only fetch campaigns that verify as 'active' (Approved by Admin)
        const campaigns = await Campaign.find({ status: 'active' });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single campaign by ID
// @route   GET /api/campaigns/:id
router.get('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (campaign) {
            res.json(campaign);
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @desc    Create a new campaign (Private)
// We add 'protect' here so only logged-in users can reach this logic
router.post('/', protect, async (req, res) => {
    const { title, description, targetAmount, deadline, image } = req.body;

    try {
        const campaign = new Campaign({
            title,
            description,
            targetAmount,
            deadline,
            image,
            // req.user comes from the 'protect' middleware after decoding the token
            organizer: req.user.id,
        });

        const createdCampaign = await campaign.save();
        res.status(201).json(createdCampaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;