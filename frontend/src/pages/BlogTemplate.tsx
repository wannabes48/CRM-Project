import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

export default function BlogTemplate() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-200 pb-24">
      {/* Minimal Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link to="/" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Article Meta */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm mb-4">
            <span className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Sales Strategy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            The Ultimate Guide to Automating Your Sales Pipeline in 2026
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2"><User size={16} /> Sarah Jenkins</div>
            <div className="flex items-center gap-2"><Calendar size={16} /> Oct 24, 2026</div>
            <div className="flex items-center gap-2"><Clock size={16} /> 5 min read</div>
          </div>
        </div>

        {/* Hero Image */}
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Data charts" 
          className="w-full aspect-video object-cover rounded-3xl mb-12 shadow-md border border-gray-100"
        />

        {/* The Magic 'Prose' Wrapper */}
        <article className="prose prose-lg prose-emerald max-w-none prose-headings:font-black prose-a:font-bold prose-img:rounded-2xl">
          <p>The modern sales landscape is shifting rapidly. If your sales representatives are spending more than 20% of their day doing manual data entry, your company is losing revenue to competitors who have embraced automation.</p>
          
          <h2>Why Automation is No Longer Optional</h2>
          <p>In the past, a CRM was just a digital rolodex. Today, tools like <strong>Xentrix CRM</strong> act as an invisible assistant, automatically logging calls, scoring leads, and moving prospects through the kanban board based on their engagement.</p>
          
          <blockquote>
            "Implementing workflow automation reduced our sales cycle by 14 days and increased our win rate by 22%." — ACME Corp
          </blockquote>

          <h3>Three Steps to Pipeline Mastery</h3>
          <ul>
            <li><strong>Automate Lead Capture:</strong> Connect your website forms directly to your CRM API.</li>
            <li><strong>Set Up Triggered Emails:</strong> When a deal hits the "Proposal Sent" stage, queue up a 3-day follow-up reminder.</li>
            <li><strong>Use Smart Routing:</strong> Assign high-value leads to your senior reps automatically based on company size.</li>
          </ul>

          <p>By removing the friction from your team's day-to-day operations, they can focus on what they do best: building relationships and closing deals.</p>
        </article>
      </main>
    </div>
  );
}