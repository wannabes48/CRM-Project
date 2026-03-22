import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Zap, Heart, Globe, Briefcase, ChevronRight } from 'lucide-react';

const BENEFITS = [
  { icon: <Globe size={24} />, title: 'Remote-First', desc: 'Work from anywhere. We care about output, not office hours.' },
  { icon: <Heart size={24} />, title: 'Health & Wellness', desc: 'Premium medical, dental, and mental health coverage.' },
  { icon: <Zap size={24} />, title: 'Continuous Learning', desc: '$2,000 annual stipend for courses, books, and conferences.' },
  { icon: <Users size={24} />, title: 'Team Retreats', desc: 'Bi-annual all-expenses-paid trips to connect in person.' },
];

const JOBS = [
  { id: 1, title: 'Senior Full Stack Engineer', dept: 'Engineering', location: 'Remote (Americas)', type: 'Full-time' },
  { id: 2, title: 'Product Designer', dept: 'Design', location: 'Remote (Global)', type: 'Full-time' },
  { id: 3, title: 'Account Executive', dept: 'Sales', location: 'New York, NY', type: 'Full-time' },
  { id: 4, title: 'Developer Advocate', dept: 'Marketing', location: 'Remote (Europe)', type: 'Full-time' },
  { id: 5, title: 'Customer Success Manager', dept: 'Support', location: 'Remote (US)', type: 'Full-time' },
];

export default function CareersPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const departments = ['All', 'Engineering', 'Design', 'Sales', 'Marketing', 'Support'];

  const filteredJobs = activeFilter === 'All' ? JOBS : JOBS.filter(job => job.dept === activeFilter);

  return (
    <div className="min-h-screen bg-saas-bg font-sans pb-24 text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-saas-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Xentrix<span className="text-saas-neon">.</span>
          </Link>
          <Link to="/" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-saas-neon transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-20 animate-in fade-in duration-700">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Help us build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-saas-neon dark:from-saas-neon dark:to-emerald-400">future of sales.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We are a team of builders, designers, and dreamers on a mission to make CRM software fast, beautiful, and intuitive.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-32">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why join Xentrix?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, i) => (
              <div key={i} className="bg-saas-surface border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-saas-neon transition-colors shadow-sm">
                <div className="text-saas-neon mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Open Positions</h2>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setActiveFilter(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    activeFilter === dept 
                      ? 'bg-saas-neon text-white dark:text-black shadow-lg shadow-saas-neon/20' 
                      : 'bg-saas-surface text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:text-saas-neon hover:border-saas-neon/50'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <Link to={`/careers/${job.id}`} key={job.id} className="block group">
                  <div className="bg-saas-surface border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group-hover:border-saas-neon transition-all hover:shadow-xl hover:shadow-saas-neon/5 transition-all">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-saas-neon transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5"><Briefcase size={16} /> {job.dept}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Clock size={16} /> {job.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end">
                      <span className="text-sm font-bold text-gray-700 dark:text-white group-hover:mr-2 transition-all">Apply Now</span>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-saas-neon transition-colors" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-20 bg-saas-surface border border-gray-200 dark:border-gray-800 border-dashed rounded-2xl">
                <Briefcase size={40} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No open roles in {activeFilter}</h3>
                <p className="text-gray-500">Check back later or send an open application to jobs@xentrix.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}