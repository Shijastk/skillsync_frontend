import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { Wallet, TrendingUp, Trophy, Gift, Zap, Award } from 'lucide-react';
import { Card, Button, Tabs, Badge } from '../Components/common';
import { useWallet, useWalletOpportunities } from '../hooks/useTransactions';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../Components/common/LoadingSpinner';

const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
        {Icon ? <Icon className="text-white" size={24} /> : <span className="text-white font-bold">C</span>}
      </div>
    </div>
    {subtitle && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
    )}
    {trend !== undefined && (
      <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-gray-500'}`}>
        {trend > 0 ? '+' : ''}{trend} this month
      </p>
    )}
  </Card>
);

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { success } = useToast();

  const handleOpportunityClick = (opp) => {
    if (opp.type === 'swap_complete') {
      navigate('/');
    } else if (opp.type === 'profile_complete') {
      navigate('/profile/edit');
    } else if (opp.type === 'post_create') {
      navigate('/community');
    } else if (opp.type === 'referral') {
      if (opp.referralCode) {
        navigator.clipboard.writeText(opp.referralCode);
        success("Referral code copied to clipboard!");
      }
    }
  };

  // Fetch Transactions History & Earning Opportunities
  const { data: walletData, isLoading: isLoadingWallet } = useWallet();
  const { data: opportunitiesData, isLoading: isLoadingOpp } = useWalletOpportunities();

  // Extract transactions directly from wallet API response
  const transactionsData = walletData?.transactions || [];

  const { stats, processedTransactions, chartData } = useMemo(() => {
    if (!transactionsData) return {
      stats: { total: 0, earnedAllTime: 0, thisMonth: 0 },
      processedTransactions: [],
      chartData: []
    };

    // 1. Process Transactions
    const sorted = [...transactionsData].sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));

    // 2. Stats Calculation
    const earnedAllTime = sorted
      .filter(t => t.type === 'earn' || t.type === 'bonus' || t.type === 'referral' || t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = sorted
      .filter(t => (t.type === 'earn' || t.type === 'bonus') && new Date(t.timestamp || t.createdAt) >= startOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    // 3. Chart Data
    const months = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      months[key] = { month: key, earned: 0, spent: 0 };
    }

    sorted.forEach(t => {
      const d = new Date(t.timestamp || t.createdAt);
      const key = d.toLocaleString('default', { month: 'short' });
      if (months[key]) {
        if (t.type === 'spend' || t.type === 'debit') months[key].spent += t.amount;
        else months[key].earned += t.amount;
      }
    });

    return {
      stats: {
        total: user?.skillcoins || 0,
        earnedAllTime,
        thisMonth
      },
      processedTransactions: sorted,
      chartData: Object.values(months)
    };
  }, [transactionsData, user]);

  const tabs = [
    { id: 'overview', label: 'My Wallet', icon: Wallet },
    { id: 'earn', label: 'Earn Skillcoins', icon: Trophy },
    { id: 'history', label: 'History', icon: TrendingUp },
  ];

  if (isLoadingWallet || isLoadingOpp) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">SkillCoin Balance</h1>
              <p className="text-gray-600 mt-1">Earn coins by swapping skills and helping others</p>
            </div>
            <div className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2">
              <span className="font-bold text-xl">{user?.skillcoins || 0}</span>
              <span className="text-xs uppercase tracking-wider opacity-80">Coins</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Current Balance"
                value={stats.total}
                subtitle="Available to spend on premium features"
                trend={stats.thisMonth}
              />
              <StatCard
                title="Total Earned"
                value={stats.earnedAllTime}
                subtitle="Lifetime earnings on SkillSwap"
                icon={Award}
              />
              <StatCard
                title="Reputation Level"
                value={`Lvl ${user?.level || 1}`}
                subtitle={`${user?.xp || 0} XP to next level`}
                icon={Zap}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4">Earnings Activity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Area type="monotone" dataKey="earned" stroke="#000000" fill="#000000" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Latest Activity</h3>
                </div>
                <div className="space-y-4">
                  {processedTransactions.slice(0, 5).map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'spend' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {t.type === 'spend' ? '↓' : '↑'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{t.description}</p>
                          <p className="text-xs text-gray-500">{new Date(t.timestamp || t.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${t.type === 'spend' ? 'text-red-600' : 'text-green-600'}`}>
                        {t.type === 'spend' ? '-' : '+'}{t.amount}
                      </span>
                    </div>
                  ))}
                  {processedTransactions.length === 0 && (
                    <p className="text-center text-gray-400 py-4">No activity yet</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Earn Tab */}
        {activeTab === 'earn' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunitiesData?.opportunities?.map((opp, idx) => (
              <Card key={idx} className={`relative overflow-hidden ${!opp.available ? 'opacity-75' : ''}`}>
                <div className="absolute top-0 right-0 p-4">
                  <span className="text-2xl">{opp.icon}</span>
                </div>
                <div className="pr-12">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{opp.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{opp.description}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="primary" size="lg">+{opp.reward} Coins</Badge>
                  </div>

                  {opp.progress !== undefined && opp.type.includes('milestone') ? (
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-black h-2 rounded-full" style={{ width: `${Math.min((opp.progress / 10) * 100, 100)}%` }}></div>
                      <p className="text-xs text-gray-500 mt-1">{opp.progress} / 10 swaps</p>
                    </div>
                  ) : opp.available ? (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => handleOpportunityClick(opp)}
                    >
                      {opp.type === 'referral' ? 'Copy Code' : 'Start Now'}
                    </Button>
                  ) : (
                    <Button variant="outline" fullWidth disabled>
                      Completed
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Card>
            <h3 className="text-lg font-semibold mb-6">Full Transaction History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-3 px-4 text-gray-600 font-medium text-sm">Date</th>
                    <th className="py-3 px-4 text-gray-600 font-medium text-sm">Activity</th>
                    <th className="py-3 px-4 text-gray-600 font-medium text-sm text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {processedTransactions.map((t, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(t.timestamp || t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {t.description}
                      </td>
                      <td className={`py-3 px-4 font-bold text-right ${t.type === 'spend' ? 'text-red-600' : 'text-green-600'}`}>
                        {t.type === 'spend' ? '-' : '+'}{t.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default WalletPage;
