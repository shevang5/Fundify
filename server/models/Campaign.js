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
        default: 'active'
    },

    // Offline money collector name and email
    offlineCollectorName: { type: String, default: '' },
    offlineCollectorEmail: { type: String, default: '' },

    // List of people who donated
    donors: [
        {
            name: String,
            amount: Number,
            type: { type: String, enum: ['online', 'offline'], default: 'online' },
            date: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Campaign', campaignSchema);