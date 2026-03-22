import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building, User, ArrowRight, Loader2, Hexagon, Zap, BarChart3, ShieldCheck, CheckCircle2, ArrowLeft, Star } from 'lucide-react';
import api, { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const { register, login } = useAuth();
  const [tenantName, setTenantName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      setStatus('error');
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setLoading(true);
    
    try {
      await register({ 
        tenantName: tenantName, 
        username: email.split('@')[0],
        first_name: firstName,
        last_name: lastName, 
        email: email, 
        password: password 
      });

      await login(email, password);
      setStatus('success');

      // Short delay before creating checkout session
      await new Promise(res => setTimeout(res, 1000));
      const res = await api.post('/api/create-checkout-session');

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("Could not connect to payment gateway.");
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || 'Registration failed.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-saas-bg flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-700">
      <Link to="/" className="absolute top-8 left-8 md:top-12 md:left-12 text-gray-400 hover:text-saas-neon flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all z-50 group">
        <div className="p-2 rounded-xl bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 group-hover:border-saas-neon/30 group-hover:scale-110 transition-all shadow-sm">
           <ArrowLeft size={14} strokeWidth={3} />
        </div>
        Back to Home
      </Link>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-saas-neon/5 dark:bg-saas-neon/10 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[12s]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[9s]" />
      
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white/40 dark:bg-saas-surface/40 backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Side: Registration Form */}
        <div className="flex-[1.2] p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <Link to="/" className="flex items-center gap-3 mb-8 group w-fit">
              <div className="bg-saas-neon text-black p-3 rounded-2xl shadow-xl shadow-saas-neon/30 group-hover:rotate-12 transition-transform duration-500">
                <Hexagon size={28} fill="currentColor" strokeWidth={0} />
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                Xentrix<span className="text-saas-neon">.CRM</span>
              </span>
            </Link>

            {status === 'success' ? (
              <div className="text-center py-12 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-saas-neon/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-saas-neon/30 shadow-2xl shadow-saas-neon/10">
                  <CheckCircle2 size={48} className="text-saas-neon" strokeWidth={2.5} />
                </div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">Workspace Ready!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest leading-loose">
                  Welcome onboard, {firstName}.<br/>Setting up your cloud environment...
                </p>
                <div className="flex items-center justify-center gap-3 mt-10">
                   <div className="w-2 h-2 rounded-full bg-saas-neon animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-2 h-2 rounded-full bg-saas-neon animate-bounce" style={{ animationDelay: '200ms' }}></div>
                   <div className="w-2 h-2 rounded-full bg-saas-neon animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
                <p className="text-saas-neon font-black text-[10px] uppercase tracking-[0.3em] mt-6">
                  Redirecting to secure gateway
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter leading-tight">Initialize<br/>Workspace.</h1>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">Deploy your enterprise tenant in seconds</p>

                {status === 'error' && (
                  <div className="mb-8 p-5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                    <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                       <Lock size={12} strokeWidth={3} />
                    </div>
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
                  <div className="group space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Company Identity</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={tenantName}
                        onChange={(e) => setTenantName(e.target.value)}
                        placeholder="Global Enterprises Ltd"
                        required
                        className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[1.25rem] py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">First Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
                        <input 
                          type="text" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Jane"
                          required
                          className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[1.25rem] py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
                        <input 
                          type="text" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          required
                          className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[1.25rem] py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="group space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Professional Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@enterprise.com"
                        required
                        className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[1.25rem] py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Secure Key</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[1.25rem] py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="group space-y-2">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Confirm Key</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
                        <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[1.25rem] py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-saas-neon hover:scale-[1.02] active:scale-95 text-black font-black py-5 rounded-[1.25rem] transition-all shadow-2xl shadow-saas-neon/20 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} strokeWidth={3} /> : (
                      <>Deploy Workspace <ArrowRight size={18} strokeWidth={3} /></>
                    )}
                  </button>
                </form>

                <p className="mt-10 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Already part of a team?{' '}
                  <Link to="/login" className="text-gray-900 dark:text-white underline underline-offset-4 decoration-gray-200 dark:decoration-gray-800 hover:text-saas-neon hover:decoration-saas-neon transition-all">
                    Sign in here
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Showcase */}
        <div className="hidden lg:flex flex-1 bg-gray-50/50 dark:bg-saas-bg/50 p-16 border-l border-gray-100 dark:border-gray-800 flex-col justify-center relative group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-saas-neon rounded-full"></div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Scale Faster.</h2>
            </div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest max-w-xs leading-relaxed">
              Experience the next generation of customer relationship management.
            </p>
          </div>

          <div className="mt-12 space-y-6 relative z-10">
            {[
              { title: 'AI Insights', desc: 'Predictive analytics for your growth.', icon: <BarChart3 size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { title: 'Automation', desc: 'Zero manual entry. Pure efficiency.', icon: <Zap size={20} />, color: 'text-saas-neon', bg: 'bg-saas-neon/10' },
              { title: 'Bank Grade', desc: 'Enterprise encryption for every byte.', icon: <ShieldCheck size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[2rem] flex items-center gap-5 shadow-sm group/card hover:shadow-2xl hover:shadow-saas-neon/5 hover:border-saas-neon/30 transition-all duration-500"
              >
                <div className={`${feature.bg} ${feature.color} p-4 rounded-2xl group-hover/card:scale-110 transition-transform duration-300 shadow-sm`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">{feature.title}</h3>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight mt-2">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex items-center gap-3">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-saas-bg bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <div className="flex flex-col">
                <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(i => <Star key={i} size={8} className="fill-saas-neon text-saas-neon" />)}
                </div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Join 5,000+ teams worldwide</p>
             </div>
          </div>

          {/* Decorative background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-saas-neon/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-saas-neon/10 transition-colors duration-1000" />
        </div>
      </div>
    </div>
  );
}