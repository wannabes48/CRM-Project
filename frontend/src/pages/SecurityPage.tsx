import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, ArrowRight, Shield, Lock, Server, 
  Key, Eye, FileText, CheckCircle2, Cloud, AlertTriangle 
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

export default function SecurityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-saas-bg font-sans selection:bg-saas-neon/30 text-gray-900 dark:text-gray-100 pb-24">
      
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

      <main className="flex-1 w-full pb-24">
        
        {/* Hero Section */}
        <section className="pt-20 pb-24 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center justify-center p-4 bg-saas-neon/10 rounded-3xl mb-10 shadow-lg shadow-saas-neon/5 ring-1 ring-saas-neon/20">
              <Shield size={48} className="text-saas-neon" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-8">
              Enterprise-Grade <span className="text-saas-neon">Security.</span> Built-In.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              Your customer data is your most valuable asset. We protect it with military-grade encryption, continuous monitoring, and strict compliance standards.
            </p>
          </FadeIn>
        </section>

        {/* Core Security Pillars */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Lock size={24} />, title: 'End-to-End Encryption', desc: 'All data is encrypted in transit via TLS 1.3 and at rest using AES-256 bit encryption.' },
              { icon: <Key size={24} />, title: 'Access Control', desc: 'Granular role-based access control (RBAC), SSO via SAML 2.0, and mandatory 2FA.' },
              { icon: <Server size={24} />, title: 'Data Residency', desc: 'Choose where your data lives. We offer secure hosting in the US, EU, and APAC regions.' },
              { icon: <Eye size={24} />, title: 'Audit Logging', desc: 'Immutable audit trails track every login, data export, and permission change.' }
            ].map((pillar, idx) => (
              <FadeIn key={idx} delay={idx * 100}>
                <div className="bg-saas-surface p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm h-full hover:shadow-2xl hover:border-saas-neon transition-all duration-300 group">
                  <div className="w-12 h-12 bg-saas-bg text-gray-900 dark:text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-saas-neon group-hover:text-black transition-colors">
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">{pillar.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{pillar.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Dark Infrastructure Section */}
        <section className="bg-gray-900 dark:bg-saas-surface py-24 my-12 relative overflow-hidden ring-1 ring-white/5">
          <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[200%] bg-saas-neon/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter">Secure Cloud <br/>Infrastructure<span className="text-saas-neon">.</span></h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-10 font-medium">
                  Xentrix is hosted on Amazon Web Services (AWS), utilizing their highly secure data centers. Our architecture is designed for maximum resilience, eliminating single points of failure.
                </p>
                
                <div className="space-y-8">
                  {[
                    { title: 'Continuous Monitoring', desc: '24/7/365 automated threat detection and response systems.' },
                    { title: 'DDoS Protection', desc: 'Enterprise-grade mitigation against distributed denial-of-service attacks.' },
                    { title: 'Penetration Testing', desc: 'Annual third-party network and application penetration testing.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-5">
                      <div className="p-1.5 bg-saas-neon/20 rounded-lg">
                        <CheckCircle2 size={24} className="text-saas-neon shrink-0" />
                      </div>
                      <div>
                        <h4 className="text-white text-lg font-black mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-sm font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-gray-950 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                {/* Decorative UI mimicking a server dashboard */}
                <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Cloud className="text-gray-400" size={20} />
                    </div>
                    <span className="text-gray-300 font-black text-[10px] uppercase tracking-[0.2em]">System Status</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-saas-neon text-[10px] font-black uppercase tracking-widest bg-saas-neon/10 px-4 py-1.5 rounded-full ring-1 ring-saas-neon/20">
                    <span className="w-2 h-2 rounded-full bg-saas-neon animate-pulse"></span>
                    Operational
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                      <span className="text-gray-500">Uptime (90 Days)</span>
                      <span className="text-white">99.99%</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 ring-1 ring-white/5">
                      <div className="w-[99.99%] h-full bg-saas-neon rounded-full shadow-[0_0_15px_rgba(0,255,157,0.5)]"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Last Pen Test</p>
                      <p className="text-white text-lg font-black tracking-tight">Oct 12, 2025</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Backups</p>
                      <p className="text-white text-lg font-black tracking-tight">Every 4 Hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Compliance & Certifications</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">We adhere to the strictest global privacy and security frameworks so you can scale with confidence.</p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'SOC 2 Type II', desc: 'Audited annually for security, availability, and confidentiality.' },
              { title: 'GDPR Compliant', desc: 'Full support for European Union data privacy regulations.' },
              { title: 'HIPAA Ready', desc: 'Secure infrastructure ready to sign BAAs for healthcare clients.' },
              { title: 'CCPA Compliant', desc: 'Strict adherence to California consumer privacy laws.' }
            ].map((cert, idx) => (
              <FadeIn key={idx} delay={idx * 50}>
                <div className="bg-saas-surface p-8 rounded-3xl border border-gray-100 dark:border-gray-800 text-center h-full hover:border-saas-neon transition-all duration-300 group shadow-sm hover:shadow-xl">
                  <div className="w-16 h-16 mx-auto bg-saas-bg rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-800 group-hover:bg-saas-neon group-hover:text-black transition-colors">
                    <FileText size={28} />
                  </div>
                  <h3 className="font-black text-gray-900 dark:text-white mb-3 text-lg">{cert.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-bold uppercase tracking-wider">{cert.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Bug Bounty / Contact CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <FadeIn>
            <div className="bg-saas-neon/10 rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 border border-saas-neon/20 shadow-xl shadow-saas-neon/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-saas-neon/5 blur-3xl rounded-full" />
              <div className="flex items-start gap-6 relative z-10">
                <div className="bg-saas-surface p-4 rounded-2xl shadow-xl text-saas-neon shrink-0 ring-1 ring-saas-neon/20">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Found a vulnerability?</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-sm">
                    We run a private bug bounty program. If you are a security researcher and believe you have found a vulnerability, please let us know.
                  </p>
                </div>
              </div>
              <a href="mailto:security@xentrix.com" className="shrink-0 bg-saas-neon hover:bg-saas-neonhover text-white dark:text-black font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-saas-neon/20 uppercase tracking-widest text-xs">
                Report Issue
              </a>
            </div>
          </FadeIn>
        </section>

      </main>

      <Footer />
    </div>
  );
}