const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                medicine: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Medicine',
                },
            }
        ],
        deliveryAddress: {
            address: { type: String, required: true },
            city: { type: String },
            postalCode: { type: String },
            country: { type: String },
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'Cash on Delivery',
            enum: ['Cash on Delivery', 'Online'],
        },
        paymentStatus: {
            type: String,
            required: true,
            default: 'Pending',
            enum: ['Pending', 'Completed', 'Failed'],
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        orderStatus: {
            type: String,
            required: true,
            default: 'Pending',
            enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'],
        },
        prescriptionImage: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
