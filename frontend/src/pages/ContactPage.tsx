import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft, Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-emerald-200 pb-24">
      
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Contact Information */}
        <div className="space-y-12">
          <FadeIn>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">Let's talk about your pipeline.</h1>
              <p className="text-lg text-gray-500 leading-relaxed max-w-md">
                Whether you have a question about features, pricing, or custom enterprise integrations, our team is ready to answer all your questions.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="space-y-6">
              {/* Contact Cards */}
              <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 text-[#064E3B] p-3 rounded-xl shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-sm text-gray-500 mb-2">Our friendly team is here to help.</p>
                  <a href="mailto:hello@xentrix.com" className="text-sm font-bold text-[#064E3B] hover:underline">hello@xentrix.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 text-[#064E3B] p-3 rounded-xl shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Call Us</h3>
                  <p className="text-sm text-gray-500 mb-2">Mon-Fri from 8am to 5pm.</p>
                  <a href="tel:+18001234567" className="text-sm font-bold text-[#064E3B] hover:underline">+1 (800) 123-4567</a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 text-[#064E3B] p-3 rounded-xl shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Office</h3>
                  <p className="text-sm text-gray-500 mb-2">Come say hello at our HQ.</p>
                  <p className="text-sm font-bold text-[#064E3B]">100 Innovation Drive<br/>San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right Side: The Form */}
        <FadeIn delay={200}>
          <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-2xl relative overflow-hidden">
            
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-[#064E3B]" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500">Thanks for reaching out. One of our account executives will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 animate-in fade-in">
                    Something went wrong. Please try again later.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#064E3B] focus:bg-white transition-all text-gray-900"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#064E3B] focus:bg-white transition-all text-gray-900"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Work Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#064E3B] focus:bg-white transition-all text-gray-900"
                    placeholder="jane@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</label>
                  <select 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#064E3B] focus:bg-white transition-all text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a topic...</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#064E3B] focus:bg-white transition-all text-gray-900 resize-none"
                    placeholder="How can we help your team?"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {status === 'submitting' ? <Loader2 className="animate-spin" size={20} /> : (
                    <>Send Message <Send size={18} /></>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  By submitting this form, you agree to our <Link to="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </div>
        </FadeIn>
        
      </main>
      <Footer />
    </div>
  );
}