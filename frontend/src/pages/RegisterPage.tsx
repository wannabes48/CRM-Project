import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building, User, ArrowRight, Loader2, Hexagon, Zap, BarChart3, ShieldCheck, CheckCircle2} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [tenantName, setTenantName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      setStatus('error');
      return;
    }

    // 2. Validate Password Length (Optional but recommended)
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    setError('');
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
      console.log('Registering payload:', { tenantName, username, email, password });

      setStatus('success');
      
      // Mock success and redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden">
        <Link to="/" className="absolute top-6 left-6 md:top-10 md:left-10 text-gray-100 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors z-50">
            <ArrowLeft size={16} /> Back to Home
        </Link>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saas-neon/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-[#151516]/80 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Registration Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="bg-saas-neon text-black p-2 rounded-lg">
              <Hexagon size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">Xentrix<span className="text-saas-neon">.CRM</span></span>
          </Link>

          {status === 'success' ? (
            /* SUCCESS STATE UI */
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 size={40} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Workspace Created!</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                Welcome aboard, {firstName}. We are setting up your environment.
              </p>
              <p className="text-saas-neon font-bold text-sm animate-pulse mt-6">
                Redirecting to login...
              </p>
            </div>
          ) : (
          
          <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-black text-white mb-2">Initialize Workspace</h1>
            <p className="text-gray-400 text-sm mb-8">Set up your company tenant and admin account in seconds.</p>

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-xl animate-in fade-in">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Workspace Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Workspace Name</label>
                <div className="relative">
                  <Building className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Acme Corp"
                    required
                    className="w-full bg-[#09090B] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-saas-neon transition-colors"
                  />
                </div>
              </div>

              {/* First & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Jane"
                        required
                        className="w-full bg-[#09090B] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-saas-neon transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        required
                        className="w-full bg-[#09090B] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-saas-neon transition-colors"
                      />
                    </div>
                  </div>
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Email</label>
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#09090B] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-saas-neon transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-saas-neon hover:bg-[#9EE042] text-black font-black py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(178,255,77,0.2)] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>Create Workspace <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-white hover:text-saas-neon transition-colors">
              Sign in here
            </Link>
          </p>
          </div>
          )}
        </div>

        {/* Right Side: Value Proposition / Features */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#1E1E20] to-[#09090B] p-12 border-l border-gray-800 flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Limitless Possibilities</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Join thousands of businesses using Xentrix to optimize workflows, scale effortlessly, and build stronger customer relationships.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#064E3B]/40 p-3 rounded-xl border border-[#064E3B]">
                <BarChart3 className="text-emerald-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">AI-Powered Insights</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Make data-driven decisions with real-time analytics and intelligent forecasting.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#064E3B]/40 p-3 rounded-xl border border-[#064E3B]">
                <Zap className="text-emerald-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Workflow Automation</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Streamline repetitive tasks, boost team efficiency, and focus on closing deals.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#064E3B]/40 p-3 rounded-xl border border-[#064E3B]">
                <ShieldCheck className="text-emerald-400" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Secure Cloud Integration</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Bank-grade security ensures your customer data is synced and protected 24/7.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}