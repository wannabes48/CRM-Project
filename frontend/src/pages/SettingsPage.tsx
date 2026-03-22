import React, { useState, useEffect } from 'react';
import { User, Building, Lock, Bell, Save, Loader2, Shield, Moon, Sun, CreditCard, Users, ExternalLink, ShieldCheck, Monitor, Smartphone, Globe, Rocket} from 'lucide-react';
import api from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import TeamMembersTab from '../components/settings/TeamMembersTab';

type Tab = 'profile' | 'workspace' | 'security' | 'billing' | 'team' | 'notifications';

interface LoginLog {
  id: string;
  ip_address: string;
  user_agent: string;
  status: string;
  created_at: string;
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleManageBilling = async () => {
    setLoading(true);
    setIsRedirecting(true);
    try {
      const res = await api.post('create-portal-session/');
      
      // Redirect to the secure Stripe portal
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Could not load billing portal.");
    } finally {
      setLoading(false);
      setIsRedirecting(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    setIsRedirecting(true);
    try {
      const res = await api.post('create-checkout-session/');
      
      // Redirect to the Stripe Checkout page
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Could not start checkout session.");
    } finally {
      setLoading(false);
      setIsRedirecting(false);
    }
  };

  const [subscription, setSubscription] = useState({
    plan_tier: 'Loading...',
    subscription_status: 'loading',
    is_active: false
  });

  useEffect(() => {
    // Fetch the status when the component mounts
    const fetchStatus = async () => {
      try {
        const res = await api.get('subscription-status/');
        setSubscription(res.data);
      } catch (err) {
        console.error("Failed to fetch subscription", err);
      }
    };
    
    fetchStatus();
  }, []);

  // Form States
  const [profile, setProfile] = useState({first_name: '', last_name: '', email: '', role: ''});

  const [workspace, setWorkspace] = useState({name: '', domain: '', industry: 'Technology'});
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '', confirm_password: '' });

  // Fetch Live Data on Mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [userRes, tenantRes] = await Promise.all([
          api.get('users/me/'),
          api.get('tenant/')
        ]);
        setProfile(userRes.data);
        setWorkspace(tenantRes.data);
      } catch (error) {
        console.error("Failed to load settings data", error);
      }
    };
    fetchSettings();
  }, []);

  // Save Profile or Workspace
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      if (activeTab === 'profile') {
        await api.patch('users/me/', profile);
      } else if (activeTab === 'workspace') {
        await api.patch('tenant/', workspace);
      }
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // Save Password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      return setMessage({ type: 'error', text: 'New passwords do not match.' });
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.post('users/change-password/', passwords);
      setMessage({ type: 'success', text: 'Password updated securely.' });
      setPasswords({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update password.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  const [logs, setLogs] = useState<LoginLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('login-activity/');
        const data = res.data.results ? res.data.results : res.data;
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch activity logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Helper function to make User-Agents readable and pick an icon
  const parseDevice = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    let browser = "Unknown Browser";
    let os = "Unknown OS";
    let Icon = Globe;

    // Detect OS
    if (ua.includes('mac')) os = 'macOS';
    else if (ua.includes('win')) os = 'Windows';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('iphone') || ua.includes('ipad')) { os = 'iOS'; Icon = Smartphone; }
    else if (ua.includes('android')) { os = 'Android'; Icon = Smartphone; }
    else Icon = Monitor;

    // Detect Browser
    if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('edg')) browser = 'Edge';

    return { label: `${browser} on ${os}`, Icon };
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
    { id: 'workspace', label: 'Workspace', icon: <Building size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
    { id: 'team', label: 'Team Members', icon: <Users size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 pb-12">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 font-medium">Manage your account preferences and workspace details.</p>
        </div>

        {/* APPEARANCE TOGGLE */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 px-6 py-2.5 bg-saas-surface dark:bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm text-gray-900 dark:text-white hover:border-saas-neon transition-all hover:scale-105 active:scale-95 group"
        >
          {theme === 'dark' ? <Sun size={18} className="text-saas-neon group-hover:rotate-45 transition-transform" /> : <Moon size={18} className="text-indigo-500 group-hover:-rotate-12 transition-transform" />}
          <span className="text-[10px] font-black uppercase tracking-widest">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </header>

      {/* Success/Error Toast */}
      {message.text && (
        <div className={`mb-8 p-5 rounded-2xl text-sm font-black animate-in slide-in-from-top-4 shadow-xl ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-saas-neon/10 text-saas-neon border border-saas-neon/20'}`}>
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full animate-pulse ${message.type === 'error' ? 'bg-red-500' : 'bg-saas-neon'}`}></div>
             {message.text}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 flex-1">
        
        {/* Settings Sidebar Navigation */}
        <aside className="w-full lg:w-72 shrink-0">
          <nav className="flex flex-col space-y-2 bg-saas-surface/30 dark:bg-black/10 p-2 rounded-3xl border border-gray-100 dark:border-gray-900/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-saas-surface text-saas-neon shadow-2xl shadow-black/5 dark:shadow-saas-neon/5 border border-gray-200 dark:border-gray-800 translate-x-1' 
                    : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-saas-surfacehover hover:text-gray-900 dark:hover:text-white border border-transparent'
                }`}
              >
                <span className={`${activeTab === tab.id ? 'text-saas-neon' : 'text-gray-400 group-hover:text-saas-neon'}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Content Area */}
        <main className="flex-1 bg-saas-surface rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-black/5 overflow-hidden ring-1 ring-black/5 dark:ring-white/5 h-fit">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="p-10">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Profile Information</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Update your personal details and public profile.</p>
              </div>

              <div className="flex items-center gap-8 mb-10 pb-10 border-b border-gray-50 dark:border-gray-800">
                <div className="w-24 h-24 rounded-3xl bg-saas-neon/10 flex items-center justify-center text-3xl font-black text-saas-neon border-2 border-saas-neon/30 shadow-inner">
                  {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
                </div>
                <div>
                  <button type="button" className="px-6 py-3 bg-saas-bg dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm">
                    Upload New Avatar
                  </button>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">First Name</label>
                  <input type="text" value={profile.first_name} onChange={e => setProfile({...profile, first_name: e.target.value})}
                    className="w-full bg-saas-bg dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-saas-neon/50 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white font-bold transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Last Name</label>
                  <input type="text" value={profile.last_name} onChange={e => setProfile({...profile, last_name: e.target.value})}
                    className="w-full bg-saas-bg dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-saas-neon/50 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white font-bold transition-all" />
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input type="email" value={profile.email} disabled
                  className="w-full bg-saas-bg/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm text-gray-400 cursor-not-allowed font-bold" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">To change your login email, please contact support.</p>
              </div>

              <div className="space-y-3 mb-10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">System Role</label>
                <div className="flex items-center gap-3 px-5 py-3.5 bg-saas-neon/5 border border-saas-neon/10 rounded-2xl w-fit group">
                  <Shield size={18} className="text-saas-neon" />
                  <span className="text-sm font-black text-saas-neon uppercase tracking-widest">{profile.role}</span>
                </div>
              </div>

              <div className="flex justify-end pt-10 border-t border-gray-50 dark:border-gray-800">
                <button type="submit" disabled={isSaving} className="flex items-center gap-3 bg-saas-neon hover:bg-saas-neonhover text-white dark:text-black font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-saas-neon/20 disabled:opacity-50 uppercase tracking-[0.2em] text-xs">
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save Profile
                </button>
              </div>
            </form>
          )}
          

          {/* WORKSPACE TAB */}
          {activeTab === 'workspace' && (
            <form onSubmit={handleSave} className="p-10">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Workspace Settings</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Manage your company details and tenant domain.</p>
              </div>

              <div className="space-y-8 mb-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Company Name</label>
                  <input type="text" value={workspace.name} onChange={e => setWorkspace({...workspace, name: e.target.value})}
                    className="w-full bg-saas-bg dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-saas-neon/50 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white font-bold transition-all" />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Primary Industry</label>
                  <div className="relative">
                    <select value={workspace.industry} onChange={e => setWorkspace({...workspace, industry: e.target.value})}
                      className="w-full bg-saas-bg dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-saas-neon/50 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white font-bold transition-all appearance-none cursor-pointer">
                      <option>Technology</option>
                      <option>Real Estate</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                       <Globe size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-10 border-t border-gray-50 dark:border-gray-800">
                <button type="submit" disabled={isSaving} className="flex items-center gap-3 bg-saas-neon hover:bg-saas-neonhover text-white dark:text-black font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-saas-neon/20 disabled:opacity-50 uppercase tracking-[0.2em] text-xs">
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Update Workspace
                </button>
              </div>
            </form>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="p-10">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Billing & Subscription</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Manage your payment methods, view invoices, and change your plan.</p>
              </div>

              {/* Current Plan Overview Card */}
              <div className="bg-saas-bg dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-inner ring-1 ring-black/5">
                <div className="flex items-center gap-6">
                  <div className="bg-saas-neon/10 dark:bg-saas-neon/5 text-saas-neon p-5 rounded-2xl shadow-sm border border-saas-neon/20">
                    <CreditCard size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Current Activity</p>
                    <div className="flex items-center gap-4">
                      <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{subscription.plan_tier}</p>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 border ${
                        subscription.is_active 
                          ? 'bg-saas-neon/10 text-saas-neon border-saas-neon/20' 
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${subscription.is_active ? 'bg-saas-neon' : 'bg-red-500'}`}></div>
                        {subscription.subscription_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portal Action Section */}
              <div className="space-y-8 pt-10 border-t border-gray-50 dark:border-gray-800">
                <div className="bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100/50 dark:border-indigo-500/10 p-6 rounded-2xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed flex items-start gap-4">
                    <ShieldCheck className="text-indigo-500 shrink-0 mt-0.5" size={20} />
                    We use Stripe to securely manage your billing details. Clicking the button below will open a secure window where you can update your credit card, download past invoices, or cancel your subscription.
                  </p>
                </div>

                <div className="flex justify-start">
                  {subscription.plan_tier === 'Free' ? (
                    <button 
                      onClick={handleUpgrade}
                      disabled={isRedirecting} 
                      className="flex items-center justify-center gap-4 bg-saas-neon hover:bg-saas-neonhover text-white dark:text-black font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-saas-neon/30 disabled:opacity-50 group uppercase tracking-[0.2em] text-xs"
                    >
                      {isRedirecting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>Upgrade to Professional <Rocket size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={handleManageBilling}
                      disabled={isRedirecting} 
                      className="flex items-center justify-center gap-4 bg-gray-900 dark:bg-saas-bg hover:bg-black dark:hover:bg-black text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl disabled:opacity-50 uppercase tracking-[0.2em] text-xs border border-white/5"
                    >
                      {isRedirecting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>Open Billing Portal <ExternalLink size={20} /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === 'team' && (
            <TeamMembersTab />
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="p-10">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Security & Privacy</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Monitor your session activity and keep your account secure.</p>
              </div>

              <div className="bg-saas-bg dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-inner mb-12 ring-1 ring-black/5">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-gray-50/50 dark:bg-gray-800/20">
                  <div className="p-2 bg-saas-neon/10 rounded-lg text-saas-neon shadow-sm">
                    <Shield size={20} strokeWidth={2.5}/>
                  </div>
                  <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Recent Login Activity</h3>
                </div>
                {loading ? (
                  <div className="p-16 flex justify-center">
                    <Loader2 className="animate-spin text-saas-neon" size={40} />
                  </div>
                ) : logs.length === 0 ? (
                  <div className="p-16 text-center text-gray-500 font-medium">No login history found.</div>
                ) : (
                  <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {logs.map((log) => {
                      const { label, Icon } = parseDevice(log.user_agent);
                      return (
                        <div key={log.id} className="p-6 hover:bg-saas-bg/50 dark:hover:bg-gray-800/10 transition-colors group">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                              <div className="bg-saas-surface dark:bg-gray-800 p-4 rounded-2xl text-gray-500 dark:text-gray-400 shadow-sm border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform">
                                <Icon size={24} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center flex-wrap gap-3 mb-1.5">
                                  <p className="font-black text-gray-900 dark:text-white tracking-tight">
                                    {label}
                                  </p>
                                  {log.status === 'Success' ? (
                                    <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-500/20">Authorized</span>
                                  ) : (
                                    <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 px-3 py-1 rounded-full border border-red-200/50 dark:border-red-500/20">Failed Attempt</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                  <span className="flex items-center gap-1.5"><Globe size={12} className="text-gray-300" /> {log.ip_address || 'Unknown'}</span>
                                  <span className="hidden sm:inline opacity-30">•</span>
                                  <span>{new Date(log.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                </div>
                              </div>
                            </div>
                            {log.status === 'Success' && (
                               <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors border border-gray-100 dark:border-gray-800 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/10">Log Out Session</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <form onSubmit={handlePasswordChange}>
                <div className="mb-10">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Update Password</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Protect your workspace with a secure, highly unique password.</p>
                </div>
                <div className="space-y-6 mb-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Current Password</label>
                    <input required type="password" value={passwords.old_password} onChange={e => setPasswords({...passwords, old_password: e.target.value})} className="w-full bg-saas-bg dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-saas-neon/50 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white font-bold transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">New Password</label>
                      <input required type="password" value={passwords.new_password} onChange={e => setPasswords({...passwords, new_password: e.target.value})} className="w-full bg-saas-bg dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-saas-neon/50 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white font-bold transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                      <input required type="password" value={passwords.confirm_password} onChange={e => setPasswords({...passwords, confirm_password: e.target.value})} className="w-full bg-saas-bg dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-saas-neon/50 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white font-bold transition-all" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-10 border-t border-gray-50 dark:border-gray-800">
                  <button type="submit" disabled={isSaving} className="flex items-center gap-3 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black font-black py-4 px-10 rounded-2xl transition-all shadow-xl disabled:opacity-50 uppercase tracking-[0.2em] text-xs">
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />} Update Security
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="p-10">
              <div className="mb-10">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Notification Channels</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Choose how you want to stay updated across your device fleet.</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: 'Email Alerts', desc: 'Critical system updates and weekly summaries.', active: true },
                  { title: 'Real-time Dashboards', desc: 'Push notifications inside the application workspace.', active: true },
                  { title: 'Slack Integration', desc: 'Send alerts directly to your preferred channels.', active: false, comingSoon: true }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-saas-bg dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-3xl hover:border-saas-neon/20 transition-all group">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-saas-surface dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-saas-neon transition-colors shadow-sm">
                          <Bell size={24} />
                       </div>
                       <div>
                          <h4 className="font-black text-lg text-gray-900 dark:text-white tracking-tight leading-none mb-2">{item.title} {item.comingSoon && <span className="ml-2 text-[8px] uppercase tracking-widest text-indigo-500 bg-indigo-500/5 px-2 py-1 rounded-full border border-indigo-500/10">Future</span>}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.desc}</p>
                       </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={item.active} disabled={item.comingSoon} className="sr-only peer" />
                      <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saas-neon/20 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-saas-neon shadow-inner"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
                  <div className="flex items-start gap-5">
                    <div className="bg-indigo-500/10 p-4 rounded-2xl text-indigo-500">
                       <Bell size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">Notification Overload?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">You can silence all non-critical notifications for specific time periods using our upcoming "Quiet Hours" feature.</p>
                      <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors">Learn more about notification privacy</button>
                    </div>
                  </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}