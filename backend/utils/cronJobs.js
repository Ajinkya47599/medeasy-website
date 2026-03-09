const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const Order = require('../models/Order');
const User = require('../models/User');
const generateInvoice = require('./generateInvoice');
const sendEmail = require('./sendEmail');

const startCronJobs = () => {
    // 1. Automated Subscription Orders (Runs daily at 10 AM)
    cron.schedule('0 10 * * *', async () => {
        console.log('Running daily subscription order processing...');
        try {
            const today = new Date();
            const activeSubs = await Subscription.find({
                status: 'Active',
                nextDeliveryDate: { $lte: today }
            }).populate('user', 'name email address phone').populate('medicine', 'name price image');

            for (const sub of activeSubs) {
                // Create automated order
                const orderItems = [{
                    name: sub.medicine.name,
                    qty: sub.qty,
                    image: sub.medicine.image,
                    price: sub.medicine.price,
                    medicine: sub.medicine._id
                }];

                const totalAmount = sub.medicine.price * sub.qty;

                const newOrder = new Order({
                    user: sub.user._id,
                    orderItems,
                    deliveryAddress: { address: sub.user.address || 'User Address', city: 'User City', postalCode: '000000', country: 'India' },
                    paymentMethod: 'Cash on Delivery',
                    totalAmount,
                });

                const savedOrder = await newOrder.save();

                // Push next delivery date
                const nextDate = new Date(sub.nextDeliveryDate);
                nextDate.setDate(nextDate.getDate() + sub.frequencyDays);
                sub.nextDeliveryDate = nextDate;
                await sub.save();

                // Send Email Invoice
                try {
                    const invoiceBuf = await generateInvoice(savedOrder);
                    await sendEmail({
                        email: sub.user.email,
                        subject: 'MedEasy - Automated Subscription Refill Order',
                        message: `Dear ${sub.user.name},\n\nYour automated prescription refill for ${sub.medicine.name} has been processed. Total amount is Rs. ${totalAmount} payable via Cash on Delivery.\n\nThank you for choosing MedEasy!`,
                        orderId: savedOrder._id
                    }, invoiceBuf);
                } catch (err) {
                    console.error('Automated Email Error:', err);
                }
            }
        } catch (error) {
            console.error('Subscription Cron Job Error:', error);
        }
    });

    // 2. Refill Reminders (Runs daily at 9 AM) - Reminds 3 days prior
    cron.schedule('0 9 * * *', async () => {
        console.log('Running daily subscription refill reminder check...');
        try {
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

            // Normalize dates to check only the day part
            const startOfDay = new Date(threeDaysFromNow);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(threeDaysFromNow);
            endOfDay.setHours(23, 59, 59, 999);

            const upcomingSubs = await Subscription.find({
                status: 'Active',
                nextDeliveryDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }).populate('user', 'name email').populate('medicine', 'name');

            for (const sub of upcomingSubs) {
                try {
                    await sendEmail({
                        email: sub.user.email,
                        subject: 'MedEasy - Upcoming Subscription Refill Reminder',
                        message: `Dear ${sub.user.name},\n\nJust a friendly reminder that your subscription refill for ${sub.medicine.name} is scheduled to be processed in 3 days (${threeDaysFromNow.toLocaleDateString()}). Please ensure someone is available at your address for Cash on Delivery.\n\nThank you for choosing MedEasy!`
                    });
                } catch (err) {
                    console.error('Refill Reminder Email Error:', err);
                }
            }
        } catch (error) {
            console.error('Refill Reminder Cron Error:', error);
        }
    });

    // 3. Prescription Renewal Reminders (Runs daily at 11 AM) - Reminds after 5 months
    cron.schedule('0 11 * * *', async () => {
        console.log('Running daily prescription renewal reminder check...');
        try {
            // Let's assume prescriptions should be renewed every 6 months (approx 180 days).
            // We'll remind them 150 days (approx 5 months) after upload.
            const reminderThreshold = new Date();
            reminderThreshold.setDate(reminderThreshold.getDate() - 150);

            // Normalize to find uploads exactly 150 days ago
            const startOfDay = new Date(reminderThreshold);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(reminderThreshold);
            endOfDay.setHours(23, 59, 59, 999);

            const usersWithExpiringPrescriptions = await User.find({
                'prescriptions': {
                    $elemMatch: {
                        status: 'Verified',
                        uploadedAt: {
                            $gte: startOfDay,
                            $lte: endOfDay
                        }
                    }
                }
            });

            for (const user of usersWithExpiringPrescriptions) {
                // Filter to only those prescriptions matching the timeframe to tell them which one
                const expiringPrescriptions = user.prescriptions.filter(p =>
                    p.status === 'Verified' &&
                    p.uploadedAt >= startOfDay &&
                    p.uploadedAt <= endOfDay
                );

                const prescriptionNames = expiringPrescriptions.map(p => p.name).join(', ');

                if (expiringPrescriptions.length > 0) {
                    try {
                        await sendEmail({
                            email: user.email,
                            subject: 'MedEasy - Prescription Renewal Reminder',
                            message: `Dear ${user.name},\n\nWe noticed that your prescription(s) for ${prescriptionNames} were uploaded 5 months ago and may be nearing expiration. To ensure uninterrupted service, please consider uploading renewed prescriptions via your MedEasy profile.\n\nThank you for choosing MedEasy!`
                        });
                    } catch (err) {
                        console.error('Prescription Renewal Email Error:', err);
                    }
                }
            }

        } catch (error) {
            console.error('Prescription Renewal Cron Error:', error);
        }
    });

    // 4. Medicine Time Reminders (Runs every minute)
    cron.schedule('* * * * *', async () => {
        try {
            // Get current time in Asia/Kolkata timezone mapping to HH:mm
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });

            // Find users who have an active reminder for this exact minute
            const users = await User.find({
                'medicineReminders': {
                    $elemMatch: {
                        isActive: true,
                        time: timeString
                    }
                }
            });

            for (const user of users) {
                // Determine which exact medicines need to be taken right now
                const dueReminders = user.medicineReminders.filter(r => r.isActive && r.time === timeString);

                if (dueReminders.length > 0) {
                    const medicineNames = dueReminders.map(r => r.medicineName).join(', ');

                    try {
                        await sendEmail({
                            email: user.email,
                            subject: `MedEasy - It's time to take your medication!`,
                            message: `Dear ${user.name},\n\nThis is your MedEasy reminder to take your scheduled medication(s):\n\n💊 ${medicineNames}\n\nPlease take them as prescribed.\n\nStay healthy,\nThe MedEasy Team`
                        });
                    } catch (emailErr) {
                        console.error(`Failed to send reminder email to ${user.email}:`, emailErr);
                    }
                }
            }
        } catch (error) {
            console.error('Medicine Time Reminder Cron Error:', error);
        }
    }, {
        timezone: "Asia/Kolkata"
    });
};

module.exports = startCronJobs;
