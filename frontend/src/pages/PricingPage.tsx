import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, X, Zap, Building, LayoutDashboard, ArrowLeft } from 'lucide-react';
import Footer from '../components/layout/Footer';
import api, { useAuth } from '../contexts/AuthContext';

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { user } = useAuth(); 
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      desc: 'Perfect for small teams getting started.',
      monthly: 0,
      annual: 0,
      icon: <LayoutDashboard className="text-gray-400" size={24} />,
      btnText: 'Start for Free',
      features: ['Up to 1,000 Contacts', 'Basic Kanban Pipeline', 'Standard Support', '1 Workspace'],
      missing: ['Custom Integrations', 'Advanced Analytics', 'Role-Based Access']
    },
    {
      name: 'Professional',
      desc: 'Everything you need to scale your sales.',
      monthly: 49,
      annual: 39,
      icon: <Zap className="text-[#064E3B]" size={24} />,
      popular: true,
      btnText: 'Start 14-Day Trial',
      features: ['Up to 10,000 Contacts', 'Unlimited Pipelines', 'Priority Email Support', 'Up to 5 Workspaces', 'Advanced Analytics', 'Role-Based Access'],
      missing: ['Custom Integrations']
    },
    {
      name: 'Enterprise',
      desc: 'Advanced security and custom workflows.',
      monthly: 129,
      annual: 99,
      icon: <Building className="text-purple-500" size={24} />,
      btnText: 'Contact Sales',
      features: ['Unlimited Contacts', 'Unlimited Pipelines', '24/7 Phone Support', 'Unlimited Workspaces', 'Custom Analytics & BI', 'Custom Integrations', 'Dedicated Success Manager'],
      missing: []
    }
  ];

  // 2. Add the Checkout function
  const handleCheckout = async (planName: string) => {

    if (!user) {
      navigate('/register');
      return; 
    }

    setLoadingPlan(planName);
    try {
      // Send the request to Django
      const res = await api.post('create-checkout-session/', { 
        plan: planName.toLowerCase(), 
        is_annual: annual 
      });
      
      // Stripe returns a secure URL. We redirect the user's browser there immediately.
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Failed to start checkout", err);
      alert("Something went wrong with the checkout process.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-saas-bg font-sans selection:bg-saas-neon/30 text-gray-900 dark:text-gray-100 pb-24">
      
      {/* Navbar Minimal */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-saas-neon text-white dark:text-black p-1.5 rounded-lg shadow-lg shadow-saas-neon/20">
            <LayoutDashboard size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Xentrix</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-saas-neon transition-colors flex items-center gap-2">
          Back to Home <ArrowLeft size={16} />
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 lowercase">Simple, transparent pricing<span className="text-saas-neon">.</span></h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Choose the perfect plan for your business. No hidden fees.</p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-2xl relative shadow-sm">
            <button 
              onClick={() => setAnnual(false)}
              className={`relative z-10 px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${!annual ? 'text-gray-900 dark:text-white shadow-xl bg-white dark:bg-saas-bg' : 'text-gray-500 hover:text-saas-neon'}`}
            >
              Monthly billing
            </button>
            <button 
              onClick={() => setAnnual(true)}
              className={`relative z-10 px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${annual ? 'text-gray-900 dark:text-white shadow-xl bg-white dark:bg-saas-bg' : 'text-gray-500 hover:text-saas-neon'}`}
            >
              Annual billing <span className="ml-2 text-saas-neon bg-saas-neon/10 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-black ring-1 ring-saas-neon/30">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {plans.map((plan, i) => (
            <div key={i} className={`relative bg-saas-surface rounded-[2.5rem] p-8 md:p-10 border transition-all duration-500 hover:shadow-2xl ${plan.popular ? 'border-saas-neon shadow-2xl scale-105 z-10 bg-white dark:bg-saas-bg' : 'border-gray-100 dark:border-gray-800 shadow-sm hover:border-saas-neon/50'}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-saas-neon text-white dark:text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-2xl ${plan.popular ? 'bg-saas-neon/10 text-saas-neon' : 'bg-saas-bg text-gray-400'}`}>{plan.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{plan.name}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 h-10 leading-relaxed font-medium">{plan.desc}</p>
              
              <div className="mb-10">
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">${annual ? plan.annual : plan.monthly}</span>
                <span className="text-gray-400 font-bold ml-1">/month</span>
                {annual && plan.monthly > 0 && <p className="text-xs text-saas-neon font-black mt-2 uppercase tracking-widest">Billed ${plan.annual * 12} yearly</p>}
              </div>

              <button 
                onClick={() => handleCheckout(plan.name)}
                disabled={loadingPlan === plan.name}
                className={`w-full block text-center font-black py-4 rounded-2xl transition-all mb-10 text-sm tracking-wide ${plan.popular ? 'bg-saas-neon hover:bg-saas-neonhover text-white dark:text-black shadow-xl shadow-saas-neon/20' : 'bg-saas-bg hover:bg-saas-surface text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800'}`}
                >
                {loadingPlan === plan.name ? 'Connecting...' : plan.btnText}
              </button>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">What's included</p>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <CheckCircle2 size={18} className="text-saas-neon shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
                {plan.missing.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-gray-400 dark:text-gray-600 font-medium">
                    <X size={18} className="text-gray-200 dark:text-gray-800 shrink-0" />
                    <span className="line-through decoration-1 opacity-50">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}