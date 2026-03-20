import React, { useState, useEffect } from 'react';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const profitData = [
  { name: 'Mon', profit: 12400 }, { name: 'Tue', profit: 18000 }, { name: 'Wed', profit: 15000 },
  { name: 'Thu', profit: 27800 }, { name: 'Fri', profit: 18900 }, { name: 'Sat', profit: 23900 }, { name: 'Sun', profit: 34900 },
];

export default function DashboardPage() {
  const { theme } = useTheme();
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
      <div className="flex h-full items-center justify-center">
        <div className="w-12 h-12 border-4 border-saas-neon border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { kpis, sales_overview, customers } = dashboardData;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Net revenue" value={`$${kpis.net_revenue.toLocaleString()}`} trend="+8.4%" isPositive={true} />
        <KpiCard title="ARR" value={`$${kpis.arr.toLocaleString()}`} trend="+12.2%" isPositive={true} />
        <div className="bg-white dark:bg-saas-surface rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Quarterly revenue goal</p>
           <p className="text-2xl font-bold text-black dark:text-white">71%</p>
           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
             <div className="bg-saas-neon h-1.5 rounded-full" style={{ width: '71%' }}></div>
           </div>
        </div>
        <KpiCard title="Won Deals" value={kpis.new_orders.toString()} trend="+3" isPositive={true} />
      </div>

      {/* Middle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Recharts Donut Chart */}
        <div className="col-span-1 bg-white dark:bg-saas-surface rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-black dark:text-white">Sales Overview</h3>
            <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
          </div>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sales_overview} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                  {sales_overview.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1E1E20' : '#FFF', border: 'none', borderRadius: '8px', color: theme === 'dark' ? '#FFF' : '#000' }} formatter={(value: any) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-black dark:text-white">{sales_overview.length}</span>
              <span className="text-xs text-gray-400">Stages Active</span>
            </div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2 text-xs">
            {sales_overview.map((item: any) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-500 dark:text-gray-400 truncate w-16">{item.name}</span>
                </div>
                <span className="font-semibold text-black dark:text-white">${(item.value).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recharts Area Chart */}
        <div className="col-span-2 bg-white dark:bg-saas-surface rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm h-[320px] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Profit</h3>
              <p className="text-2xl font-bold mt-1 text-black dark:text-white">$136,755.77</p>
            </div>
            <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
          </div>
          <div className="flex-1 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B2FF4D" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#B2FF4D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#2A2A2D' : '#e5e7eb'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8A8A8E' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8A8A8E' }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1E1E20' : '#FFF', border: '1px solid #B2FF4D', borderRadius: '8px' }} itemStyle={{ color: '#B2FF4D', fontWeight: 'bold' }} formatter={(value: any) => [`$${value.toLocaleString()}`, 'Profit']} />
                <Area type="monotone" dataKey="profit" stroke="#B2FF4D" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-12">
        <div className="col-span-2 bg-white dark:bg-saas-surface rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-black dark:text-white">Customer list (Top 5)</h3>
            <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
          </div>
          <div className="text-sm min-w-[500px]">
             <div className="flex text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 uppercase tracking-wider text-xs font-bold">
               <div className="w-1/2">Name</div>
               <div className="w-1/4">Won Deals</div>
               <div className="w-1/4 text-right">Total Deal Value</div>
             </div>
             {customers.map((customer: any) => (
               <div key={customer.id} className="flex items-center py-3 hover:bg-gray-50 dark:hover:bg-saas-surfacehover rounded-lg transition-colors px-2 -mx-2">
                 <div className="w-1/2 flex items-center gap-3 pr-4">
                   <div className={`w-8 h-8 rounded-full ${customer.color} shrink-0`}></div>
                   <div className="truncate">
                     <p className="font-medium text-black dark:text-white truncate">{customer.name}</p>
                     <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                   </div>
                 </div>
                 <div className="w-1/4 font-medium text-gray-600 dark:text-gray-300">{customer.deals}</div>
                 <div className="w-1/4 text-right font-medium text-saas-neon">${customer.value.toLocaleString()}</div>
               </div>
             ))}
          </div>
        </div>
        
        {/* Premium Plan Card */}
        <div className="col-span-1 bg-gradient-to-br from-[#102A16] to-saas-surface rounded-2xl p-6 border border-saas-neon/30 flex flex-col justify-between relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-48 h-48 bg-saas-neon opacity-20 blur-[60px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <span className="bg-saas-neon/20 text-saas-neon text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">⚡ Premium Plan</span>
            <div className="mt-6 flex items-end gap-1">
              <span className="text-5xl font-black text-white">$30</span>
              <span className="text-sm text-gray-400 mb-1 font-medium">/ Month<br/>Per User</span>
            </div>
            <p className="text-sm text-gray-300 mt-4 leading-relaxed">Improve your workplace, view and analyze your profits and losses.</p>
          </div>
          <button className="relative z-10 w-full bg-saas-neon text-black font-bold py-3.5 rounded-xl mt-6 shadow-[0_0_20px_rgba(178,255,77,0.4)] hover:bg-[#9EE042] transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, isPositive }: any) {
  return (
    <div className="bg-white dark:bg-saas-surface rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm transition-transform hover:-translate-y-1 duration-300">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold mb-3 text-black dark:text-white truncate">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-green-600 dark:text-saas-neon' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
        <span>{trend} vs last month</span>
      </div>
    </div>
  );
}