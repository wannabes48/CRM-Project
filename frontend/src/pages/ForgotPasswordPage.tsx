import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Hexagon, ArrowRight, Loader2, CheckCircle2, Lock } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise(res => setTimeout(res, 1500)); 
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-saas-bg flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-700">
      
      {/* Floating Back Button */}
      <Link to="/login" className="absolute top-8 left-8 md:top-12 md:left-12 text-gray-400 hover:text-saas-neon flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all z-50 group">
        <div className="p-2 rounded-xl bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 group-hover:border-saas-neon/30 group-hover:scale-110 transition-all shadow-sm">
           <ArrowLeft size={14} strokeWidth={3} />
        </div>
        Back to Login
      </Link>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-saas-neon/5 dark:bg-saas-neon/10 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[10s]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[8s]" />

      {/* Main Card */}
      <div className="w-full max-w-lg bg-white/40 dark:bg-saas-surface/40 backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden relative z-10 p-10 md:p-16 animate-in fade-in zoom-in-95 duration-700">
        
        <Link to="/" className="flex items-center justify-center gap-3 mb-10 group w-fit mx-auto transition-transform hover:scale-105">
          <div className="bg-saas-neon text-black p-3 rounded-2xl shadow-xl shadow-saas-neon/30 group-hover:rotate-12 transition-transform duration-500">
            <Hexagon size={28} fill="currentColor" strokeWidth={0} />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
            Xentrix<span className="text-saas-neon">.CRM</span>
          </span>
        </Link>

        {status === 'success' ? (
          <div className="text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-saas-neon/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-saas-neon/30 shadow-2xl shadow-saas-neon/10">
              <CheckCircle2 size={32} className="text-saas-neon" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">Check your inbox</h2>
            <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] leading-loose mb-10">
              If an account exists for <span className="text-saas-neon">{email}</span>, we have sent a dynamic reset link.
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 text-gray-900 dark:text-white hover:text-saas-neon font-black text-[10px] uppercase tracking-widest transition-colors">
              <ArrowLeft size={14} strokeWidth={3} /> Return to Portal
            </Link>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 text-center uppercase tracking-tighter">Reset Security Key</h1>
            <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 text-center">
              Deploy a recovery link to your registered email
            </p>

            {status === 'error' && (
              <div className="mb-8 p-5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                   <Lock size={12} strokeWidth={3} />
                </div>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Professional Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[1.25rem] py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 shadow-sm"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-saas-neon hover:scale-[1.02] active:scale-95 text-black font-black py-5 rounded-[1.25rem] transition-all shadow-2xl shadow-saas-neon/20 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
              >
                {status === 'submitting' ? <Loader2 className="animate-spin" size={20} strokeWidth={3} /> : (
                  <>Send Recovery Link <ArrowRight size={18} strokeWidth={3} /></>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}