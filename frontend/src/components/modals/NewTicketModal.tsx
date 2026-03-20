import React, { useState, useEffect } from 'react';
import { X, Ticket as TicketIcon, AlignLeft, AlertCircle, User, Loader2 } from 'lucide-react';
import api from '../../contexts/AuthContext';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewTicketModal({ isOpen, onClose, onSuccess }: NewTicketModalProps) {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    contact: '' // Links the ticket to a specific customer
  });

  // Fetch contacts for the dropdown when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchContacts = async () => {
        try {
          const res = await api.get('contacts/');
          setContacts(res.data.results ? res.data.results : res.data);
        } catch (err) {
          console.error("Failed to fetch contacts for tickets", err);
        }
      };
      fetchContacts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('tickets/', formData);
      onSuccess(); // Refresh the ticket table
      onClose();   // Close the modal
      setFormData({ subject: '', description: '', priority: 'Medium', status: 'Open', contact: '' });
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-saas-surface w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-black dark:text-white">Create Support Ticket</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Subject</label>
            <div className="relative">
              <TicketIcon className="absolute left-3 top-3 text-gray-400" size={16} />
              <input 
                required 
                type="text" 
                placeholder="Cannot access billing dashboard" 
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white transition-colors"
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Customer</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={16} />
                <select 
                  required 
                  className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white appearance-none cursor-pointer"
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                >
                  <option value="">Select...</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Priority</label>
              <div className="relative">
                <AlertCircle className="absolute left-3 top-3 text-gray-400" size={16} />
                <select 
                  className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white appearance-none cursor-pointer"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-gray-400" size={16} />
              <textarea 
                required
                rows={4} 
                placeholder="Provide details about the issue..." 
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white resize-none transition-colors"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-saas-neon text-black font-bold py-3 rounded-xl hover:bg-[#9EE042] transition-all shadow-[0_0_15px_rgba(178,255,77,0.3)] disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}