import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Calendar, Target, TrendingUp, CheckCircle, AlertCircle, Briefcase } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../contexts/AuthContext';
import NewDealModal from '../components/modals/NewDealModal';

type Stage = 'Lead' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

interface Deal {
  id: string;
  title: string;
  contact_name: string;
  amount: string; // Django decimals come through as strings
  stage: Stage;
  probability: number;
  created_at: string;
}

const STAGES: { name: Stage; color: string; icon: React.ReactNode; bg: string }[] = [
  { name: 'Lead', color: 'text-gray-400', icon: <Target size={16} />, bg: 'bg-gray-500/10' },
  { name: 'Qualified', color: 'text-blue-500', icon: <TrendingUp size={16} />, bg: 'bg-blue-500/10' },
  { name: 'Proposal', color: 'text-yellow-500', icon: <Briefcase size={16} />, bg: 'bg-yellow-500/10' },
  { name: 'Won', color: 'text-saas-neon', icon: <CheckCircle size={16} />, bg: 'bg-saas-neon/10' },
  { name: 'Lost', color: 'text-red-500', icon: <AlertCircle size={16} />, bg: 'bg-red-500/10' },
];

export default function PipelinePage() {
  const { theme } = useTheme();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  // Fetch Deals from Django
  const fetchDeals = async () => {
    try {
      const response = await api.get('deals/');
      const actualData = response.data.results ? response.data.results : response.data;
      setDeals(actualData);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedDealId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id); 
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStage: Stage) => {
    e.preventDefault();
    if (!draggedDealId) return;

    // 1. Optimistically update the UI instantly
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === draggedDealId ? { ...deal, stage: targetStage } : deal
      )
    );
    
    // 2. Send the update to Django in the background
    try {
      await api.patch(`deals/${draggedDealId}/`, { stage: targetStage });
    } catch (error) {
      console.error("Failed to update deal stage:", error);
    }
    
    setDraggedDealId(null);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-12 h-12 border-4 border-saas-neon border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(178,255,77,0.3)]"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-saas-neon rounded-full"></div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Sales Pipeline</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-[0.2em] ml-4">Drag and drop deals to manage your flow</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="group flex items-center gap-3 bg-saas-neon hover:scale-105 active:scale-95 text-black font-black py-4 px-8 rounded-[1.25rem] transition-all shadow-2xl shadow-saas-neon/20 uppercase text-xs tracking-[0.1em]"
        >
          <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" /> New Opportunity
        </button>
      </header>

      <div className="flex-1 overflow-x-auto pb-6 custom-scrollbar-premium">
        <div className="flex gap-8 h-full min-w-max px-2">
          {STAGES.map((stage) => {
            const columnDeals = deals.filter(d => d.stage === stage.name);
            const columnTotal = columnDeals.reduce((sum, deal) => sum + parseFloat(deal.amount), 0);

            return (
              <div 
                key={stage.name}
                className="w-80 flex flex-col bg-gray-50/50 dark:bg-saas-surface/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800/40 p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.name)}
              >
                <div className="mb-6 px-4 pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 ${stage.bg} ${stage.color} rounded-xl`}>
                        {stage.icon}
                      </div>
                      <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-tight">{stage.name}</h3>
                    </div>
                    <span className="bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                      {columnDeals.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">${columnTotal.toLocaleString()}</p>
                     <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800/50"></div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-4 px-1">
                  {columnDeals.map(deal => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className={`group bg-white dark:bg-saas-surface p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-saas-neon/5 hover:border-saas-neon/30 cursor-grab active:cursor-grabbing transition-all duration-300 ${draggedDealId === deal.id ? 'opacity-40 scale-95 ring-2 ring-saas-neon ring-offset-4 dark:ring-offset-saas-bg' : 'opacity-100'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-saas-neon bg-saas-neon/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                          <div className="w-1 h-1 rounded-full bg-saas-neon animate-pulse"></div>
                          {deal.probability}% Prob.
                        </div>
                        <button className="p-2 rounded-xl text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                      
                      <h4 className="font-black text-gray-900 dark:text-white mb-2 leading-tight uppercase text-xs tracking-tight">{deal.title}</h4>
                      <p className="text-xl font-black text-saas-neon mb-6 tracking-tighter">${parseFloat(deal.amount).toLocaleString()}</p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-800/50">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0 flex items-center justify-center text-[10px] text-gray-600 dark:text-white font-black uppercase group-hover:bg-saas-neon group-hover:text-black transition-colors duration-500">
                            {deal.contact_name.charAt(0)}
                          </div>
                          <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest truncate w-24">{deal.contact_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          <Calendar size={12} strokeWidth={2.5} />
                          {new Date(deal.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {columnDeals.length === 0 && (
                    <div className="h-40 border-2 border-dashed border-gray-200 dark:border-gray-800/50 rounded-[2rem] flex flex-col items-center justify-center text-center p-6 transition-colors group-hover:border-saas-neon/20">
                      <Plus size={24} className="text-gray-300 dark:text-gray-700 mb-2" />
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">Drop deals here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <NewDealModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchDeals} 
      />
    </div>
  );
}