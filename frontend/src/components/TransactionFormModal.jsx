import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"

const TransactionFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        text: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                date: new Date(initialData.date).toISOString().split('T')[0],
            });
        } else {
            setFormData({
                text: '',
                amount: '',
                type: 'expense',
                category: '',
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] border-none shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary">
                        {initialData ? 'Edit Transaction' : 'Add Transaction'}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData ? 'Make changes to your transaction here.' : 'Add a new transaction to your records.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="text" className="font-semibold">Description</Label>
                        <Input
                            id="text"
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            placeholder="Groceries, Rent, Salary..."
                            required
                            className="bg-muted/50 border-none focus:ring-1"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount" className="font-semibold">Amount</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                required
                                className="pl-7 bg-muted/50 border-none focus:ring-1"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type" className="font-semibold">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger className="bg-muted/50 border-none focus:ring-1">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category" className="font-semibold">Category</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="Food, Transport..."
                                required
                                className="bg-muted/50 border-none focus:ring-1"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date" className="font-semibold">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                            className="bg-muted/50 border-none focus:ring-1"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                            {initialData ? 'Save Changes' : 'Add Transaction'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionFormModal;
