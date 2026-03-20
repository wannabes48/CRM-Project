import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import Footer from '../components/layout/Footer';

export default function ContentPage() {
  const location = useLocation();
  
  // Scroll to top when navigating between legal pages
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
    title: 'Page Not Found',
    updated: '',
    body: (
      <>
        <p>The document you are looking for does not exist or has been moved.</p>
        <Link to="/" className="text-[#064E3B] font-bold hover:underline">Return to homepage</Link>
      </>
    )
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      
      {/* Minimal Navbar */}
      <nav className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-gray-100 w-full shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#064E3B] text-white p-1 rounded-lg"><LayoutDashboard size={20} /></div>
          <span className="font-black text-gray-900 tracking-tight">Xentrix</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </Link>
      </nav>

      {/* Dynamic Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{pageData.title}</h1>
        {pageData.updated && (
          <p className="text-sm text-gray-500 mb-12 font-medium">Last updated: {pageData.updated}</p>
        )}
        
        {/* Tailwind Typography 'prose' makes standard HTML look amazing */}
        <article className="prose prose-emerald prose-lg max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:font-bold prose-a:text-[#064E3B]">
          {pageData.body}
        </article>
      </main>

      <Footer />
    </div>
  );
}