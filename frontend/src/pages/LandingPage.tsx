import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Star, CheckCircle2, Zap, BarChart3, Cloud, LayoutDashboard,
    ShieldCheck, Activity, Menu, X, Twitter, Linkedin, Github, ArrowRight
} from 'lucide-react';

// --- Custom Scroll Reveal Component ---
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
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default function LandingPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isMobileMenuOpen]);

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 selection:bg-emerald-200">

            {/* Top Announcement Banner */}
            <div className="bg-[#064E3B] text-emerald-50 py-2 text-center text-xs font-medium tracking-wide">
                <span className="bg-emerald-500/20 px-2 py-0.5 rounded-full mr-2 text-[10px] uppercase font-bold">New</span>
                CRM Update 2026: Discover new AI innovations and strategies to elevate your business.
            </div>

            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between bg-transparent relative z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-[#064E3B] text-white p-1.5 rounded-lg">
                        <LayoutDashboard size={24} fill="currentColor" />
                    </div>
                    <span className="text-xl font-black tracking-tight">Xentrix</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
                    <Link to="/about" className="hover:text-black transition-colors">
                        About
                    </Link>
                    <a href="#features" className="hover:text-black transition-colors">Features</a>
                    <Link to="/pricing" className="hover:text-black transition-colors">
                        Pricing
                    </Link>
                    <Link to="/contact" className="hover:text-black transition-colors">
                        Contact
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-black transition-colors px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-xl bg-white shadow-sm">
                        Log In
                    </Link>
                    <Link to="/register" className="text-sm font-bold text-white bg-[#064E3B] hover:bg-[#043d2e] px-5 py-2.5 rounded-xl transition-all shadow-md">
                        Sign Up
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:text-black transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-6 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col gap-6 text-2xl font-black tracking-tight mb-12">
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                        About
                    </Link>
                    <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                    <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)}>
                        Pricing
                    </Link>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                        Contact
                    </Link>
                </div>
                <div className="flex flex-col gap-4 mt-auto mb-12">
                    <Link to="/login" className="text-center font-bold text-gray-900 border-2 border-gray-200 py-4 rounded-2xl">Log In</Link>
                    <Link to="/register" className="text-center font-bold text-white bg-[#064E3B] py-4 rounded-2xl">Get Started Free</Link>
                </div>
            </div>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 grid lg:grid-cols-2 gap-16 items-center">
                <FadeIn>
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-bold">
                            <CheckCircle2 size={16} /> Seamless Integration
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-gray-900">
                            Boost Efficiency, Automate Workflows.
                        </h1>

                        <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                            Xentrix CRM empowers businesses with cutting-edge technology to streamline operations, enhance customer relationships, and maximize revenue.
                        </p>

                        <div className="flex items-center gap-4">
                            <Link to="/register" className="bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2">
                                Get Started
                            </Link>
                            <a href="#features" className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm">
                                Learn More
                            </a>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    <span className="text-gray-900 font-black text-sm ml-2">4.8</span>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">From 500+ reviews</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={200}>
                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square">
                        <div className="absolute inset-0 bg-[#E8F0EE] rounded-[2rem] transform rotate-3 scale-105 origin-bottom-left -z-10"></div>
                        <img
                            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Professional working on laptop"
                            className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
                        />

                        {/* Floating Card 1 */}
                        <div className="absolute top-8 -left-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 hidden sm:block animate-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full border-4 border-[#064E3B] border-r-transparent animate-spin-slow"></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Revenue</p>
                                    <p className="text-xl font-black text-gray-900">$35,750.00</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-gray-400">From last month</span>
                                <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">↑ 15%</span>
                            </div>
                        </div>

                        {/* Floating Card 2 */}
                        <div className="absolute bottom-12 -right-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 hidden sm:block animate-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Customers</p>
                                <p className="text-3xl font-black text-gray-900 mb-2">4,669</p>
                                <div className="flex items-center text-xs font-bold gap-2">
                                    <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">↑ 28%</span>
                                    <span className="text-gray-400">From last month</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Logos Section */}
            <section className="border-y border-gray-200 bg-white overflow-hidden">
                <FadeIn delay={100}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <p className="text-sm font-bold text-gray-500 shrink-0">Our Supported Partners</p>
                        <div className="flex flex-wrap justify-center gap-12 text-2xl font-black text-gray-400">
                            <span className="hover:text-[#FF9900] transition-colors cursor-pointer">amazon</span>
                            <span className="hover:text-[#4A154B] transition-colors cursor-pointer flex items-center gap-1"><span className="text-3xl">#</span>slack</span>
                            <span className="hover:text-[#0061FF] transition-colors cursor-pointer flex items-center gap-1"><Cloud size={24} /> Dropbox</span>
                            <span className="hover:text-[#95BF47] transition-colors cursor-pointer flex items-center gap-1"><Activity size={24} /> shopify</span>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Features Grid */}
            <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <FadeIn>
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Smart Automation, Limitless Possibilities</h2>
                        <p className="text-gray-500 text-lg">With Xentrix, you get a powerful automation platform designed to optimize your workflow and scale your business effortlessly.</p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <BarChart3 size={20} />, title: 'AI-Powered Insights', desc: 'Make data-driven decisions with real-time analytics.', color: 'bg-emerald-100 text-[#064E3B]', delay: 0 },
                        { icon: <Zap size={20} />, title: 'Workflow Automation', desc: 'Streamline repetitive tasks and boost efficiency.', color: 'bg-[#064E3B] text-white', delay: 100 },
                        { icon: <Activity size={20} />, title: 'Omni-Channel Marketing', desc: 'Engage your audience across multiple platforms seamlessly.', color: 'bg-emerald-100 text-[#064E3B]', delay: 200 },
                        { icon: <ShieldCheck size={20} />, title: 'Secure Cloud Integration', desc: 'Sync and access your data anytime, anywhere.', color: 'bg-[#064E3B] text-white', delay: 300 },
                    ].map((feat, idx) => (
                        <FadeIn key={idx} delay={feat.delay}>
                            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feat.color}`}>
                                    {feat.icon}
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-2">{feat.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* Detailed Split Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
                <FadeIn>
                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square">
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Data analysis"
                            className="w-full h-full object-cover rounded-[2rem] shadow-xl"
                        />
                        <div className="absolute top-1/4 -left-4 sm:-left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-64">
                            <h4 className="text-sm font-bold text-gray-900 mb-4">Sales Performance Overview</h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'New Leads', val: '75.2%', w: 'w-3/4', color: 'bg-[#064E3B]' },
                                    { label: 'Qualified', val: '56.7%', w: 'w-1/2', color: 'bg-emerald-500' },
                                    { label: 'Proposal', val: '48.6%', w: 'w-5/12', color: 'bg-emerald-300' },
                                    { label: 'Closed', val: '39.1%', w: 'w-1/3', color: 'bg-gray-300' },
                                ].map((bar, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 w-20">{bar.label}</span>
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full mx-3 overflow-hidden">
                                            <div className={`h-full ${bar.color} ${bar.w} rounded-full`}></div>
                                        </div>
                                        <span className="font-bold text-gray-900 w-10 text-right">{bar.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={200}>
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Customer-Driven Solutions with Xentrix</h2>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            At Xentrix, we focus on delivering tailored solutions that meet your customers' needs. With advanced technology and AI-powered CRM systems, we help businesses build stronger customer relationships.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['Personalized Engagement', 'Seamless Integration', 'Smart Data Analytics', '24/7 Customer Support'].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <CheckCircle2 size={18} className="text-[#064E3B]" /> {item}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-gray-200">
                            <div>
                                <p className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">200+</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Business Partners</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">30K+</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Satisfied Customers</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">10+</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Years Excellence</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Robust Footer */}
            <footer className="bg-[#09090B] text-white pt-20 pb-10 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                            {/* Brand & Newsletter */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="bg-saas-neon text-black p-1.5 rounded-lg">
                                        <LayoutDashboard size={20} fill="currentColor" />
                                    </div>
                                    <span className="text-xl font-black tracking-tight">Xentrix</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-6 max-w-sm">
                                    The modern CRM designed to help fast-growing teams automate workflows, close deals faster, and scale effortlessly.
                                </p>
                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Subscribe to our newsletter</p>
                                    <div className="flex gap-2 max-w-sm">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="bg-[#151516] border border-gray-800 rounded-xl py-2 px-4 text-sm w-full outline-none focus:border-saas-neon transition-colors text-white"
                                        />
                                        <button className="bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Links */}
                            <div>
                                <h4 className="text-white font-bold mb-6">Product</h4>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li><a href="/#features" className="hover:text-saas-neon transition-colors">Features</a></li>
                                    <li><a href="/integrations" className="hover:text-saas-neon transition-colors">Integrations</a></li>
                                    <li><a href="/pricing" className="hover:text-saas-neon transition-colors">Pricing</a></li>
                                    <li><a href="/changelog" className="hover:text-saas-neon transition-colors">Changelog</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6">Company</h4>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li><a href="/about" className="hover:text-saas-neon transition-colors">About Us</a></li>
                                    <li><a href="/careers" className="hover:text-saas-neon transition-colors">Careers</a></li>
                                    <li><a href="/blog/sales-automation" className="hover:text-saas-neon transition-colors">Blog</a></li>
                                    <li><a href="/contact" className="hover:text-saas-neon transition-colors">Contact</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6">Legal</h4>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li><a href="/privacy" className="hover:text-saas-neon transition-colors">Privacy Policy</a></li>
                                    <li><a href="/terms" className="hover:text-saas-neon transition-colors">Terms of Service</a></li>
                                    <li><a href="/cookie" className="hover:text-saas-neon transition-colors">Cookie Policy</a></li>
                                    <li><a href="/security" className="hover:text-saas-neon transition-colors">Security</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800 gap-4">
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} Xentrix CRM. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-sm">
                                <a href="https://github.com/wannabes48" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">A CRAFT OF SIRO PRODUCTION</a>
                            </p>
                            <div className="flex items-center gap-4 text-gray-500">
                                <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                                <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
                                <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </footer>

        </div>
    );
}