const express = require('express');
const router = express.Router();
const {
    createSubscription,
    getMySubscriptions,
    cancelSubscription,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createSubscription);
router.route('/my').get(protect, getMySubscriptions);
router.route('/:id/cancel').put(protect, cancelSubscription);

module.exports = router;
