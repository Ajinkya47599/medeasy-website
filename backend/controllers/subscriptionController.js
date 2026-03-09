const Subscription = require('../models/Subscription');
const Medicine = require('../models/Medicine');

// @desc    Create a new subscription
// @route   POST /api/subscriptions
// @access  Private
const createSubscription = async (req, res, next) => {
    try {
        const { medicine, qty, frequencyDays } = req.body;

        const med = await Medicine.findById(medicine);
        if (!med) {
            res.status(404);
            throw new Error('Medicine not found');
        }

        const nextDeliveryDate = new Date();
        nextDeliveryDate.setDate(nextDeliveryDate.getDate() + Number(frequencyDays));

        const sub = new Subscription({
            user: req.user._id,
            medicine,
            qty,
            frequencyDays,
            nextDeliveryDate,
        });

        const createdSub = await sub.save();
        res.status(201).json(createdSub);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user subscriptions
// @route   GET /api/subscriptions/my
// @access  Private
const getMySubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user._id })
            .populate('medicine', 'name price image category')
            .sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/:id/cancel
// @access  Private
const cancelSubscription = async (req, res, next) => {
    try {
        const sub = await Subscription.findById(req.params.id);

        if (sub && sub.user.toString() === req.user._id.toString()) {
            sub.status = 'Cancelled';
            const updatedSub = await sub.save();
            res.json(updatedSub);
        } else {
            res.status(404);
            throw new Error('Subscription not found or not authorized');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSubscription,
    getMySubscriptions,
    cancelSubscription,
};
