const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const medicineSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0, default: 0 },
        description: { type: String, required: true },
        manufacturer: { type: String, required: true, default: 'Generic' },
        ingredients: { type: [String], required: true, default: [] },
        usage: { type: String, required: true, default: 'Take as directed by your physician.' },
        sideEffects: { type: [String], required: true, default: [] },
        requiresPrescription: { type: Boolean, required: true, default: false },
        image: { type: String, required: true },
        expiryDate: { type: Date, required: true },
        reviews: [reviewSchema],
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;
