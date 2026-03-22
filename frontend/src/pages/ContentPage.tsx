import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Hexagon } from 'lucide-react';
import Footer from '../components/layout/Footer';

export default function ContentPage() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const contentMap: Record<string, { title: string, updated: string, body: React.ReactNode }> = {
    '/privacy': {
      title: 'Privacy Policy',
      updated: 'October 1, 2025',
      body: (
        <>
          <p className="lead">At Xentrix CRM, we take your privacy seriously. This policy describes how we collect, use, and protect your personal data when you use our platform and services.</p>
          
          <h2>1. Information We Collect</h2>
          <p>We collect information to provide better services to all our users. The types of information we collect include:</p>
          <ul>
            <li><strong>Account Information:</strong> When you register for an account, we collect your name, email address, password, and company details.</li>
            <li><strong>Customer Data:</strong> Data you upload into the CRM, including your clients' contact details, sales pipelines, and communication history. <em>We do not sell this data.</em></li>
            <li><strong>Usage Data:</strong> Information about how you use our application, including log data, device information, and IP addresses.</li>
          </ul>

          <h2>2. How We Use Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>To provide, maintain, and improve our CRM platform.</li>
            <li>To process transactions and send related information, including confirmations and invoices.</li>
            <li>To send you technical notices, updates, security alerts, and support messages.</li>
            <li>To respond to your comments, questions, and requests.</li>
          </ul>

          <h2>3. Data Security and Retention</h2>
          <p>We implement enterprise-grade security measures, including AES-256 encryption at rest and TLS 1.3 in transit, to protect your personal information. We retain your data only for as long as necessary to provide our services and fulfill the purposes outlined in this policy.</p>

          <h2>4. Your Rights (GDPR & CCPA)</h2>
          <p>Depending on your location, you may have the right to access, correct, or delete your personal data. You can exercise these rights directly through your Account Settings or by contacting our Data Protection Officer at <code>privacy@xentrix.com</code>.</p>
        </>
      )
    },
    '/terms': {
      title: 'Terms of Service',
      updated: 'September 15, 2025',
      body: (
        <>
          <p className="lead">By accessing or using the Xentrix CRM platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          
          <h2>1. Account Registration and Security</h2>
          <p>To use certain features of the Service, you must register for an account. You agree to:</p>
          <ol>
            <li>Provide accurate, current, and complete information during the registration process.</li>
            <li>Maintain and promptly update your account information.</li>
            <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
            <li>Immediately notify us if you discover or suspect any security breaches related to the Service.</li>
          </ol>

          <h2>2. Acceptable Use Policy</h2>
          <p>You agree not to use the Service in any way that is unlawful, illegal, or unauthorized. You shall not:</p>
          <ul>
            <li>Upload or transmit viruses, malware, or any other malicious code.</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts.</li>
            <li>Use the CRM to send unsolicited spam or violate anti-spam laws (e.g., CAN-SPAM, GDPR).</li>
            <li>Resell or lease the Service without explicit written permission from Xentrix.</li>
          </ul>

          <h2>3. Payment and Subscription</h2>
          <p>Xentrix is a subscription-based service. By selecting a premium plan, you agree to pay the applicable recurring fees. Subscriptions automatically renew unless canceled prior to the end of the current billing cycle. All payments are non-refundable, except as expressly provided in these Terms.</p>

          <h2>4. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Xentrix shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
        </>
      )
    },
    '/cookie-policy': {
      title: 'Cookie Policy',
      updated: 'August 10, 2025',
      body: (
        <>
          <p className="lead">This Cookie Policy explains how Xentrix uses cookies and similar technologies to recognize you when you visit our application.</p>
          <h2>What are cookies?</h2>
          <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. We use essential cookies to maintain your login session and secure your account, and analytical cookies to understand how our application is being used so we can improve the user experience.</p>
          <p>You have the right to decide whether to accept or reject non-essential cookies through your browser settings.</p>
        </>
      )
    }
  };

  const pageData = contentMap[location.pathname] || {
    title: 'Document Not Found',
    updated: '',
    body: (
      <div className="py-20 text-center">
        <p className="text-gray-500 font-bold uppercase tracking-widest mb-8">The requested document could not be located on the Xentrix Edge Network.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-saas-neon px-6 py-3 rounded-xl text-black font-black uppercase text-[10px] tracking-widest shadow-xl shadow-saas-neon/20 hover:scale-105 active:scale-95 transition-all">
          <ArrowLeft size={14} strokeWidth={3} /> Standard Protocol Recovery
        </Link>
      </div>
    )
  };

  return (
    <div className="flex flex-col min-h-screen bg-saas-bg transition-colors duration-700">
      
      {/* Premium Compact Navbar */}
      <nav className="w-full h-24 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-saas-bg/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-saas-neon text-black p-2 rounded-xl shadow-xl shadow-saas-neon/20 group-hover:rotate-12 transition-transform duration-500">
               <Hexagon size={20} fill="currentColor" strokeWidth={0} />
            </div>
            <span className="font-black text-gray-900 dark:text-white tracking-tighter uppercase text-xl">Xentrix</span>
          </Link>
          <Link to="/" className="text-[10px] font-black text-gray-400 dark:text-gray-500 hover:text-saas-neon transition-all flex items-center gap-3 uppercase tracking-[0.2em] group">
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-saas-surface border border-transparent group-hover:border-saas-neon/20 group-hover:scale-110 transition-all shadow-sm">
               <ArrowLeft size={14} strokeWidth={3} />
            </div>
            Universal Back
          </Link>
        </div>
      </nav>

      {/* Structured Legal Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-1.5 h-8 bg-saas-neon rounded-full"></div>
             <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">{pageData.title}.</h1>
          </div>
          {pageData.updated && (
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] ml-5">Protocol Revision: {pageData.updated}</p>
          )}
        </div>
        
        <article className="prose prose-emerald dark:prose-invert prose-lg max-w-none 
          prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-p:text-gray-500 dark:prose-p:text-gray-400 prose-p:font-medium prose-p:leading-loose
          prose-li:text-gray-500 dark:prose-li:text-gray-400 prose-li:font-medium
          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-black
          prose-code:text-saas-neon prose-code:bg-saas-neon/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none
          prose-a:text-saas-neon prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-8
          prose-lead:text-xl prose-lead:font-black prose-lead:text-gray-900 dark:prose-lead:text-white prose-lead:tracking-tight prose-lead:mb-12
        ">
          {pageData.body}
        </article>
      </main>

      <Footer />
    </div>
  );
}