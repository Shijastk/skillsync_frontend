import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Wallet, TrendingUp, DollarSign, Settings, Plus } from 'lucide-react';
import { Card, Button, CustomSelect, Tabs, Badge } from '../Components/common';
import { useUserTransactions, useCreateTransaction } from '../hooks/useTransactions';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../Components/common/LoadingSpinner';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const { user, updateUser } = useAuthContext();
  const { success, error } = useToast();
  const { data: transactionsData, isLoading } = useUserTransactions(user?.id);
  const createTransactionMutation = useCreateTransaction();

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0 || amount > (user.credits || 0)) {
      error("Invalid amount");
      return;
    }

    try {
      // 1. Create Debit Transaction
      await createTransactionMutation.mutateAsync({
        userId: user.id,
        type: 'debit',
        amount: amount,
        description: `Withdrawal via ${paymentMethod || 'Bank Transfer'}`,
        timestamp: new Date().toISOString(),
        status: 'completed'
      });

      // 2. Update User Balance
      // Note: In a real app backend handles this transactionally.
      // Here we mock it by updating user context context/backend
      const newCredits = (user.credits || 0) - amount;
      await updateUser({ credits: newCredits }); // Assuming updateUser calls API

      setWithdrawAmount('');
      success(`Successfully withdrew $${amount.toFixed(2)}`);
    } catch (err) {
      error("Withdrawal failed: " + err.message);
    }
  };

  const { stats, processedTransactions, chartData, categoryData } = useMemo(() => {
    if (!transactionsData) return {
      stats: { total: 0, available: 0, inEscrow: 0, thisMonth: 0, change: 0 },
      processedTransactions: [],
      chartData: [],
      categoryData: []
    };

    // 1. Process Transactions
    const sorted = [...transactionsData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // 2. Calculate Chart Data (Last 6 months)
    const months = {};
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      months[key] = { month: key, income: 0, expenses: 0 };
    }

    sorted.forEach(t => {
      const d = new Date(t.timestamp);
      const key = d.toLocaleString('default', { month: 'short' });
      if (months[key]) {
        if (t.type === 'credit') months[key].income += t.amount;
        else months[key].expenses += t.amount;
      }
    });
    const chartDataArray = Object.values(months);

    // 3. Stats
    const currentMonth = today.toLocaleString('default', { month: 'short' });
    const thisMonthStats = months[currentMonth];
    const incomeThisMonth = thisMonthStats ? thisMonthStats.income : 0;

    // Mock category data as we don't have categorised transactions
    const mockCategories = [
      { name: 'Development', value: 45 },
      { name: 'Design', value: 30 },
      { name: 'Mentoring', value: 25 },
    ];

    return {
      stats: {
        total: user.credits || 0, // Source of truth is user balance
        available: user.credits || 0,
        inEscrow: 0, // Mock
        thisMonth: incomeThisMonth,
        change: 12 // Mock trend
      },
      processedTransactions: sorted,
      chartData: chartDataArray,
      categoryData: mockCategories
    };
  }, [transactionsData, user]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'withdraw', label: 'Withdraw', icon: DollarSign },
  ];

  // Balance cards
  const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
          {Icon ? <Icon className="text-white" size={24} /> : <span className="text-white font-bold">$</span>}
        </div>
      </div>
      {subtitle && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
      )}
      {trend && (
        <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </p>
      )}
    </Card>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">SkillSwap Wallet</h1>
              <p className="text-gray-600 mt-1">Manage your earnings and transactions</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" leftIcon={<Settings size={18} />}>
                Settings
              </Button>
              <Button variant="primary" leftIcon={<Plus size={18} />}>
                Add Funds
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
          className="mb-8"
        />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Balance"
                value={`$${stats.total.toFixed(2)}`}
                subtitle={
                  <>
                    Available: <span className="font-semibold">${stats.available.toFixed(2)}</span>
                    <br />
                    In Escrow: <span className="font-semibold">${stats.inEscrow.toFixed(2)}</span>
                  </>
                }
              />
              <StatCard
                title="This Month"
                value={`+$${stats.thisMonth.toLocaleString()}`}
                trend={stats.change}
              />
              <StatCard
                title="Active Skills"
                value={3} // Mock
                subtitle={`2 skills earning`}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income vs Expenses Chart */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Area type="monotone" dataKey="income" stroke="#000000" fill="#000000" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="expenses" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-8 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
                    <span className="text-sm">Income</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                    <span className="text-sm">Expenses</span>
                  </div>
                </div>
              </Card>

              {/* Earnings by Category */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Earnings by Skill Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#000000' : '#4b5563'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: index % 2 === 0 ? '#000000' : '#4b5563' }}></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <Button variant="ghost" size="sm">View All →</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-gray-600 font-medium text-sm">Type</th>
                      <th className="text-left py-3 text-gray-600 font-medium text-sm">Description</th>
                      <th className="text-left py-3 text-gray-600 font-medium text-sm">Amount</th>
                      <th className="text-left py-3 text-gray-600 font-medium text-sm">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedTransactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4">
                          <Badge variant={transaction.type === 'credit' ? 'success' : 'danger'} size="sm">
                            {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                          </Badge>
                        </td>
                        <td className="py-4 font-medium">{transaction.description}</td>
                        <td className={`py-4 font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                        </td>
                        <td className="py-4 text-gray-500">{new Date(transaction.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {processedTransactions.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">No transactions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <p className="text-center text-gray-500 py-10">Advanced analytics coming soon!</p>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <Card>
            <h3 className="text-lg font-semibold mb-6">Withdraw Funds</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none"
                    placeholder="Enter amount"
                    max={stats.available}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Available: ${stats.available.toFixed(2)}</p>
              </div>

              <CustomSelect
                label="Payment Method"
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={['PayPal', 'Bank Transfer', 'Stripe'].map(m => ({ value: m, label: m }))}
                placeholder="Select payment method"
              />

              <Button
                variant="primary"
                fullWidth
                onClick={handleWithdraw}
                isLoading={createTransactionMutation.isPending}
              >
                Withdraw Funds
              </Button>

              <Card noPadding className="bg-gray-50 p-4">
                <h4 className="font-semibold mb-2">Withdrawal Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Minimum withdrawal amount is $50.00</li>
                  <li>• Processing time is 1-3 business days</li>
                  <li>• No fees for standard withdrawals</li>
                </ul>
              </Card>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default WalletPage;
