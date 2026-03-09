const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    getUsers,
    toggleBlockUser,
    addPrescription,
    getMyPrescriptions,
    deletePrescription,
    getWishlist,
    toggleWishlist,
    sendOtp,
    getAllPrescriptionsAdmin,
    updatePrescriptionStatus,
    addReminder,
    getReminders,
    deleteReminder,
    toggleReminder,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.post('/send-otp', sendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.route('/profile').get(protect, getUserProfile);
router.route('/:id/block').put(protect, admin, toggleBlockUser);

// Prescription Wallet Routes
router.route('/prescriptions/admin').get(protect, admin, getAllPrescriptionsAdmin);
router.route('/prescriptions/admin/:userId/:prescriptionId').put(protect, admin, updatePrescriptionStatus);
router.route('/prescriptions').post(protect, addPrescription).get(protect, getMyPrescriptions);
router.route('/prescriptions/:prescId').delete(protect, deletePrescription);

// Medicine Reminder Routes
router.route('/reminders').post(protect, addReminder).get(protect, getReminders);
router.route('/reminders/:reminderId').delete(protect, deleteReminder);
router.route('/reminders/:reminderId/toggle').put(protect, toggleReminder);

// Wishlist Routes
router.route('/wishlist').get(protect, getWishlist).post(protect, toggleWishlist);

module.exports = router;
