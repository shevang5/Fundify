const asyncHandler = require('express-async-handler');
const Campaign = require('../models/Campaign');

// @desc    Get all campaigns (Pending/Active/etc) for Admin
// @route   GET /api/admin/campaigns
const getAllCampaignsAdmin = asyncHandler(async (req, res) => {
    const campaigns = await Campaign.find({}).populate('organizer', 'name email');
    res.json(campaigns);
});

// @desc    Update campaign status (Approve/Reject)
// @route   PUT /api/admin/campaigns/:id
const updateCampaignStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // Expecting 'active' or 'rejected'

    const campaign = await Campaign.findById(req.params.id);

    if (campaign) {
        campaign.status = status || campaign.status;
        const updatedCampaign = await campaign.save();
        res.json(updatedCampaign);
    } else {
        res.status(404);
        throw new Error('Campaign not found');
    }
});

module.exports = { getAllCampaignsAdmin, updateCampaignStatus };