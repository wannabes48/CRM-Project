import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Hexagon, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
// import api from '../contexts/AuthContext'; // Uncomment when connecting to backend

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // TODO: Replace with your actual Axios call
      // await api.post('password-reset/', { email });
      await new Promise(res => setTimeout(res, 1500)); 
      
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Floating Back Button */}
      <Link to="/login" className="absolute top-6 left-6 md:top-10 md:left-10 text-gray-500 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors z-50">
        <ArrowLeft size={16} /> Back to Login
      </Link>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saas-neon/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-lg bg-[#151516]/80 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative z-10 p-8 md:p-12">
        
        <Link to="/" className="flex items-center justify-center gap-2 mb-10 hover:opacity-80 transition-opacity w-fit mx-auto">
          <div className="bg-saas-neon text-black p-2 rounded-lg">
            <Hexagon size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Xentrix<span className="text-saas-neon">.CRM</span></span>
        </Link>

        {status === 'success' ? (
          <div className="text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Check your inbox</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              If an account exists for <span className="text-white font-bold">{email}</span>, we have sent a password reset link. Please check your spam folder if you don't see it within 5 minutes.
            </p>
            <Link to="/login" className="text-saas-neon font-bold text-sm hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-black text-white mb-2 text-center">Reset your password</h1>
            <p className="text-gray-400 text-sm mb-8 text-center">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full bg-[#09090B] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-saas-neon transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-white hover:bg-gray-200 text-black font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {status === 'submitting' ? <Loader2 className="animate-spin" size={20} /> : (
                  <>Send Reset Link <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}