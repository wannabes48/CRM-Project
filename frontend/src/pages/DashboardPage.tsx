import React, { useState, useEffect } from 'react';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const profitData = [
  { name: 'Mon', profit: 12400 }, { name: 'Tue', profit: 18000 }, { name: 'Wed', profit: 15000 },
  { name: 'Thu', profit: 27800 }, { name: 'Fri', profit: 18900 }, { name: 'Sat', profit: 23900 }, { name: 'Sun', profit: 34900 },
];

export default function DashboardPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({
    kpis: { net_revenue: 0, arr: 0, new_orders: 0 },
    sales_overview: [], customers: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('dashboard/');
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-saas-bg">
        <Loader2 className="animate-spin text-saas-neon" size={40} />
      </div>
    );
  }

  if (!user) {
    // Note: use `replace` so they can't hit the back button to return to the dashboard
    return <Navigate to="/login" replace />; 
  }

  const { kpis, sales_overview, customers } = dashboardData;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Net revenue" value={`$${kpis.net_revenue.toLocaleString()}`} trend="+8.4%" isPositive={true} />
        <KpiCard title="ARR" value={`$${kpis.arr.toLocaleString()}`} trend="+12.2%" isPositive={true} />
        <div className="bg-saas-surface rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Quarterly revenue goal</p>
           <p className="text-3xl font-black text-gray-900 dark:text-white">71%</p>
           <div className="w-full bg-saas-bg dark:bg-gray-800 rounded-full h-2 mt-4 p-0.5">
             <div className="bg-saas-neon h-full rounded-full shadow-[0_0_10px_rgba(178,255,77,0.4)]" style={{ width: '71%' }}></div>
           </div>
        </div>
        <KpiCard title="Won Deals" value={kpis.new_orders.toString()} trend="+3" isPositive={true} />
      </div>

      {/* Middle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Recharts Donut Chart */}
        <div className="col-span-1 bg-saas-surface rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-[360px] ring-1 ring-black/5 dark:ring-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">Sales Overview</h3>
            <div className="p-1.5 hover:bg-saas-bg dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-gray-400">
              <MoreHorizontal size={16} />
            </div>
          </div>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sales_overview} innerRadius={70} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                  {sales_overview.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#151516' : '#FFF', 
                    border: '1px solid #B2FF4D', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: '800'
                  }} 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[-10px]">
              <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{sales_overview.length}</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stages</span>
            </div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-4 text-[11px] font-bold">
            {sales_overview.map((item: any) => (
              <div key={item.name} className="flex justify-between items-center group">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.1)]" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-500 dark:text-gray-400 truncate w-20 uppercase tracking-tight group-hover:text-saas-neon transition-colors cursor-default">{item.name}</span>
                </div>
                <span className="text-gray-900 dark:text-white">${(item.value).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recharts Area Chart */}
        <div className="col-span-2 bg-saas-surface rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-[360px] flex flex-col ring-1 ring-black/5 dark:ring-white/5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total Profit</h3>
              <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">$136,755.77</p>
            </div>
            <div className="p-1.5 hover:bg-saas-bg dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-gray-400">
              <MoreHorizontal size={16} />
            </div>
          </div>
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B2FF4D" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#B2FF4D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke={theme === 'dark' ? '#2A2A2D' : '#F3F4F6'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8A8A8E', fontWeight: 800 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8A8A8E', fontWeight: 800 }} tickFormatter={(val) => `$${val / 1000}k`} dx={-5} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#151516' : '#FFF', 
                    border: '1px solid #B2FF4D', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: '800'
                  }} 
                  itemStyle={{ color: '#B2FF4D' }} 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Profit']} 
                />
                <Area type="monotone" dataKey="profit" stroke="#B2FF4D" strokeWidth={4} fillOpacity={1} fill="url(#colorProfit)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        <div className="col-span-2 bg-saas-surface rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto ring-1 ring-black/5 dark:ring-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">Customer list (Top 5)</h3>
            <div className="p-1.5 hover:bg-saas-bg dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-gray-400">
              <MoreHorizontal size={16} />
            </div>
          </div>
          <div className="text-sm min-w-[500px]">
             <div className="flex text-gray-400 dark:text-gray-500 mb-6 pb-2 border-b border-gray-50 dark:border-gray-800 uppercase tracking-[0.2em] text-[10px] font-black">
               <div className="w-1/2">Name</div>
               <div className="w-1/4">Won Deals</div>
               <div className="w-1/4 text-right">Total Deal Value</div>
             </div>
             {customers.map((customer: any) => (
               <div key={customer.id} className="flex items-center py-4 hover:bg-saas-bg dark:hover:bg-gray-800/50 rounded-2xl transition-all px-4 -mx-4 group">
                 <div className="w-1/2 flex items-center gap-4 pr-4">
                   <div className={`w-10 h-10 rounded-xl ${customer.color} shrink-0 shadow-sm ring-1 ring-black/5 group-hover:scale-110 transition-transform`}></div>
                   <div className="truncate">
                     <p className="font-black text-gray-900 dark:text-white truncate tracking-tight">{customer.name}</p>
                     <p className="text-xs text-gray-500 font-medium truncate">{customer.email}</p>
                   </div>
                 </div>
                 <div className="w-1/4 font-black text-gray-600 dark:text-gray-400">{customer.deals}</div>
                 <div className="w-1/4 text-right font-black text-saas-neon">${customer.value.toLocaleString()}</div>
               </div>
             ))}
          </div>
        </div>
        
        {/* Premium Plan Card */}
        <div className="col-span-1 bg-gradient-to-br from-gray-900 via-gray-900 to-[#102A16] dark:from-saas-surface dark:via-saas-surface dark:to-[#064E3B]/20 rounded-3xl p-8 border border-saas-neon/30 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-saas-neon opacity-10 blur-[80px] rounded-full group-hover:opacity-20 transition-opacity pointer-events-none"></div>
          <div className="relative z-10">
            <span className="bg-saas-neon/20 text-saas-neon text-[10px] font-black px-4 py-2 rounded-full inline-flex items-center gap-2 uppercase tracking-widest border border-saas-neon/30">
              <span className="w-1.5 h-1.5 rounded-full bg-saas-neon animate-pulse"></span>
              Premium Plan
            </span>
            <div className="mt-8 flex items-end gap-2">
              <span className="text-6xl font-black text-white tracking-tighter">$30</span>
              <span className="text-xs text-gray-500 mb-2 font-black uppercase tracking-widest leading-none">/ Month<br/>Per User</span>
            </div>
            <p className="text-sm text-gray-400 mt-6 font-medium leading-relaxed">Unlock advanced analytics, custom workflows, and dedicated support for your entire team.</p>
          </div>
          <button className="relative z-10 w-full bg-saas-neon hover:bg-saas-neonhover text-black font-black py-4.5 rounded-2xl mt-10 shadow-[0_15px_30px_rgba(178,255,77,0.25)] transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, isPositive }: any) {
  return (
    <div className="bg-saas-surface rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm transition-transform hover:-translate-y-1 duration-300 ring-1 ring-black/5 dark:ring-white/5">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold mb-3 text-black dark:text-white truncate">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-green-600 dark:text-saas-neon' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
        <span>{trend} vs last month</span>
      </div>
    </div>
  );
}