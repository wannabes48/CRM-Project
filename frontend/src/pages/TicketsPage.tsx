import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Ticket as TicketIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../contexts/AuthContext';

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

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('tickets/');
        const actualData = response.data.results ? response.data.results : response.data;
        
        console.log("Fetched Data:", actualData);
        setTickets(actualData);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-saas-neon border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Helper functions for status and priority badges
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Open': return { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: <AlertCircle size={14} /> };
      case 'Pending': return { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: <Clock size={14} /> };
      case 'Resolved': return { color: 'text-saas-neon bg-saas-neon/10 border-saas-neon/20', icon: <CheckCircle2 size={14} /> };
      default: return { color: 'text-gray-500 bg-gray-500/10 border-gray-500/20', icon: <TicketIcon size={14} /> };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      {/* Header & Controls */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Support Tickets</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and resolve your {tickets.length} customer inquiries.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              className="w-full bg-white dark:bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-saas-neon hover:bg-[#9EE042] text-black font-bold py-2 px-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(178,255,77,0.3)] shrink-0">
            <Plus size={18} strokeWidth={3} /> New Ticket
          </button>
        </div>
      </header>

      {/* Main Ticket List */}
      <div className="flex-1 bg-white dark:bg-saas-surface rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-saas-surfacehover/50 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="p-4 pl-6 font-bold">Ticket Details</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Priority</th>
                <th className="p-4 font-bold">Created</th>
                <th className="p-4 pr-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {tickets.map((ticket) => {
                const statusConfig = getStatusConfig(ticket.status);
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-saas-surfacehover/50 transition-colors group">
                    <td className="p-4 pl-6 max-w-md">
                      <p className="font-bold text-black dark:text-white truncate">{ticket.subject}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{ticket.description}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                        {statusConfig.icon}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-bold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="p-2 rounded-lg text-gray-400 hover:text-saas-neon hover:bg-saas-neon/10 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No support tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}