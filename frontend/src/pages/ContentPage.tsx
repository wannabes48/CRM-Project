import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function ContentPage() {
  const location = useLocation();
  
  // A simple dictionary mapping URLs to their content. 
  // In a real app, you might fetch this from a CMS (like Sanity or Contentful)
  const contentMap: Record<string, { title: string, updated: string, body: React.ReactNode }> = {
    '/privacy': {
      title: 'Privacy Policy',
      updated: 'October 1, 2025',
      body: (
        <>
          <p>At Xentrix, we take your privacy seriously. This policy describes how we collect, use, and protect your personal data when you use our CRM platform.</p>
          <h2>1. Data Collection</h2>
          <p>We collect information you provide directly to us, such as when you create a workspace, add contacts, or submit a support ticket.</p>
        </>
      )
    },
    '/terms': {
      title: 'Terms of Service',
      updated: 'September 15, 2025',
      body: (
        <>
          <p>By accessing or using Xentrix CRM, you agree to be bound by these Terms of Service.</p>
          <h2>1. Workspace Rules</h2>
          <p>You are responsible for all activity that occurs within your assigned Workspace.</p>
        </>
      )
    }
    // Add more routes here...
  };

  const pageData = contentMap[location.pathname] || {
    title: 'Page Not Found',
    updated: '',
    body: <p>The content you are looking for does not exist.</p>
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#064E3B] text-white p-1 rounded"><LayoutDashboard size={20} /></div>
          <span className="font-black text-gray-900">Xentrix</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black text-gray-900 mb-2">{pageData.title}</h1>
        {pageData.updated && <p className="text-sm text-gray-500 mb-12">Last updated: {pageData.updated}</p>}
        
        <article className="prose prose-emerald max-w-none">
          {pageData.body}
        </article>
      </main>
    </div>
  );
}