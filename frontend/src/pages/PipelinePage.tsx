import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Calendar } from 'lucide-react';
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

const STAGES: { name: Stage; color: string }[] = [
  { name: 'Lead', color: 'border-gray-400' },
  { name: 'Qualified', color: 'border-blue-500' },
  { name: 'Proposal', color: 'border-yellow-500' },
  { name: 'Won', color: 'border-saas-neon' },
  { name: 'Lost', color: 'border-red-500' },
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
        setDeals(response.data);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
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
      // Optional: Revert the UI if the API call fails
    }
    
    setDraggedDealId(null);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-saas-neon border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Sales Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">Drag and drop deals to update their stages in the database.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-saas-neon hover:bg-[#9EE042] text-black font-bold py-2 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(178,255,77,0.3)]">
          <Plus size={18} strokeWidth={3} /> New Deal
        </button>
      </header>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {STAGES.map((stage) => {
            const columnDeals = deals.filter(d => d.stage === stage.name);
            const columnTotal = columnDeals.reduce((sum, deal) => sum + parseFloat(deal.amount), 0);

            return (
              <div 
                key={stage.name}
                className="w-80 flex flex-col bg-gray-100/50 dark:bg-[#1A1A1C] rounded-2xl border border-gray-200 dark:border-gray-800/50"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.name)}
              >
                <div className={`p-4 border-t-4 rounded-t-2xl ${stage.color} flex justify-between items-center bg-white dark:bg-saas-surface border-b border-gray-200 dark:border-gray-800`}>
                  <div>
                    <h3 className="font-bold text-black dark:text-white">{stage.name}</h3>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5">${columnTotal.toLocaleString()}</p>
                  </div>
                  <span className="bg-gray-100 dark:bg-saas-bg text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">
                    {columnDeals.length}
                  </span>
                </div>

                <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                  {columnDeals.map(deal => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className={`group bg-white dark:bg-saas-surface p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-saas-neon/50 cursor-grab active:cursor-grabbing transition-all ${draggedDealId === deal.id ? 'opacity-50 scale-95' : 'opacity-100'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-gray-100 dark:bg-saas-bg text-xs font-bold px-2 py-1 rounded text-gray-500 dark:text-gray-400">
                          {deal.probability}% Prob.
                        </span>
                        <MoreHorizontal size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer" />
                      </div>
                      
                      <h4 className="font-bold text-black dark:text-white mb-1 leading-tight">{deal.title}</h4>
                      <p className="text-sm font-medium text-saas-neon mb-4">${parseFloat(deal.amount).toLocaleString()}</p>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-600 shrink-0 flex items-center justify-center text-[10px] text-white font-bold">
                            {deal.contact_name.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-gray-500 truncate w-24">{deal.contact_name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={12} />
                          {new Date(deal.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {columnDeals.length === 0 && (
                    <div className="h-full min-h-[100px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center text-sm font-medium text-gray-400">
                      Drop deals here
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