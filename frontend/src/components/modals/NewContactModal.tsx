import React, { useState } from 'react';
import { X, User, Mail, Phone, Building, Loader2 } from 'lucide-react';
import api from '../../contexts/AuthContext';

interface NewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewContactModal({ isOpen, onClose, onSuccess }: NewContactModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('contacts/', formData);
      onSuccess(); // Refresh the list
      onClose();   // Close the modal
      setFormData({ first_name: '', last_name: '', email: '', phone: '', company: '' });
    } catch (error) {
      console.error("Failed to create contact:", error);
      alert("Error creating contact. Check if the email is unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-saas-surface w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-black dark:text-white">Add New Contact</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={16} />
                <input 
                  required
                  type="text"
                  placeholder="John"
                  className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Last Name</label>
              <input 
                required
                type="text"
                placeholder="Doe"
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
              <input 
                required
                type="email"
                placeholder="john@example.com"
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="+1 234 567 890"
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Company Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-3 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Acme Corp"
                className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white"
                onChange={(e) => setFormData({...formData, company: e.target.value})}
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
              className="flex-1 bg-saas-neon text-black font-bold py-3 rounded-xl hover:bg-saas-neonhover transition-all shadow-[0_0_20px_rgba(178,255,77,0.3)] disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}