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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-gray-500 mb-8">Choose the perfect plan for your business. No hidden fees.</p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 bg-gray-200/50 border border-gray-200 rounded-xl relative">
            <button 
              onClick={() => setAnnual(false)}
              className={`relative z-10 px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${!annual ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Monthly billing
            </button>
            <button 
              onClick={() => setAnnual(true)}
              className={`relative z-10 px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${annual ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Annual billing <span className="ml-1 text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {plans.map((plan, i) => (
            <div key={i} className={`relative bg-white rounded-3xl p-8 border ${plan.popular ? 'border-[#064E3B] shadow-2xl scale-105 z-10' : 'border-gray-200 shadow-sm'}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#064E3B] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${plan.popular ? 'bg-emerald-50' : 'bg-gray-50'}`}>{plan.icon}</div>
                <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6 h-10">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-black text-gray-900">${annual ? plan.annual : plan.monthly}</span>
                <span className="text-gray-500 font-medium">/mo</span>
                {annual && plan.monthly > 0 && <p className="text-xs text-emerald-600 font-bold mt-1">Billed ${plan.annual * 12} yearly</p>}
              </div>

              <button 
                onClick={() => handleCheckout(plan.name)} // 3. Attach the function here
                disabled={loadingPlan === plan.name}
                className={`w-full block text-center font-bold py-3 rounded-xl transition-all mb-8 ${plan.popular ? 'bg-[#064E3B] hover:bg-[#043d2e] text-white shadow-lg' : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'}`}
                >
                {loadingPlan === plan.name ? 'Connecting...' : plan.btnText}
              </button>

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">What's included</p>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
                {plan.missing.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                    <X size={18} className="text-gray-300 shrink-0" />
                    <span>{feat}</span>
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