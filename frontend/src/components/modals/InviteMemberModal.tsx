import React, { useState } from 'react';
import { X, Mail, Shield, Loader2, Send } from 'lucide-react';
import api from '../../contexts/AuthContext';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InviteMemberModal({ isOpen, onClose, onSuccess }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('SALES');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('invitations/', { email, role });
      onSuccess();
      onClose();
      setEmail('');
      setRole('SALES');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.email?.[0] || 'Failed to send invitation.');
    } finally {
      setLoading(false);
    }
  };

  const roleConfigs = [
    { id: 'ADMIN', label: 'Admin', desc: 'Full access to all features and settings.' },
    { id: 'MANAGER', label: 'Manager', desc: 'Can manage team and view all data, but no billing access.' },
    { id: 'SALES', label: 'Sales Rep', desc: 'Can manage their own deals and contacts.' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-black/5">
        <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Invite Member</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-1 uppercase tracking-widest">Deploy access to your workspace</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Professional Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@company.com"
                className="w-full bg-saas-bg dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-saas-neon/50 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Assign Strategic Role</label>
            <div className="grid grid-cols-1 gap-3">
              {roleConfigs.map((config) => (
                <button
                  key={config.id}
                  type="button"
                  onClick={() => setRole(config.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group ${
                    role === config.id
                      ? 'bg-saas-neon/5 border-saas-neon/30 ring-1 ring-saas-neon/20'
                      : 'bg-saas-bg dark:bg-gray-800/20 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    role === config.id ? 'bg-saas-neon text-black' : 'bg-white dark:bg-saas-surface text-gray-400 group-hover:text-gray-600'
                  }`}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-widest ${
                      role === config.id ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                    }`}>{config.label}</h4>
                    <p className="text-[10px] font-medium text-gray-400 mt-1">{config.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[1.5] py-4 px-6 bg-saas-neon hover:bg-saas-neonhover text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-saas-neon/20 disabled:opacity-50 flex items-center justify-center gap-2 group border border-saas-neon/20"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
