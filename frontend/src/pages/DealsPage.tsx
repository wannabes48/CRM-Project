import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, DollarSign, Calendar } from 'lucide-react';
import api from '../contexts/AuthContext';

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await api.get('deals/');
        const actualData = response.data.results ? response.data.results : response.data;

        console.log("Fetched Data:", actualData);

        setDeals(actualData);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="w-10 h-10 border-4 border-saas-neon border-t-transparent rounded-full animate-spin"></div></div>;

  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'Won': return 'text-saas-neon bg-saas-neon/10 border-saas-neon/20';
      case 'Lost': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Proposal': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">All Deals</h1>
          <p className="text-gray-500 text-sm mt-1">Review your {deals.length} active and closed deals.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input type="text" placeholder="Search deals..." className="w-full bg-white dark:bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white" />
          </div>
          <button className="flex items-center gap-2 bg-saas-neon hover:bg-[#9EE042] text-black font-bold py-2 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(178,255,77,0.3)]">
            <Plus size={18} strokeWidth={3} /> New Deal
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white dark:bg-saas-surface rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-saas-surfacehover/50 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="p-4 pl-6 font-bold">Deal Name</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Stage</th>
                <th className="p-4 pr-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-saas-surfacehover/50 transition-colors group">
                  <td className="p-4 pl-6 font-bold text-black dark:text-white">{deal.title}</td>
                  <td className="p-4 text-sm text-gray-500">{deal.contact_name}</td>
                  <td className="p-4 font-medium text-black dark:text-white">
                    <div className="flex items-center gap-1"><DollarSign size={14} className="text-gray-400"/> {parseFloat(deal.amount).toLocaleString()}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getStageColor(deal.stage)}`}>{deal.stage}</span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-2 rounded-lg text-gray-400 hover:text-saas-neon hover:bg-saas-neon/10 transition-colors opacity-0 group-hover:opacity-100"><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}