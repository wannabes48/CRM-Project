import React, { useState, useEffect } from 'react';
import { X, Briefcase, DollarSign, Target, User, Loader2 } from 'lucide-react';
import api from '../../contexts/AuthContext';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewDealModal({ isOpen, onClose, onSuccess }: NewDealModalProps) {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    stage: 'Lead',
    probability: 10,
    contact: '' // This will hold the Contact ID
  });

  // Fetch contacts for the selection dropdown
  useEffect(() => {
    if (isOpen) {
      const fetchContacts = async () => {
        try {
          const res = await api.get('contacts/');
          setContacts(res.data.results || res.data);
        } catch (err) {
          console.error("Failed to fetch contacts for deal", err);
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
      await api.post('deals/', formData);
      onSuccess();
      onClose();
      setFormData({ title: '', amount: '', stage: 'Lead', probability: 10, contact: '' });
    } catch (error) {
      console.error("Failed to create deal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-saas-surface w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-black dark:text-white">Create New Deal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Deal Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-gray-400" size={16} />
              <input required type="text" placeholder="Cloud Infrastructure Expansion" 
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Amount ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-gray-400" size={16} />
                <input required type="number" placeholder="5000" 
                  className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Probability (%)</label>
              <div className="relative">
                <Target className="absolute left-3 top-3 text-gray-400" size={16} />
                <input type="number" min="0" max="100" placeholder="20" 
                  className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                  onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Assigned Contact</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={16} />
              <select required 
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white appearance-none"
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
              >
                <option value="">Select a contact...</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.company})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-saas-neon text-black font-bold py-3 rounded-xl hover:bg-saas-neonhover transition-all shadow-[0_0_20px_rgba(178,255,77,0.3)] flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}