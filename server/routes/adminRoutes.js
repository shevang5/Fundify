const express = require('express');
const router = express.Router();
const { getAllCampaignsAdmin, updateCampaignStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes here require both Login AND Admin status
router.use(protect);
router.use(admin);

router.get('/campaigns', getAllCampaignsAdmin);
router.put('/campaigns/:id', updateCampaignStatus);

module.exports = router;