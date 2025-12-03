import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import { addIncome, getAllIncomes, deleteIncome, downloadIncomeExcel } from '../controllers/incomeController.js';

router.post('/add', protect, addIncome);
router.get('/all', protect, getAllIncomes);
router.get('/download-excel', protect, downloadIncomeExcel);
router.delete('/:id', protect, deleteIncome);

export default router;