import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const SummaryCards = ({ transactions }) => {
    const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 to-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-primary">Total Balance</CardTitle>
                    <div className="p-2 bg-primary/20 rounded-full">
                        <Wallet className="h-4 w-4 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">${balance.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Current available balance
                    </p>
                </CardContent>
            </Card>
            <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-600">Total Income</CardTitle>
                    <div className="p-2 bg-emerald-100 rounded-full">
                        <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">+${income.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Total earnings this period
                    </p>
                </CardContent>
            </Card>
            <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-rose-600">Total Expenses</CardTitle>
                    <div className="p-2 bg-rose-100 rounded-full">
                        <ArrowDownCircle className="h-4 w-4 text-rose-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-rose-600">-${expense.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Total spending this period
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SummaryCards;
