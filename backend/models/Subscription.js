const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Medicine',
        },
        qty: { type: Number, required: true, default: 1 },
        frequencyDays: { type: Number, required: true, default: 30 },
        nextDeliveryDate: { type: Date, required: true },
        status: { type: String, required: true, default: 'Active', enum: ['Active', 'Cancelled'] },
    },
    {
        timestamps: true,
    }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
