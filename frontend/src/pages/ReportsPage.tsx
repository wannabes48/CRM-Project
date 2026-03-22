import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import api from '../contexts/AuthContext'; // Make sure this path points to your Axios instance!

export default function ReportsPage() {
  const [data, setData] = useState<{ kpis: any; chart_data: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('analytics/');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        setError('Unable to load reporting data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-saas-neon" size={40} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500">
        <AlertCircle size={40} className="mb-4 text-red-500" />
        <p>{error}</p>
      </div>
    );
  }

  // Combine the dynamic API data with your static UI icons/labels
  const kpiStats = [
    { label: 'Avg. Deal Size', val: data.kpis.avg_deal_size, icon: <Target className="text-saas-neon" />, change: 'Real-time' },
    { label: 'Total Won Deals', val: data.kpis.total_won, icon: <TrendingUp className="text-purple-500" />, change: 'Real-time' },
    { label: 'Active Contacts', val: data.kpis.active_contacts, icon: <Users className="text-blue-500" />, change: 'Real-time' },
    { label: 'Win Ratio', val: data.kpis.win_ratio, icon: <CheckCircle className="text-green-500" />, change: 'Real-time' },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time performance metrics for your workspace.</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpiStats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#151516] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">{stat.icon}</div>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{stat.change}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black text-black dark:text-white mt-1">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="flex-1 bg-white dark:bg-[#151516] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-black dark:text-white mb-6">Monthly Revenue (Won Deals)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chart_data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A2D" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#8A8A8E', fontSize: 12}} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#8A8A8E', fontSize: 12}} 
                tickFormatter={(value) => `$${value}`} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E1E20', border: '1px solid #2A2A2D', borderRadius: '12px' }}
                itemStyle={{ color: '#B2FF4D', fontWeight: 'bold' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#B2FF4D" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}