const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 }, // Auto-updates on donation
    deadline: { type: Date, required: true },
    image: { type: String, required: true }, // URL from Cloudinary (later)

    // Who created this?
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Admin approval status
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'rejected'],
        default: 'pending'
    },

    // List of people who donated
    donors: [
        {
            name: String,
            amount: Number,
            date: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Campaign', campaignSchema);