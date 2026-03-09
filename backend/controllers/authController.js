const User = require('../models/User'); // Forced restart for .env update
const OTP = require('../models/OTP');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && user.isBlocked) {
            res.status(403);
            throw new Error('User is blocked by admin');
        }

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, address, otp } = req.body;

        if (!otp) {
            res.status(400);
            throw new Error('OTP is required');
        }

        const validOtp = await OTP.findOne({ email, otp });
        if (!validOtp) {
            res.status(400);
            throw new Error('Invalid or expired OTP');
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User with this email already exists');
        }

        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
            res.status(400);
            throw new Error('User with this phone number already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            address,
        });

        if (user) {
            await OTP.deleteOne({ email, otp });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Send OTP to email
// @route   POST /api/users/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400);
            throw new Error('Email is required');
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User with this email already exists');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.deleteMany({ email }); // Delete older OTPs for this email

        await OTP.create({
            email,
            otp,
        });

        const subject = 'Your MedEasy Registration OTP';
        const message = `Your OTP for registration is: ${otp}. It is valid for 5 minutes.`;

        console.log(`[DEV ONLY] OTP for ${email} is: ${otp}`);

        try {
            await sendEmail({
                email,
                subject,
                message,
            });
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError.message);
            // In dev mode we might resolve without error, but in prod we'd throw
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Block or unblock user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isBlocked = !user.isBlocked;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isBlocked: updatedUser.isBlocked,
                role: updatedUser.role
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Add a prescription to user's wallet
// @route   POST /api/users/prescriptions
// @access  Private
const addPrescription = async (req, res, next) => {
    try {
        const { imageUrl, name } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.prescriptions.push({ imageUrl, name, status: 'Verified' }); // Auto-verifying for demo purposes
            await user.save();
            res.status(201).json(user.prescriptions);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's prescriptions
// @route   GET /api/users/prescriptions
// @access  Private
const getMyPrescriptions = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.prescriptions);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a prescription
// @route   DELETE /api/users/prescriptions/:prescId
// @access  Private
const deletePrescription = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.prescriptions = user.prescriptions.filter(
                (p) => p._id.toString() !== req.params.prescId
            );
            await user.save();
            res.json(user.prescriptions);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get User Wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist', 'name price image stock category');
        if (user) {
            res.json(user.wishlist);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle Medicine in Wishlist
// @route   POST /api/users/wishlist
// @access  Private
const toggleWishlist = async (req, res, next) => {
    try {
        const { medicineId } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            const isLiked = user.wishlist.includes(medicineId);
            if (isLiked) {
                user.wishlist.pull(medicineId);
            } else {
                user.wishlist.push(medicineId);
            }
            await user.save();
            res.json(user.wishlist);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all user prescriptions (Admin)
// @route   GET /api/users/prescriptions/admin
// @access  Private/Admin
const getAllPrescriptionsAdmin = async (req, res, next) => {
    try {
        const users = await User.find({ 'prescriptions.0': { $exists: true } }).select('name email phone address prescriptions');

        let allPrescriptions = [];
        users.forEach(user => {
            user.prescriptions.forEach(p => {
                allPrescriptions.push({
                    _id: p._id,
                    userId: user._id,
                    userName: user.name,
                    userPhone: user.phone,
                    userAddress: user.address,
                    imageUrl: p.imageUrl,
                    name: p.name,
                    status: p.status,
                    uploadedAt: p.uploadedAt
                });
            });
        });

        // Sort by uploadedAt descending
        allPrescriptions.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

        res.json(allPrescriptions);
    } catch (error) {
        next(error);
    }
};

// @desc    Update prescription status
// @route   PUT /api/users/prescriptions/admin/:userId/:prescriptionId
// @access  Private/Admin
const updatePrescriptionStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.userId);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const prescription = user.prescriptions.id(req.params.prescriptionId);

        if (!prescription) {
            res.status(404);
            throw new Error('Prescription not found');
        }

        prescription.status = status;
        await user.save();

        // Send email notification
        try {
            const subject = `Your Prescription has been ${status}`;
            let message = `Hello ${user.name},\n\nYour uploaded prescription "${prescription.name}" has been reviewed by our pharmacy team and its status is now: ${status}.\n\n`;

            if (status === 'Rejected' && req.body.rejectionReason) {
                message += `Reason for Rejection: ${req.body.rejectionReason}\n\n`;
                message += `Please review the reason and upload a new valid prescription.\n`;
            } else if (status === 'Verified') {
                message += `You can now proceed to checkout with the medicines linked to this prescription.\n`;
            }
            message += `\nThank you,\nMedEasy Pharmacy`;

            await sendEmail({
                email: user.email,
                subject: subject,
                message: message
            });
        } catch (emailError) {
            console.error('Failed to send prescription status email:', emailError);
            // Non-fatal, we still updated the status
        }

        res.json({ message: 'Prescription status updated successfully', prescription });
    } catch (error) {
        next(error);
    }
};

// @desc    Add a medicine reminder
// @route   POST /api/users/reminders
// @access  Private
const addReminder = async (req, res, next) => {
    try {
        const { medicineName, time } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.medicineReminders.push({ medicineName, time, isActive: true });
            await user.save();
            res.status(201).json(user.medicineReminders);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's medicine reminders
// @route   GET /api/users/reminders
// @access  Private
const getReminders = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.medicineReminders);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a reminder
// @route   DELETE /api/users/reminders/:reminderId
// @access  Private
const deleteReminder = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.medicineReminders = user.medicineReminders.filter(
                (r) => r._id.toString() !== req.params.reminderId
            );
            await user.save();
            res.json(user.medicineReminders);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle reminder active status
// @route   PUT /api/users/reminders/:reminderId/toggle
// @access  Private
const toggleReminder = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const reminder = user.medicineReminders.id(req.params.reminderId);
            if (reminder) {
                reminder.isActive = !reminder.isActive;
                await user.save();
                res.json(user.medicineReminders);
            } else {
                res.status(404);
                throw new Error('Reminder not found');
            }
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot Password - Send reset link
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error('Email not found');
        }

        // Generate a random token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash it before saving to DB for security, but we send the raw one in the email
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save({ validateBeforeSave: false });

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `You requested to reset your password. Click the link below to reset it. This link will expire in 15 minutes.\n\n${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'MedEasy - Password Reset Request',
                message,
            });

            res.status(200).json({ message: 'Password reset link sent to your email' });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });

            console.error('Email error:', error);
            res.status(500);
            throw new Error('Email could not be sent');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password using token
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        // Hash the incoming raw token to compare with DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400);
            throw new Error('Invalid or expired password reset token');
        }

        user.password = newPassword; // the pre('save') hook handles hashing this
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authUser,
    registerUser,
    sendOtp,
    getUserProfile,
    getUsers,
    toggleBlockUser,
    addPrescription,
    getMyPrescriptions,
    deletePrescription,
    getWishlist,
    toggleWishlist,
    getAllPrescriptionsAdmin,
    updatePrescriptionStatus,
    addReminder,
    getReminders,
    deleteReminder,
    toggleReminder,
    forgotPassword,
    resetPassword
};
