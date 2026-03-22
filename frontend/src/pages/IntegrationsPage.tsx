import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, ArrowRight, Search, Hash, Calendar, Mail, 
  CreditCard, MessageSquare, Video, Share2, FileText, PieChart, 
  ArrowUpRight, Code
} from 'lucide-react';
import Footer from '../components/layout/Footer';

// --- Reusable Scroll Reveal Component ---
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Mock Data for Integrations
const INTEGRATIONS = [
  { id: 1, name: 'Slack', category: 'Productivity', desc: 'Get instant notifications for new deals and support tickets in your channels.', color: 'bg-[#4A154B]/10 text-[#4A154B]', icon: <Hash size={24} /> },
  { id: 2, name: 'Google Calendar', category: 'Productivity', desc: 'Two-way sync for all your sales meetings and automated demo scheduling.', color: 'bg-blue-500/10 text-blue-600', icon: <Calendar size={24} /> },
  { id: 3, name: 'Mailchimp', category: 'Marketing', desc: 'Sync contacts dynamically and trigger automated email drip campaigns.', color: 'bg-yellow-500/10 text-yellow-600', icon: <Mail size={24} /> },
  { id: 4, name: 'Stripe', category: 'Finance', desc: 'Create invoices, track subscriptions, and manage payments directly in CRM.', color: 'bg-indigo-500/10 text-indigo-600', icon: <CreditCard size={24} /> },
  { id: 5, name: 'Zendesk', category: 'Support', desc: 'View customer support tickets alongside their sales profile and history.', color: 'bg-emerald-500/10 text-emerald-600', icon: <MessageSquare size={24} /> },
  { id: 6, name: 'Zoom', category: 'Productivity', desc: 'Auto-generate and attach unique video links for scheduled customer demos.', color: 'bg-blue-400/10 text-blue-500', icon: <Video size={24} /> },
  { id: 7, name: 'HubSpot', category: 'Marketing', desc: 'Import marketing qualified leads automatically when they hit your score threshold.', color: 'bg-orange-500/10 text-orange-600', icon: <Share2 size={24} /> },
  { id: 8, name: 'DocuSign', category: 'Sales', desc: 'Send customized contracts and track digital signature status in real-time.', color: 'bg-blue-600/10 text-blue-700', icon: <FileText size={24} /> },
  { id: 9, name: 'QuickBooks', category: 'Finance', desc: 'Keep your accounting data in perfect harmony with closed-won deals.', color: 'bg-green-600/10 text-green-700', icon: <PieChart size={24} /> },
];

const CATEGORIES = ['All', 'Sales', 'Marketing', 'Productivity', 'Finance', 'Support'];

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredIntegrations = INTEGRATIONS.filter(app => {
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    // 1. Flex layout to lock the footer to the bottom
    <div className="flex flex-col min-h-screen bg-saas-bg font-sans selection:bg-saas-neon/30 text-gray-900 dark:text-gray-100">
      
      {/* Navbar Minimal */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10 w-full shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-saas-neon text-white dark:text-black p-1.5 rounded-lg shadow-lg shadow-saas-neon/20">
            <LayoutDashboard size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Xentrix</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-saas-neon transition-colors flex items-center gap-2">
          Back to Home <ArrowRight size={16} />
        </Link>
      </nav>

      {/* 2. Main content flexes to fill available space */}
      <main className="flex-1 w-full pb-24">
        
        {/* Header Section */}
        <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
              Connect your favorite tools.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Supercharge your workflow by connecting Xentrix to the apps your team already uses every day. No coding required.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-16">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search integrations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white outline-none focus:border-saas-neon transition-all shadow-sm"
              />
            </div>
          </FadeIn>

          {/* Category Tabs */}
          <FadeIn delay={100}>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                    activeCategory === category 
                      ? 'bg-saas-neon text-white dark:text-black shadow-lg shadow-saas-neon/20' 
                      : 'bg-saas-surface text-gray-500 dark:text-gray-400 hover:text-saas-neon hover:bg-saas-bg border border-gray-200 dark:border-gray-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* Integrations Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredIntegrations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((app, idx) => (
                <FadeIn key={app.id} delay={idx * 50}>
                  <div className="bg-saas-surface p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-saas-neon transition-all duration-300 group h-full flex flex-col cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${app.color}`}>
                        {app.icon}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-saas-bg px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">
                        {app.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{app.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1 mb-6">
                      {app.desc}
                    </p>
                    <div className="flex items-center text-saas-neon font-black text-sm transition-colors mt-auto uppercase tracking-tight">
                      View Integration <ArrowUpRight size={16} className="ml-1" />
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-saas-surface rounded-3xl border border-gray-200 dark:border-gray-800 border-dashed">
              <div className="w-16 h-16 bg-saas-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No integrations found</h3>
              <p className="text-gray-600 dark:text-gray-400">We couldn't find anything matching "{searchQuery}".</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-6 text-saas-neon font-bold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Developer API CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <FadeIn>
            <div className="bg-saas-surface dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-saas-neon/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-saas-neon/10 text-saas-neon px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-saas-neon/20 shadow-sm">
                  <Code size={14} /> For Developers
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Need a custom workflow?</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Our robust REST API and webhooks allow you to build custom integrations and connect Xentrix to your proprietary internal tools.
                </p>
              </div>

              <div className="relative z-10 shrink-0">
                <Link to="/contact" className="bg-saas-neon hover:bg-saas-neonhover text-white dark:text-black font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-saas-neon/20 flex items-center gap-2">
                  Read API Docs <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>

      </main>

      {/* 3. Footer automatically sits at the bottom */}
      <Footer />
    </div>
  );
}