import { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import AuthContext from '../context/AuthContext';
import SummaryCards from '../components/SummaryCards';
import TransactionFormModal from '../components/TransactionFormModal';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, MoreHorizontal, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Filters and Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sort, setSort] = useState('date:desc');

    const fetchTransactions = async () => {
        try {
            const { data } = await API.get('/transactions', {
                params: {
                    page,
                    limit: 5,
                    search,
                    type: typeFilter === 'all' ? '' : typeFilter,
                    category: categoryFilter,
                    sort,
                },
            });
            setTransactions(data.transactions);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, search, typeFilter, categoryFilter, sort]);

    const handleAddTransaction = async (formData) => {
        try {
            await API.post('/transactions', formData);
            setIsModalOpen(false);
            fetchTransactions();
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleUpdateTransaction = async (formData) => {
        try {
            await API.put(`/transactions/${editingTransaction._id}`, formData);
            setEditingTransaction(null);
            setIsModalOpen(false);
            fetchTransactions();
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    const handleDeleteTransaction = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await API.delete(`/transactions/${id}`);
                fetchTransactions();
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    const openEditModal = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    // Chart Data
    const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const chartData = [
        { name: 'Income', value: income, color: '#10b981' }, // Emerald-500
        { name: 'Expense', value: expense, color: '#ef4444' }, // Red-500
    ];

    return (
        <div className="container mx-auto py-10 space-y-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.name}. Here's your financial overview.
                    </p>
                </div>
                <Button onClick={openAddModal} className="shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <SummaryCards transactions={transactions} />

                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>
                                Manage your financial history.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
                                <div className="flex-1 w-full">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search transactions..."
                                            className="pl-9 bg-muted/50 border-none focus:ring-1"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-[140px] bg-muted/50 border-none">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="income">Income</SelectItem>
                                            <SelectItem value="expense">Expense</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={sort} onValueChange={setSort}>
                                        <SelectTrigger className="w-[160px] bg-muted/50 border-none">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date:desc">Newest First</SelectItem>
                                            <SelectItem value="date:asc">Oldest First</SelectItem>
                                            <SelectItem value="amount:desc">Highest Amount</SelectItem>
                                            <SelectItem value="amount:asc">Lowest Amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-card overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                    Loading transactions...
                                                </TableCell>
                                            </TableRow>
                                        ) : transactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                    No transactions found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            transactions.map((transaction) => (
                                                <TableRow key={transaction._id} className="group">
                                                    <TableCell className="font-medium text-muted-foreground">
                                                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-foreground">{transaction.text}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="font-normal">
                                                            {transaction.category}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={transaction.type === 'income' ? 'success' : 'danger'}
                                                            className="capitalize"
                                                        >
                                                            {transaction.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className={`text-right font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                                                        }`}>
                                                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => openEditModal(transaction)}>
                                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDeleteTransaction(transaction._id)}
                                                                    className="text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex items-center justify-end space-x-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="border-none shadow-md h-fit">
                        <CardHeader>
                            <CardTitle>Financial Overview</CardTitle>
                            <CardDescription>Income vs Expenses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                {income === 0 && expense === 0 ? (
                                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                        No data to display
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => `$${value.toFixed(2)}`}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <TransactionFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                initialData={editingTransaction}
            />
        </div>
    );
};

export default Dashboard;
