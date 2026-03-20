import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, CheckCircle } from 'lucide-react';

const MOCK_REVENUE_DATA = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
];

export default function ReportsPage() {
  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time performance metrics for your workspace.</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Avg. Deal Size', val: '$12,400', icon: <Target className="text-saas-neon" />, change: '+12%' },
          { label: 'Conversion Rate', val: '24.3%', icon: <TrendingUp className="text-purple-500" />, change: '+2.1%' },
          { label: 'Active Contacts', val: '1,284', icon: <Users className="text-blue-500" />, change: '+84' },
          { label: 'Win Ratio', val: '68%', icon: <CheckCircle className="text-green-500" />, change: '+5%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-saas-surface p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 dark:bg-saas-bg rounded-lg">{stat.icon}</div>
              <span className="text-xs font-bold text-saas-neon bg-saas-neon/10 px-2 py-1 rounded-md">{stat.change}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black text-black dark:text-white mt-1">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="flex-1 bg-white dark:bg-saas-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-black dark:text-white mb-6">Monthly Revenue Growth</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A2D" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#8A8A8E', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#8A8A8E', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E1E20', border: '1px solid #2A2A2D', borderRadius: '12px' }}
                itemStyle={{ color: '#B2FF4D', fontWeight: 'bold' }}
              />
              <Bar dataKey="revenue" fill="#B2FF4D" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}