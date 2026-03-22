import React, { useState, useEffect } from 'react';
import { User, Building, Lock, Bell, Save, Loader2, Shield, Moon, Sun, CreditCard, Users, ExternalLink, ShieldCheck, Monitor, Smartphone, Globe, Rocket} from 'lucide-react';
import api from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

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
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences and workspace details.</p>

        {/* APPEARANCE TOGGLE */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-black dark:text-white hover:border-saas-neon transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-500" />}
          <span className="text-sm font-bold">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </header>

      {/* Success/Error Toast */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold animate-in slide-in-from-top-4 ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-saas-neon/10 text-saas-neon border border-saas-neon/20'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        
        {/* Settings Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-saas-surface text-saas-neon shadow-sm border border-gray-200 dark:border-gray-800' 
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-saas-surface hover:text-black dark:hover:text-white border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Content Area */}
        <main className="flex-1 bg-white dark:bg-saas-surface rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white">Profile Information</h2>
                <p className="text-gray-500 text-sm mt-1">Update your personal details and public profile.</p>
              </div>

              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 rounded-full bg-saas-neon/20 flex items-center justify-center text-2xl font-black text-saas-neon border-2 border-saas-neon">
                  {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                </div>
                <div>
                  <button type="button" className="px-4 py-2 bg-gray-100 dark:bg-saas-bg text-black dark:text-white rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    Upload Avatar
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">First Name</label>
                  <input type="text" value={profile.first_name} onChange={e => setProfile({...profile, first_name: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Last Name</label>
                  <input type="text" value={profile.last_name} onChange={e => setProfile({...profile, last_name: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white" />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                <input type="email" value={profile.email} disabled
                  className="w-full bg-gray-100 dark:bg-saas-bg/50 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-sm text-gray-500 cursor-not-allowed" />
                <p className="text-xs text-gray-500">To change your login email, please contact support.</p>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-xs font-bold text-gray-400 uppercase">System Role</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-saas-neon/10 border border-saas-neon/20 rounded-xl w-fit">
                  <Shield size={16} className="text-saas-neon" />
                  <span className="text-sm font-bold text-saas-neon">{profile.role}</span>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-saas-neon hover:bg-[#9EE042] text-black font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(178,255,77,0.3)] disabled:opacity-50">
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          )}
          

          {/* WORKSPACE TAB */}
          {activeTab === 'workspace' && (
            <form onSubmit={handleSave} className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-black dark:text-white">Workspace Settings</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your company details and tenant domain.</p>
              </div>

              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Company Name</label>
                  <input type="text" value={workspace.name} onChange={e => setWorkspace({...workspace, name: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Primary Industry</label>
                  <select value={workspace.industry} onChange={e => setWorkspace({...workspace, industry: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white appearance-none">
                    <option>Technology</option>
                    <option>Real Estate</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-saas-neon hover:bg-[#9EE042] text-black font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(178,255,77,0.3)] disabled:opacity-50">
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Workspace
                </button>
              </div>
            </form>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-black dark:text-white">Billing & Subscription</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your payment methods, view invoices, and change your plan.</p>
              </div>

              {/* Current Plan Overview Card */}
              <div className="bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Current Plan</p>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-black text-black dark:text-white">{subscription.plan_tier}</p>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border ${
                        subscription.is_active 
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' 
                          : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30'
                      }`}>
                        <ShieldCheck size={14} /> {subscription.subscription_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portal Action Section */}
              <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                  We use Stripe to securely manage your billing details. Clicking the button below will open a secure window where you can update your credit card, download past invoices, or cancel your subscription.
                </p>

                <div className="flex justify-start">
                  {subscription.plan_tier === 'Free' ? (
                    <button 
                      onClick={handleUpgrade}
                      disabled={isRedirecting} 
                      className="flex items-center justify-center gap-2 bg-saas-neon hover:bg-[#9EE042] text-black font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(178,255,77,0.4)] disabled:opacity-50 group"
                    >
                      {isRedirecting ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>Upgrade to Professional <Rocket size={18} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /></>
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={handleManageBilling}
                      disabled={isRedirecting} 
                      className="flex items-center justify-center gap-2 bg-saas-neon hover:bg-[#9EE042] text-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(178,255,77,0.3)] disabled:opacity-50"
                    >
                      {isRedirecting ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>Open Billing Portal <ExternalLink size={18} /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === 'team' && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-black dark:text-white">Team Management</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your team members and their roles.</p>
              </div>
              {/* Placeholder for Team Management UI */}
              <div className="bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <p className="text-gray-500 dark:text-gray-400">Team management features will be available in a future update.</p>
              </div>
            </div>  
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <>
              <div className="bg-white dark:bg-[#151516] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm mb-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 bg-gray-50 dark:bg-gray-800/20">
                <Shield className="text-emerald-600" size={20} />
                <h3 className="font-bold text-gray-900 dark:text-white">Recent Logins</h3>
              </div>
              {loading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
              ) : logs.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No login history found.</div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {logs.map((log) => {
                    const { label, Icon } = parseDevice(log.user_agent);
                    return (
                      <div key={log.id} className="p-4 flex items-center justify-between p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/10 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white mb-1">
                              {label}
                              {log.status === 'Success' ? (
                                <span className="ml-3 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-0.5 rounded-full">Success</span>
                              ) : (
                                <span className="ml-3 text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 px-2 py-0.5 rounded-full">Failed</span>
                              )}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>IP: {log.ip_address || 'Unknown'}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{new Date(log.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}
                </div>
            <form onSubmit={handlePasswordChange} className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white">Change Password</h2>
                <p className="text-gray-500 text-sm mt-1">Ensure your account is using a long, random password to stay secure.</p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Current Password</label>
                  <input required type="password" value={passwords.old_password} onChange={e => setPasswords({...passwords, old_password: e.target.value})} className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">New Password</label>
                  <input required type="password" value={passwords.new_password} onChange={e => setPasswords({...passwords, new_password: e.target.value})} className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Confirm New Password</label>
                  <input required type="password" value={passwords.confirm_password} onChange={e => setPasswords({...passwords, confirm_password: e.target.value})} className="w-full bg-gray-50 dark:bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-sm outline-none focus:border-saas-neon text-black dark:text-white" />
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-saas-neon hover:bg-[#9EE042] text-black font-bold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50">
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />} Update Password
                </button>
              </div>
            </form>
            </>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white">Notification Preferences</h2>
                <p className="text-gray-500 text-sm mt-1">Choose how you want to stay updated.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-saas-bg border border-gray-100 dark:border-gray-800 rounded-xl">
                  <div>
                    <h4 className="font-bold text-black dark:text-white">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Get important updates delivered to your inbox.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saas-neon/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saas-neon"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-saas-bg border border-gray-100 dark:border-gray-800 rounded-xl">
                  <div>
                    <h4 className="font-bold text-black dark:text-white">In-App Notifications</h4>
                    <p className="text-sm text-gray-500">Receive alerts while using the dashboard.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-saas-neon/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saas-neon"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-saas-bg border border-gray-100 dark:border-gray-800 rounded-xl">
                  <div>
                    <h4 className="font-bold text-black dark:text-white">Mobile Push Notifications</h4>
                    <p className="text-sm text-gray-500">Get alerts on your phone (Coming Soon).</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" disabled className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}