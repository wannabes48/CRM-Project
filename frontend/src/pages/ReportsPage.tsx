import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import api from '../contexts/AuthContext'; 

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
      <div className="h-full flex flex-col items-center justify-center text-gray-500 py-20">
        <div className="p-10 bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/20 text-center shadow-2xl shadow-red-500/5">
           <AlertCircle size={48} className="mx-auto mb-6 text-red-500" />
           <p className="text-lg font-black text-red-600 dark:text-red-400 uppercase tracking-tighter mb-2">{error}</p>
           <p className="text-xs font-bold text-red-500/60 dark:text-red-400/40 uppercase tracking-widest">Please check your connection or contact support</p>
        </div>
      </div>
    );
  }

  const kpiStats = [
    { label: 'Avg. Deal Size', val: data.kpis.avg_deal_size, icon: Target, color: 'text-saas-neon', bgColor: 'bg-saas-neon/10' },
    { label: 'Total Won Deals', val: data.kpis.total_won, icon: TrendingUp, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { label: 'Active Contacts', val: data.kpis.active_contacts, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Win Ratio', val: data.kpis.win_ratio, icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 bg-saas-neon rounded-full"></div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Analytics</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-[0.2em] ml-4">Real-time performance metrics</p>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {kpiStats.map((stat, i) => (
          <div key={i} className="group bg-white dark:bg-saas-surface p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-saas-neon/5 transition-all duration-500 hover:-translate-y-1">
            <div className="flex justify-between items-center mb-6">
              <div className={`p-4 ${stat.bgColor} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={stat.color} size={24} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-saas-neon bg-saas-neon/10 px-3 py-1.5 rounded-full uppercase tracking-[0.2em]">
                <div className="w-1 h-1 rounded-full bg-saas-neon animate-pulse"></div>
                Live
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tabular-nums tracking-tighter">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="flex-1 bg-white dark:bg-saas-surface rounded-[3rem] border border-gray-100 dark:border-gray-800 p-10 shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between mb-12 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Monthly Revenue</h3>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Calculated from won deals</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-[10px] font-black uppercase text-gray-500 hover:text-saas-neon transition-colors tracking-widest border border-transparent hover:border-saas-neon/30">Export</button>
            <button className="px-5 py-3 bg-saas-neon text-black rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-saas-neon/20 hover:scale-105 active:scale-95 transition-all tracking-widest">Details</button>
          </div>
        </div>

        <div className="h-[400px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chart_data}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B2FF4D" stopOpacity={1} />
                  <stop offset="100%" stopColor="#B2FF4D" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800/40" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'currentColor', fontSize: 10, fontWeight: 900}} 
                dy={20}
                className="text-gray-400 uppercase tracking-[0.3em]"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'currentColor', fontSize: 10, fontWeight: 900}} 
                tickFormatter={(value) => `$${value}`} 
                dx={-10}
                className="text-gray-400"
              />
              <Tooltip 
                cursor={{fill: 'currentColor', opacity: 0.05}}
                contentStyle={{ 
                  backgroundColor: 'var(--color-saas-surface)', 
                  border: '1px solid var(--color-saas-surfacehover)', 
                  borderRadius: '32px',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                  padding: '24px'
                }}
                itemStyle={{ color: '#B2FF4D', fontWeight: 900, textTransform: 'uppercase', fontSize: '14px', letterSpacing: '0.05em' }}
                labelStyle={{ color: '#8A8A8E', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.2em', marginBottom: '12px' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#barGradient)" 
                radius={[16, 16, 6, 6]} 
                barSize={64}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saas-neon/5 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-saas-neon/10 transition-colors duration-1000 pointer-events-none"></div>
      </div>
    </div>
  );
}