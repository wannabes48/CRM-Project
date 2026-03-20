import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft, Target, Users, Zap, Globe, Heart, Shield } from 'lucide-react';
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-emerald-200">
      
      {/* Navbar Minimal */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#064E3B] text-white p-1.5 rounded-lg"><LayoutDashboard size={24} fill="currentColor" /></div>
          <span className="text-xl font-black tracking-tight text-gray-900">Xentrix</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
          Back to Home <ArrowLeft size={16} />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                We're building the operating system for modern sales.
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed">
                Founded in 2024, Xentrix started with a simple belief: CRMs should work for your sales team, not the other way around. 
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                alt="Xentrix Team Collaborating" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/80 to-transparent flex items-end p-8 md:p-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                  {[
                    { label: 'Founded', val: '2024' },
                    { label: 'Employees', val: '150+' },
                    { label: 'Customers', val: '30,000+' },
                    { label: 'Global Offices', val: '4' },
                  ].map((stat, i) => (
                    <div key={i} className="text-white">
                      <p className="text-3xl font-black mb-1">{stat.val}</p>
                      <p className="text-sm text-gray-300 font-medium uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* The Mission & Story */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <h2 className="text-3xl font-black text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg prose-emerald text-gray-500">
              <p>
                Before Xentrix, our founders were sales directors frustrated by legacy systems. They were spending more time updating spreadsheets and logging calls than actually speaking with customers.
              </p>
              <p>
                We realized that the world didn't need just another database; it needed an intelligent assistant. A platform that automates the mundane, highlights the important, and gets out of the way.
              </p>
              <p>
                Today, Xentrix processes over $2 Billion in pipeline value every month, helping thousands of businesses scale their revenue without scaling their headcount.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Office" className="rounded-2xl shadow-sm h-64 object-cover w-full" />
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Meeting" className="rounded-2xl shadow-sm h-64 object-cover w-full mt-8" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-gray-500">The principles that guide every feature we build and every hire we make.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Heart size={24} />, title: 'Customer Obsession', desc: 'We succeed only when our users succeed. Every decision starts with the customer and works backwards.' },
              { icon: <Zap size={24} />, title: 'Speed is a Feature', desc: 'In sales, timing is everything. We engineer our platform to be blisteringly fast and highly responsive.' },
              { icon: <Shield size={24} />, title: 'Uncompromising Trust', desc: 'Your data is your business. We treat security and privacy as absolute, non-negotiable fundamentals.' },
            ].map((value, idx) => (
              <FadeIn key={idx} delay={idx * 100}>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-full hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-50 text-[#064E3B] rounded-xl flex items-center justify-center mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{value.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Meet the Leadership</h2>
              <p className="text-gray-500">The team driving the vision behind Xentrix.</p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Sarah Jenkins', role: 'Chief Executive Officer', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'David Chen', role: 'Chief Technology Officer', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'Marcus Johnson', role: 'Head of Product', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
              { name: 'Elena Rodriguez', role: 'VP of Customer Success', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
            ].map((member, idx) => (
              <FadeIn key={idx} delay={idx * 100}>
                <div className="group text-center">
                  <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-[#064E3B] font-medium mt-1">{member.role}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl font-black text-gray-900 mb-6">Ready to join the revolution?</h2>
            <p className="text-xl text-gray-500 mb-10">
              Stop fighting your CRM. Start selling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg text-lg">
                Start your free trial
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold py-4 px-8 rounded-xl transition-all shadow-sm text-lg">
                View Pricing
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}