import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Ticket as TicketIcon, Clock, CheckCircle2, AlertCircle, Filter } from 'lucide-react';
import api from '../contexts/AuthContext';
import TicketDetailModal from '../components/modals/TicketDetailModal';
import NewTicketModal from '../components/modals/NewTicketModal';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'Open' | 'Pending' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  created_at: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTickets = async () => {
    try {
      const response = await api.get('tickets/');
      const actualData = response.data.results ? response.data.results : response.data;
      setTickets(actualData);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-12 h-12 border-4 border-saas-neon border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(178,255,77,0.3)]"></div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Open': return { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: <AlertCircle size={14} strokeWidth={2.5} /> };
      case 'Pending': return { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: <Clock size={14} strokeWidth={2.5} /> };
      case 'Resolved': return { color: 'text-saas-neon bg-saas-neon/10 border-saas-neon/20', icon: <CheckCircle2 size={14} strokeWidth={2.5} /> };
      default: return { color: 'text-gray-500 bg-gray-500/10 border-gray-500/20', icon: <TicketIcon size={14} strokeWidth={2.5} /> };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch(priority) {
      case 'High': return { color: 'text-red-500 bg-red-500/10', label: 'High Priority' };
      case 'Medium': return { color: 'text-yellow-500 bg-yellow-500/10', label: 'Medium Priority' };
      case 'Low': return { color: 'text-gray-400 bg-gray-100 dark:bg-gray-800', label: 'Low Priority' };
      default: return { color: 'text-gray-400 bg-gray-100 dark:bg-gray-800', label: 'Internal' };
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Controls */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-saas-neon rounded-full"></div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Support Center</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-[0.2em] ml-4">Managing {tickets.length} active customer inquiries</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[300px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject or content..." 
              className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 shadow-sm"
            />
          </div>
          <button className="p-4 bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-saas-neon hover:border-saas-neon/30 transition-all shadow-sm active:scale-95">
             <Filter size={20} />
          </button>
          <button 
            onClick={() => setIsNewModalOpen(true)} 
            className="group flex items-center gap-3 bg-saas-neon hover:scale-105 active:scale-95 text-black font-black py-4 px-8 rounded-[1.25rem] transition-all shadow-2xl shadow-saas-neon/20 uppercase text-xs tracking-[0.1em]"
          >
            <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" /> Open Ticket
          </button>
        </div>
      </header>

      {/* Main Ticket List Table */}
      <div className="flex-1 bg-white dark:bg-saas-surface rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col group">
        <div className="overflow-x-auto custom-scrollbar-premium">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-saas-surfacehover/20">
                <th className="p-6 pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Issue Details</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Priority</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Created At</th>
                <th className="p-6 pr-10 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {filteredTickets.map((ticket) => {
                const statusConfig = getStatusConfig(ticket.status);
                const priorityConfig = getPriorityConfig(ticket.priority);
                return (
                  <tr 
                    key={ticket.id} 
                    onClick={() => setSelectedTicket(ticket)} 
                    className="hover:bg-saas-neon/[0.02] dark:hover:bg-saas-surfacehover/30 transition-all cursor-pointer group/row"
                  >
                    <td className="p-6 pl-10 max-w-md">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-2xl ${statusConfig.color} flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform duration-500 shadow-sm`}>
                            <TicketIcon size={20} strokeWidth={2.5} />
                         </div>
                         <div className="min-w-0">
                            <p className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{ticket.subject}</p>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 truncate mt-1 uppercase tracking-widest">{ticket.description}</p>
                         </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusConfig.color} shadow-sm`}>
                        {statusConfig.icon}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-xl inline-flex shadow-sm">
                        <Clock size={12} strokeWidth={2.5} className="text-saas-neon" />
                        {new Date(ticket.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="p-6 pr-10 text-right">
                      <button className="p-3 rounded-xl text-gray-300 hover:text-saas-neon hover:bg-saas-neon/10 transition-all opacity-0 group-hover/row:opacity-100 active:scale-90">
                        <MoreHorizontal size={20} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                     <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] flex items-center justify-center text-gray-300 dark:text-gray-700 mb-6">
                           <TicketIcon size={40} />
                        </div>
                        <p className="text-xs font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em]">No tickets found matching your query</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-gray-50/30 dark:bg-saas-surface/50 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center px-10">
           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Showing {filteredTickets.length} of {tickets.length} tickets</p>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-saas-neon transition-colors shadow-sm">Previous</button>
              <button className="px-4 py-2 bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase text-saas-neon transition-colors shadow-sm">Next</button>
           </div>
        </div>
      </div>

      <TicketDetailModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onUpdate={fetchTickets}
      />

      <NewTicketModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchTickets}
      />
    </div>
  );
}