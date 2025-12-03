import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction.js';

// @desc    Get transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, type, category, sort } = req.query;

    const query = { user: req.user.id };

    // Search
    if (search) {
        query.text = { $regex: search, $options: 'i' };
    }

    // Filter
    if (type) {
        query.type = type;
    }
    if (category) {
        query.category = category;
    }

    // Sort
    let sortOption = { date: -1 }; // Default sort by date desc
    if (sort) {
        const [field, order] = sort.split(':');
        sortOption = { [field]: order === 'desc' ? -1 : 1 };
    }

    const transactions = await Transaction.find(query)
        .sort(sortOption)
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const count = await Transaction.countDocuments(query);

    res.status(200).json({
        transactions,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
    });
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the transaction user
    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.status(200).json(transaction);
});

// @desc    Set transaction
// @route   POST /api/transactions
// @access  Private
const setTransaction = asyncHandler(async (req, res) => {
    if (!req.body.text || !req.body.amount || !req.body.type || !req.body.category) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const transaction = await Transaction.create({
        text: req.body.text,
        amount: req.body.amount,
        type: req.body.type,
        category: req.body.category,
        user: req.user.id,
        date: req.body.date || Date.now(),
    });

    res.status(200).json(transaction);
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the transaction user
    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json(updatedTransaction);
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the transaction user
    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await transaction.deleteOne();

    res.status(200).json({ id: req.params.id });
});

export {
    getTransactions,
    getTransaction,
    setTransaction,
    updateTransaction,
    deleteTransaction,
};
