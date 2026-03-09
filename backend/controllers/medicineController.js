const Medicine = require('../models/Medicine');

// @desc    Fetch all medicines
// @route   GET /api/medicines
// @access  Public
const getMedicines = async (req, res, next) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: 'i' } },
                    { manufacturer: { $regex: req.query.keyword, $options: 'i' } },
                    { category: { $regex: req.query.keyword, $options: 'i' } },
                ],
            }
            : {};

        const category = req.query.category && req.query.category !== 'All' ? { category: req.query.category } : {};

        const filters = {};

        if (req.query.minPrice || req.query.maxPrice) {
            filters.price = {};
            if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
        }

        if (req.query.inStock === 'true') {
            filters.stock = { $gt: 0 };
        }

        const query = { ...keyword, ...category, ...filters };
        let mongoQuery = Medicine.find(query);

        if (req.query.limit) {
            mongoQuery = mongoQuery.limit(Number(req.query.limit));
        }

        const medicines = await mongoQuery;
        res.json(medicines);
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single medicine
// @route   GET /api/medicines/:id
// @access  Public
const getMedicineById = async (req, res, next) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (medicine) {
            res.json(medicine);
        } else {
            res.status(404);
            throw new Error('Medicine not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a medicine
// @route   POST /api/medicines
// @access  Private/Admin
const createMedicine = async (req, res, next) => {
    try {
        const medicine = new Medicine({
            name: 'Sample name',
            price: 0,
            image: '/images/sample.jpg',
            category: 'Sample category',
            stock: 0,
            description: 'Sample description',
            requiresPrescription: false,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
        });

        const createdMedicine = await medicine.save();
        res.status(201).json(createdMedicine);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
const updateMedicine = async (req, res, next) => {
    try {
        const {
            name,
            price,
            description,
            image,
            category,
            stock,
            requiresPrescription,
            expiryDate,
        } = req.body;

        const medicine = await Medicine.findById(req.params.id);

        if (medicine) {
            medicine.name = name || medicine.name;
            medicine.price = price !== undefined ? price : medicine.price;
            medicine.description = description || medicine.description;
            medicine.image = image || medicine.image;
            medicine.category = category || medicine.category;
            medicine.stock = stock !== undefined ? stock : medicine.stock;
            if (requiresPrescription !== undefined) {
                medicine.requiresPrescription = requiresPrescription;
            }
            medicine.expiryDate = expiryDate || medicine.expiryDate;

            const updatedMedicine = await medicine.save();
            res.json(updatedMedicine);
        } else {
            res.status(404);
            throw new Error('Medicine not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = async (req, res, next) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (medicine) {
            await Medicine.deleteOne({ _id: medicine._id });
            res.json({ message: 'Medicine removed' });
        } else {
            res.status(404);
            throw new Error('Medicine not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create new review
// @route   POST /api/medicines/:id/reviews
// @access  Private
const createMedicineReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const medicine = await Medicine.findById(req.params.id);

        if (medicine) {
            const alreadyReviewed = medicine.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400);
                throw new Error('Medicine already reviewed');
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            medicine.reviews.push(review);
            medicine.numReviews = medicine.reviews.length;
            medicine.rating =
                medicine.reviews.reduce((acc, item) => item.rating + acc, 0) /
                medicine.reviews.length;

            await medicine.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404);
            throw new Error('Medicine not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    createMedicineReview,
};
