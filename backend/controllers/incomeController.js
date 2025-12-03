
import {Income} from '../models/Income.js';   
import xlsx from 'xlsx';
export const addIncome = async (req,res) => {
    const userId=req.user._id;
    try{
        const {icon,amount,source,date}=req.body;
        if (!amount || !source||!date) {
            return res.status(400).json({message:"Please provide all required fields"});
        }
        const newIncome=await Income.create({
            userId,
            icon,
            amount,
            source,
            date: new Date(date)
        });
        res.status(201).json({newIncome});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
}};

export const getAllIncomes = async (req,res) => {
    const userId=req.user._id;
    try{
        const incomes=await Income.find({userId}).sort({date:-1});
        res.status(200).json({incomes});
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
};
export const deleteIncome = async (req,res) => {
    try{
        await Income.findByIdAndDelete(req.params.id);
        const incomes=await Income.find({userId}).sort({date:-1});
        res.status(200).json({incomes});    

    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
}}
export const downloadIncomeExcel = async (req,res) => {
    const userId=req.user._id;
    try{
        const incomes=await Income.find({userId}).sort({date:-1});
        const data=incomes.map((item)=>({
            Source:item.source,
            Amount:item.amount,
            Date:item.date,

        }));
        const wb=xlsx.utils.book_new();
        const ws=xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws,"Income");
        xlsx.writeFile(wb,"IncomeData.xlsx");
        res.download('IncomeData.xlsx');

 
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"}); 
}}