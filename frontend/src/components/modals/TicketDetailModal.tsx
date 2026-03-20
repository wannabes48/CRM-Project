import React, { useState, useEffect } from 'react';
import { X, Send, Clock, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import api from '../../contexts/AuthContext';

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any | null;
  onUpdate: () => void; // Triggered when status changes
}

export default function TicketDetailModal({ isOpen, onClose, ticket, onUpdate }: TicketDetailModalProps) {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [status, setStatus] = useState(ticket?.status || 'Open');

  // Fetch notes when the modal opens
  useEffect(() => {
    if (isOpen && ticket) {
      setStatus(ticket.status);
      const fetchNotes = async () => {
        try {
          const res = await api.get(`ticket-notes/?ticket=${ticket.id}`);
          setNotes(res.data.results || res.data);
        } catch (error) {
          console.error("Failed to fetch notes", error);
        }
      };
      fetchNotes();
    }
  }, [isOpen, ticket]);

  if (!isOpen || !ticket) return null;

  // Handle changing the ticket status
  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.patch(`tickets/${ticket.id}/`, { status: newStatus });
      setStatus(newStatus);
      onUpdate(); // Refresh the main table
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Submit a new note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const res = await api.post('ticket-notes/', {
        ticket: ticket.id,
        text: newNote,
        is_internal: isInternal
      });
      setNotes([...notes, res.data]); // Add new note to the chat instantly
      setNewNote('');
    } catch (error) {
      console.error("Failed to add note", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-saas-surface w-full max-w-2xl h-[80vh] flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        
        {/* Header: Ticket Info & Status Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-100 dark:border-gray-800 gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-black text-black dark:text-white">{ticket.subject}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ticket.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-400'}`}>
                {ticket.priority} Priority
              </span>
            </div>
            <p className="text-sm text-gray-500">{ticket.description}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={status} 
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-lg py-2 px-3 text-sm font-bold outline-none text-black dark:text-white appearance-none cursor-pointer"
            >
              <option value="Open">🔴 Open</option>
              <option value="Pending">🟡 Pending</option>
              <option value="Resolved">🟢 Resolved</option>
            </select>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-black dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat / Notes Area */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-[#151516] space-y-4">
          {notes.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">No notes yet. Start the conversation.</div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className={`flex flex-col ${note.is_internal ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline gap-2 mb-1 px-1">
                  <span className="text-xs font-bold text-gray-500">{note.author_name}</span>
                  <span className="text-[10px] text-gray-400">{new Date(note.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                  note.is_internal 
                    ? 'bg-[#2A2A2D] text-white rounded-tr-sm border border-gray-700' 
                    : 'bg-white dark:bg-saas-surface border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-tl-sm shadow-sm'
                }`}>
                  {note.is_internal && <ShieldAlert size={12} className="inline mr-2 text-yellow-500 opacity-70" />}
                  {note.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Note Input Form */}
        <form onSubmit={handleAddNote} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-saas-surface shrink-0">
          <div className="flex gap-3 mb-3 px-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 cursor-pointer">
              <input type="radio" checked={isInternal} onChange={() => setIsInternal(true)} className="accent-yellow-500" />
              🔒 Internal Note (Hidden from Customer)
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 cursor-pointer">
              <input type="radio" checked={!isInternal} onChange={() => setIsInternal(false)} className="accent-saas-neon" />
              ✉️ Public Reply
            </label>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={isInternal ? "Type an internal note..." : "Type a reply to the customer..."} 
              className={`flex-1 bg-gray-50 dark:bg-saas-bg border rounded-xl py-3 px-4 text-sm outline-none text-black dark:text-white transition-colors ${isInternal ? 'border-yellow-500/30 focus:border-yellow-500' : 'border-gray-200 dark:border-gray-800 focus:border-saas-neon'}`}
            />
            <button type="submit" disabled={!newNote.trim()} className={`p-3 rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-50 text-black ${isInternal ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-saas-neon hover:bg-saas-neonhover shadow-[0_0_15px_rgba(178,255,77,0.3)]'}`}>
              <Send size={18} />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}