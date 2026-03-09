const Order = require('../models/Order');
const generateInvoice = require('../utils/generateInvoice');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
    try {
        const {
            orderItems,
            deliveryAddress,
            paymentMethod,
            totalAmount,
            prescriptionImage,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                deliveryAddress,
                paymentMethod,
                totalAmount,
                prescriptionImage,
            });

            const createdOrder = await order.save();
            const populatedOrder = await Order.findById(createdOrder._id).populate('user', 'name email');

            if (paymentMethod === 'Cash on Delivery') {
                try {
                    const pdfBuffer = await generateInvoice(populatedOrder);
                    await sendEmail({
                        email: populatedOrder.user.email,
                        subject: 'Order Confirmation - MedEasy',
                        message: `Dear ${populatedOrder.user.name},\n\nYour order has been placed successfully. Please find the invoice attached.\n\nThank you for shopping with MedEasy!`,
                        orderId: populatedOrder._id
                    }, pdfBuffer);
                } catch (err) {
                    console.error('Invoice Email Error:', err);
                }
            }

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email phone'
        );

        if (order) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            order.orderStatus = req.body.status || order.orderStatus;
            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
                order.paymentStatus = 'Completed';
            }

            const updatedOrder = await order.save();

            // Send email notification upon status update
            try {
                if (['Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(updatedOrder.orderStatus)) {
                    await sendEmail({
                        email: order.user.email,
                        subject: `Order ${updatedOrder.orderStatus} - MedEasy`,
                        message: `Dear ${order.user.name},\n\nThe status of your order (${updatedOrder._id.toString().substring(0, 8)}) has been updated to: ${updatedOrder.orderStatus}.\n\nThank you for choosing MedEasy!`
                    });
                }
            } catch (emailErr) {
                console.error('Status Update Email Error:', emailErr);
            }

            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc   Get admin dashboard stats
// @route  GET /api/orders/admin/stats
// @access Private/Admin
const getDashboardStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.find(query);
        const totalSales = orders.reduce((acc, item) => acc + item.totalAmount, 0);
        const totalOrders = orders.length;

        const Medicine = require('../models/Medicine');
        const medicines = await Medicine.find({});
        const lowStock = medicines.filter(m => m.stock < 10).length;

        res.json({
            totalSales,
            totalOrders,
            lowStock
        });
    } catch (error) {
        next(error);
    }
}

// @desc   Get orders for a specific user
// @route  GET /api/orders/user/:id
// @access Private/Admin
const getUserOrdersByAdmin = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.params.id })
            .populate('user', 'name email phone')
            .populate('orderItems.medicine', 'name')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc   Download Invoice / Packing Slip
// @route  GET /api/orders/:id/invoice
// @access Private/Admin
const downloadInvoice = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email phone');
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        const pdfBuffer = await generateInvoice(order);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice-${order._id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getOrders,
    getDashboardStats,
    downloadInvoice,
    getUserOrdersByAdmin
};
