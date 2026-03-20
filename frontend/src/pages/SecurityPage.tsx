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
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-sans selection:bg-emerald-200">
      
      {/* Navbar Minimal */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10 w-full shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#064E3B] text-white p-1.5 rounded-lg"><LayoutDashboard size={24} fill="currentColor" /></div>
          <span className="text-xl font-black tracking-tight text-gray-900">Xentrix</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
          Back to Home <ArrowRight size={16} />
        </Link>
      </nav>

      <main className="flex-1 w-full pb-24">
        
        {/* Hero Section */}
        <section className="pt-20 pb-24 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-2xl mb-8">
              <Shield size={40} className="text-[#064E3B]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
              Enterprise-Grade Security. Built-In.
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
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
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center mb-6">
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{pillar.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{pillar.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Dark Infrastructure Section */}
        <section className="bg-[#09090B] py-24 my-12 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[200%] bg-[#064E3B]/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Secure Cloud Infrastructure</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Xentrix is hosted on Amazon Web Services (AWS), utilizing their highly secure data centers. Our architecture is designed for maximum resilience, eliminating single points of failure.
                </p>
                
                <div className="space-y-6">
                  {[
                    { title: 'Continuous Monitoring', desc: '24/7/365 automated threat detection and response systems.' },
                    { title: 'DDoS Protection', desc: 'Enterprise-grade mitigation against distributed denial-of-service attacks.' },
                    { title: 'Penetration Testing', desc: 'Annual third-party network and application penetration testing.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-[#151516] border border-gray-800 rounded-[2rem] p-8 md:p-12 shadow-2xl relative">
                {/* Decorative UI mimicking a server dashboard */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Cloud className="text-gray-500" size={20} />
                    <span className="text-gray-300 font-bold text-sm uppercase tracking-wider">System Status</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    All Systems Operational
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400 font-medium">Historical Uptime (90 Days)</span>
                      <span className="text-white font-bold">99.99%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="w-[99.99%] h-full bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase mb-1">Last Pen Test</p>
                      <p className="text-white font-bold">Oct 12, 2025</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase mb-1">Data Backups</p>
                      <p className="text-white font-bold">Every 4 Hours</p>
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
              <h2 className="text-3xl font-black text-gray-900 mb-4">Compliance & Certifications</h2>
              <p className="text-gray-500 text-lg">We adhere to the strictest global privacy and security frameworks so you can scale with confidence.</p>
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
                <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center h-full hover:border-[#064E3B] transition-colors">
                  <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                    <FileText size={28} className="text-[#064E3B]" />
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">{cert.title}</h3>
                  <p className="text-xs text-gray-500">{cert.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Bug Bounty / Contact CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <FadeIn>
            <div className="bg-emerald-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-100">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm text-yellow-600 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Found a vulnerability?</h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                    We run a private bug bounty program. If you are a security researcher and believe you have found a vulnerability, please let us know.
                  </p>
                </div>
              </div>
              <a href="mailto:security@xentrix.com" className="shrink-0 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 font-bold py-3 px-6 rounded-xl transition-all shadow-sm">
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