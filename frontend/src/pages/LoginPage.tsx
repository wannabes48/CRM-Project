import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, Users, Briefcase, ArrowRight, ArrowLeft, Loader2, Hexagon, Globe } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(identifier, password);
      // Brief delay for visual feedback of success
      await new Promise(res => setTimeout(res, 800));
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Invalid credentials. Please try again.');
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
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-saas-neon/5 dark:bg-saas-neon/10 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[10s]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[8s]" />
      
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white/40 dark:bg-saas-surface/40 backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Side: Login Form */}
        <div className="flex-[1.2] p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-12">
            <div className="bg-saas-neon text-black p-3 rounded-2xl w-fit shadow-xl shadow-saas-neon/30 mb-8 hover:rotate-12 transition-transform duration-500">
              <Hexagon size={32} fill="currentColor" strokeWidth={0} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none mb-4">
              Welcome<br/><span className="text-saas-neon">Back.</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
              Access your workspace and insights
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2 duration-300">
                <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                   <Lock size={12} strokeWidth={3} />
                </div>
                {error}
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">
                Identity Credentials
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[1.25rem] py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 shadow-sm"
                  placeholder="Username or active email"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                  Security Key
                </label>
                <Link to="/forgot-password" className="text-[10px] font-black text-gray-400 hover:text-saas-neon uppercase tracking-widest transition-colors">
                  Recovery?
                </Link>
              </div> 
              <div className="relative"> 
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saas-neon transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[1.25rem] py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 shadow-sm"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-saas-neon hover:scale-[1.02] active:scale-95 text-black font-black py-5 rounded-[1.25rem] transition-all shadow-2xl shadow-saas-neon/20 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" size={20} strokeWidth={3} /> : (
                  <>Authorize Access <ArrowRight size={18} strokeWidth={3} /></>
                )}
            </button>
          </form>

          <p className="mt-12 text-sm font-bold text-gray-500 flex items-center gap-2">
            No secure portal access?{' '}
            <Link to="/register" className="text-gray-900 dark:text-white hover:text-saas-neon underline underline-offset-8 decoration-gray-200 dark:decoration-gray-800 hover:decoration-saas-neon transition-all">
              Register now
            </Link>
          </p>
        </div>

        {/* Right Side: Showcase */}
        <div className="hidden lg:flex flex-1 bg-gray-50/50 dark:bg-saas-bg/50 p-16 border-l border-gray-100 dark:border-gray-800 flex-col justify-center relative group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-1.5 h-6 bg-saas-neon rounded-full"></div>
               <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Unified RBAC.</h2>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest max-w-xs leading-relaxed">
              Enterprise-grade security with granular access control for every department.
            </p>
          </div>

          <div className="mt-12 space-y-6 relative z-10">
            {[
              { role: 'Admin', desc: 'Full workspace orchestration & billing.', icon: <Shield size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { role: 'Manager', desc: 'Departmental reports & team pipelines.', icon: <Users size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { role: 'Sales Rep', desc: 'Dedicated focus on personal portfolio.', icon: <Briefcase size={20} />, color: 'text-saas-neon', bg: 'bg-saas-neon/10' },
            ].map((demo, idx) => (
              <div 
                key={idx}
                className="p-6 bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[2rem] flex items-center gap-5 shadow-sm group/card hover:shadow-2xl hover:shadow-saas-neon/5 hover:border-saas-neon/30 transition-all duration-500"
              >
                <div className={`${demo.bg} ${demo.color} p-4 rounded-2xl group-hover/card:scale-110 transition-transform duration-300`}>
                  {demo.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{demo.role}</h3>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight mt-1">{demo.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] relative z-10">
             <Globe size={14} />
             Global Edge Security Active
          </div>

          {/* Decorative background element for right side */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-saas-neon/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-saas-neon/10 transition-colors duration-1000" />
        </div>
      </div>
    </div>
  );
}
