import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        text: {
            type: String,
            required: [true, 'Please add a text description'],
        },
        amount: {
            type: Number,
            required: [true, 'Please add a positive or negative number'],
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: [true, 'Please specify type (income or expense)'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
