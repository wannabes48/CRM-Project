import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft, Mail, Phone, MapPin, Send, Loader2, CheckCircle2, Hexagon, Globe, Shield } from 'lucide-react';
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Simulate API call (Replace with actual Axios post to Django later)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      
      // Reset form after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-saas-bg font-sans selection:bg-saas-neon/30 text-gray-900 dark:text-gray-100 pb-24 transition-colors duration-700">
      
      {/* Navbar Minimal Premium */}
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between relative z-50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-saas-neon text-black p-2.5 rounded-2xl shadow-xl shadow-saas-neon/20 group-hover:rotate-12 transition-transform duration-500">
             <Hexagon size={24} fill="currentColor" strokeWidth={0} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none">Xentrix</span>
        </Link>
        <Link to="/" className="text-[10px] font-black text-gray-400 dark:text-gray-500 hover:text-saas-neon transition-all flex items-center gap-3 uppercase tracking-[0.2em] group">
          <div className="p-2 rounded-xl bg-white dark:bg-saas-surface border border-transparent group-hover:border-saas-neon/20 group-hover:scale-110 transition-all shadow-sm">
             <ArrowLeft size={16} strokeWidth={3} />
          </div>
          Return to Hub
        </Link>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 pt-16 md:pt-24 grid lg:grid-cols-2 gap-20 items-start relative overflow-hidden">
        
        {/* Background Blur Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saas-neon/5 blur-[120px] rounded-full pointer-events-none -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none -ml-24 -mb-24"></div>

        {/* Left Side: Contact Information */}
        <div className="space-y-16 relative z-10">
          <FadeIn>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-1.5 h-8 bg-saas-neon rounded-full"></div>
                 <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">Let's Talk<br/>Pipeline.</h1>
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 leading-loose max-w-md ml-5">
                Whether you have a question about security protocols, enterprise pricing, or custom cloud integrations, our elite support team is online.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="grid grid-cols-1 gap-6">
              {[
                { title: 'Protocol Support', desc: 'Our technical team is on standby.', link: 'hello@xentrix.com', icon: <Mail size={22} />, label: 'Email Dispatch' },
                { title: 'Global Hotline', desc: 'Direct connection to headquarters.', link: '+1 (800) 123-4567', icon: <Phone size={22} />, label: 'Voice Link' },
                { title: 'Physical Node', desc: 'San Francisco, CA Protocol Center.', link: '100 Innovation Drive', icon: <MapPin size={22} />, label: 'HQ Location' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-6 p-8 bg-white/40 dark:bg-saas-surface/40 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-saas-neon/5 hover:border-saas-neon/30 transition-all duration-500 group">
                  <div className="bg-saas-neon/10 text-saas-neon p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500 shrink-0 border border-saas-neon/10 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1">{item.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight mb-4">{item.desc}</p>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-saas-neon uppercase tracking-[0.2em] mb-1">{item.label}</span>
                       <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter group-hover:text-saas-neon transition-colors">{item.link}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={200}>
             <div className="flex items-center gap-4 ml-5">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-saas-bg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
                        <img src={`https://i.pravatar.cc/100?u=support${i}`} alt="support" className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Elite Support Mesh</p>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Global average response: 12 minutes</p>
                </div>
             </div>
          </FadeIn>
        </div>

        {/* Right Side: The Form */}
        <FadeIn delay={300}>
          <div className="bg-white/60 dark:bg-saas-surface/60 backdrop-blur-3xl p-10 md:p-14 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-[0_40px_100px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group/form animate-in slide-in-from-right-12 duration-1000">
            
            <div className="mb-10 flex justify-between items-center">
               <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Transmission Portal</h2>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-saas-neon animate-pulse"></div>
                  <span className="text-[8px] font-black text-saas-neon uppercase tracking-widest">Encrypted Link Active</span>
               </div>
            </div>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-20 animate-in zoom-in duration-700">
                <div className="w-24 h-24 bg-saas-neon/10 rounded-[2rem] flex items-center justify-center mb-8 border border-saas-neon/20 shadow-2xl shadow-saas-neon/10">
                  <CheckCircle2 size={40} className="text-saas-neon" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">Transmission Sent.</h3>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] leading-loose max-w-xs">Our operatives have received your signal. Expect decryption within 24 standard business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {status === 'error' && (
                  <div className="p-5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                    <Shield size={16} className="shrink-0" />
                    Security Protocol Error: Verification failed.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-white dark:bg-saas-bg border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 shadow-sm"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-white dark:bg-saas-bg border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 shadow-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Work Email Protocol</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white dark:bg-saas-bg border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 shadow-sm"
                    placeholder="jane@enterprise.com"
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Inquiry Vector</label>
                  <div className="relative">
                    <select 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-white dark:bg-saas-bg border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="" disabled>Select Vector...</option>
                      <option value="sales">Sales & Pipelines</option>
                      <option value="support">Technical Infrastructure</option>
                      <option value="billing">Cloud Subscriptions</option>
                      <option value="other">Universal Inquiry</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-saas-neon transition-colors">
                      <ArrowLeft size={16} strokeWidth={3} className="-rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Signal Content</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white dark:bg-saas-bg border border-gray-100 dark:border-gray-800 rounded-[2rem] py-5 px-6 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 text-gray-900 dark:text-white resize-none shadow-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    placeholder="Describe your operational requirements..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-saas-neon hover:scale-[1.02] active:scale-95 text-black font-black py-6 rounded-2xl transition-all shadow-2xl shadow-saas-neon/30 flex items-center justify-center gap-4 disabled:opacity-70 group uppercase text-xs tracking-[0.2em]"
                >
                  {status === 'submitting' ? <Loader2 className="animate-spin" size={20} strokeWidth={3} /> : (
                    <>Establish Connection <Send size={18} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
                <p className="text-center text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mt-10">
                  Data processing protected by <Link to="/privacy" className="text-gray-900 dark:text-white hover:text-saas-neon underline underline-offset-4 decoration-gray-100 dark:decoration-gray-800 transition-all">Xentrix Privacy Shield</Link>.
                </p>
              </form>
            )}
            
            {/* Ambient decorative background inside form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-saas-neon/5 rounded-full blur-[120px] pointer-events-none group-hover/form:bg-saas-neon/10 transition-all duration-1000"></div>
          </div>
        </FadeIn>
        
      </main>

      <div className="mt-32">
         <Footer />
      </div>
    </div>
  );
}