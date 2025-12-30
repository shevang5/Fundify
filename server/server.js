require('dotenv').config();
const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');
const campaignRoutes = require('./routes/campaignRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Allows us to accept JSON data in the body

// Mount Routes
app.use('/api/campaigns', campaignRoutes);

app.use('/api/users', userRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});