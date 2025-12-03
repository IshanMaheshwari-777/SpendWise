import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    icon:{
        type:String
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
},{timestamps:true});

export const Expense = mongoose.model('Expense', ExpenseSchema);