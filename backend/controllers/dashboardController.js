import {Income} from "../models/Income.js";
import {Expense} from "../models/Expense.js";

import { isValidObjectId,Types } from "mongoose";

export const getDashboardData=async(req,res)=>{
    const userId=req.user._id;

    try{
        const userObjectId=new Types.ObjectId(String(userId));
        const totalIncomeAgg=await Income.aggregate([
            {$match:{userId:userObjectId}},
            {
                $group:{
                    _id:null,
                    total:{$sum:"$amount"} } },
            ])
        const totalExpenseAgg=await Expense.aggregate([
            {$match:{userId:userObjectId}},
            {
                $group:{
                    _id:null,
                    total:{$sum:"$amount"} } },
            ])
        const last60DaysIncomeTransactions=await Income.find({
            userId,
            date:{$gte:new Date(Date.now()-60*24*60*60*1000)}
        }).sort({date:-1});
        const incomeLast60Days=last60DaysIncomeTransactions.reduce((acc,curr)=>acc+curr.amount,0);

        const last30DaysExpenseTransactions=await Expense.find({
            userId,
            date:{$gte:new Date(Date.now()-30*24*60*60*1000)}
        }).sort({date:-1});
        const expenseLast30Days=last30DaysExpenseTransactions.reduce((acc,curr)=>acc+curr.amount,0);


        const lastTransactions=[
            ...(await Income.find({userId}).sort({date:-1}).limit(5)).map(txn=>({...txn.toObject(),type:"income"})),
            ...(await Expense.find({userId}).sort({date:-1}).limit(5)).map(txn=>({...txn.toObject(),type:"expense"}))
        ].sort((a,b)=>b.date-a.date)

        res.json({
            totalBalance:(totalIncomeAgg[0]?.total || 0)-(totalExpenseAgg[0]?.total || 0),
            totalIncome:totalIncomeAgg[0]?.total || 0,
            totalExpense:totalExpenseAgg[0]?.total || 0,
            last30DaysExpenses:{
                total:expenseLast30Days,
                transactions:last30DaysExpenseTransactions
            },
            last60DaysIncome:{
                total:incomeLast60Days,
                transactions:last60DaysIncomeTransactions
            },
            recentTransactions:{lastTransactions}
        })

    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
}