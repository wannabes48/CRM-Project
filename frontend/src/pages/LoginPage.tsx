import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, Users, Briefcase, ArrowRight, Loader2, Hexagon } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
      await new Promise(res => setTimeout(res, 1000));

      console.log(`Logging in as ${username}`);
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saas-neon/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-[#151516]/80 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative z-10">
        {/* Left Side: Login Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="bg-saas-neon text-black p-2 rounded-lg w-fit">
            <Hexagon size={24} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">SaaS CRM.</h1>
          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-10 text-sm uppercase tracking-wide font-semibold">
            Sign in to your workspace
          </p>
          <p className="text-gray-400 text-sm mb-8">Enter your credentials to access your workspace.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 border-2 border-red-500 bg-red-50 text-red-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-saas-surface text-black dark:text-white p-3 text-sm font-semibold focus:outline-none focus:border-saas-neon placeholder:text-gray-400 transition-colors"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-bold text-white underline hover:no-underline">
              Forgot Password?
            </Link>
            </div> 
            
            <div className="relative"> 
              <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-saas-surface text-black dark:text-white p-3 text-sm font-semibold focus:outline-none focus:border-saas-neon placeholder:text-gray-400 transition-colors"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-saas-neon hover:bg-[#9EE042] text-black font-black py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(178,255,77,0.2)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>Sign In <ArrowRight size={18} /></>
              )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-white underline hover:no-underline">
            Create one
          </Link>
        </p>
        </div>
        {/* Right Side: Quick Test / RBAC Showcase */}
        <div className="flex-1 bg-gradient-to-br from-[#1E1E20] to-[#09090B] p-8 md:p-12 border-l border-gray-800 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-2">Role Based Access Control</h2>
            <p className="text-sm text-gray-400">Access the system with different roles</p>
          </div>

          <div className="space-y-4">
            {/* Admin Demo */}
            <button 
              type="button"
              disabled={true}
              className="w-full flex items-center p-4 bg-[#151516] border border-gray-800 rounded-xl hover:border-saas-neon group transition-all text-left"
            >
              <div className="bg-purple-500/10 p-3 rounded-lg mr-4 group-hover:bg-purple-500/20 transition-colors">
                <Shield className="text-purple-500" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-saas-neon transition-colors">Login as Admin</h3>
                <p className="text-xs text-gray-500 mt-0.5">Full system control, billing, and user management.</p>
              </div>
            </button>

            {/* Manager Demo */}
            <button 
              type="button"
              disabled={true}
              className="w-full flex items-center p-4 bg-[#151516] border border-gray-800 rounded-xl hover:border-saas-neon group transition-all text-left"
            >
              <div className="bg-blue-500/10 p-3 rounded-lg mr-4 group-hover:bg-blue-500/20 transition-colors">
                <Users className="text-blue-500" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-saas-neon transition-colors">Login as Manager</h3>
                <p className="text-xs text-gray-500 mt-0.5">View all workspace data, reports, and team pipelines.</p>
              </div>
            </button>

            {/* Sales Rep Demo */}
            <button 
              type="button"
              disabled={true}
              className="w-full flex items-center p-4 bg-[#151516] border border-gray-800 rounded-xl hover:border-saas-neon group transition-all text-left"
            >
              <div className="bg-saas-neon/10 p-3 rounded-lg mr-4 group-hover:bg-saas-neon/20 transition-colors">
                <Briefcase className="text-saas-neon" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-saas-neon transition-colors">Login as Sales Rep</h3>
                <p className="text-xs text-gray-500 mt-0.5">Restricted view: Own contacts, deals, and tickets only.</p>
              </div>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
