
import {Expense} from '../models/Expense.js';   
import xlsx from 'xlsx';
export const addExpense = async (req,res) => {
    const userId=req.user._id;
    try{
        const {icon,amount,category,date}=req.body;
        if (!amount || !category||!date) {
            return res.status(400).json({message:"Please provide all required fields"});
        }
        const newExpense=await Expense.create({
            userId,
            icon,
            amount,
            category,
            date: new Date(date)
        });
        res.status(201).json({newExpense});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
}};

export const getAllExpenses = async (req,res) => {
    const userId=req.user._id;
    try{
        const Expenses=await Expense.find({userId}).sort({date:-1});
        res.status(200).json({Expenses});
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
};
export const deleteExpense = async (req,res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id);
        const Expenses=await Expense.find({userId}).sort({date:-1});
        res.status(200).json({Expenses});    

    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
}}
export const downloadExpenseExcel = async (req,res) => {
    const userId=req.user._id;
    try{
        const Expenses=await Expense.find({userId}).sort({date:-1});
        const data=Expenses.map((item)=>({
            Category:item.category,
            Amount:item.amount,
            Date:item.date,

        }));
        const wb=xlsx.utils.book_new();
        const ws=xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws,"Expense");
        xlsx.writeFile(wb,"ExpenseData.xlsx");
        res.download('ExpenseData.xlsx');

 
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"}); 
}}