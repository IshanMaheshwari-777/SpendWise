import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import { addExpense ,getAllExpenses, deleteExpense, downloadExpenseExcel } from '../controllers/expenseController.js';

router.post('/add', protect, addExpense);
router.get('/all', protect, getAllExpenses);
router.get('/download-excel', protect, downloadExpenseExcel);
router.delete('/:id', protect, deleteExpense);

export default router;