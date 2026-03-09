const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        address: { type: String, required: true },
        role: { type: String, required: true, default: 'user', enum: ['user', 'admin'] },
        isBlocked: { type: Boolean, required: true, default: false },
        prescriptions: [{
            imageUrl: { type: String, required: true },
            name: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
            status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
        }],
        wishlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine'
        }],
        medicineReminders: [{
            medicineName: { type: String, required: true },
            time: { type: String, required: true }, // Format HH:mm
            isActive: { type: Boolean, default: true }
        }],
        resetPasswordToken: String,
        resetPasswordExpires: Date
    },
    {
        timestamps: true,
    }
);

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        if (typeof next === 'function') next();
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    if (typeof next === 'function') next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
