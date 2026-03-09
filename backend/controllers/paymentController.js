const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const generateInvoice = require('../utils/generateInvoice');
const sendEmail = require('../utils/sendEmail');

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const { amount } = req.body;

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
        });

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        if (!order) {
            res.status(500);
            throw new Error('Some error occurred while creating Razorpay order');
        }

        res.json(order);
    } catch (error) {
        if (error.error && error.error.description) {
            res.status(400);
            return next(new Error(error.error.description));
        }
        next(error);
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

        const p_secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', p_secret)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Payment is successful
            const order = await Order.findById(order_id).populate('user', 'name email');
            if (order) {
                order.paymentInfo = {
                    method: 'Online',
                    status: 'Paid',
                    transactionId: razorpay_payment_id,
                };
                const updatedOrder = await order.save();

                try {
                    const pdfBuffer = await generateInvoice(order);
                    await sendEmail({
                        email: order.user.email,
                        subject: 'Payment Successful - MedEasy Order Confirmation',
                        message: `Dear ${order.user.name},\n\nYour online payment was successful and your order is confirmed. Please find the invoice attached.\n\nThank you for shopping with MedEasy!`,
                        orderId: order._id
                    }, pdfBuffer);
                } catch (err) {
                    console.error('Invoice Email Error:', err);
                }

                res.status(200).json({ message: 'Payment verified successfully', order: updatedOrder });
            } else {
                res.status(404);
                throw new Error('Order not found');
            }
        } else {
            res.status(400);
            throw new Error('Invalid signature sent!');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    verifyPayment,
};
