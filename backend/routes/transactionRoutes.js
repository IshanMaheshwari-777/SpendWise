import express from 'express';
import {
    getTransactions,
    getTransaction,
    setTransaction,
    updateTransaction,
    deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getTransactions).post(protect, setTransaction);
router.route('/:id').get(protect, getTransaction).delete(protect, deleteTransaction).put(protect, updateTransaction);

export default router;
