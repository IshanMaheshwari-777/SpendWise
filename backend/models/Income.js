import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema({
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
    source: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
},{timestamps:true});

export const Income = mongoose.model('Income', IncomeSchema);