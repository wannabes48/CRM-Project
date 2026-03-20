import React, { useState } from 'react';
import { X, Calendar, Clock, AlignLeft, Loader2 } from 'lucide-react';
import api from '../../contexts/AuthContext';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string; // To pre-fill if a user clicks a specific day
}

export default function AddEventModal({ isOpen, onClose, onSuccess, initialDate }: AddEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: initialDate ? `${initialDate}T09:00` : '',
    end_time: initialDate ? `${initialDate}T10:00` : '',
    category: 'Meeting'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('events/', formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-saas-surface w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-black dark:text-white">Schedule Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Event Title</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
              <input required type="text" placeholder="Product Demo with Client" 
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Start Time</label>
              <input required type="datetime-local" value={formData.start_time}
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">End Time</label>
              <input required type="datetime-local" value={formData.end_time}
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-gray-400" size={16} />
              <textarea rows={3} placeholder="Agenda, location, or meeting links..." 
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white resize-none"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-saas-neon text-black font-bold py-3 rounded-xl hover:bg-saas-neonhover transition-all shadow-[0_0_20px_rgba(178,255,77,0.3)] flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}