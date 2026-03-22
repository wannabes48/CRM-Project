import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Clock, ArrowRight } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    title: "10 Workflows to Automate Your Sales Pipeline in 2026",
    excerpt: "Stop wasting time on manual data entry. Learn how top-performing teams are using automation to close deals 40% faster.",
    category: "Sales Strategy",
    date: "Mar 18, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    featured: true
  },
  {
    id: 2,
    title: "How to Build a Customer-Centric Support Team",
    excerpt: "The secret to reducing churn isn't a new feature, it's how you talk to your customers when things break.",
    category: "Customer Success",
    date: "Mar 12, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    featured: false
  },
  {
    id: 3,
    title: "Introducing Xentrix AI: Smart Forecasting",
    excerpt: "Our latest release brings predictive analytics right into your dashboard. Here is how to set it up.",
    category: "Product Updates",
    date: "Mar 05, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    featured: false
  },
  {
    id: 4,
    title: "Why We Chose React and Django for Enterprise SaaS",
    excerpt: "A deep dive into the technical architecture that allows Xentrix to scale seamlessly for thousands of users.",
    category: "Engineering",
    date: "Feb 28, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    featured: false
  }
];

export default function BlogPage() {
  const featuredPost = POSTS.find(post => post.featured);
  const regularPosts = POSTS.filter(post => !post.featured);

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

      <div className="max-w-7xl mx-auto px-6 pt-16 animate-in fade-in duration-700">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-2">The Xentrix Blog</h1>
            <p className="text-gray-600 dark:text-gray-400">Insights, updates, and strategies for modern teams.</p>
          </div>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 dark:text-white outline-none focus:border-saas-neon transition-colors"
            />
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Link to={`/blog/${featuredPost.id}`} className="group block mb-16">
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 aspect-[2/1] md:aspect-[3/1]">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent dark:from-[#09090B] dark:via-[#09090B]/80 dark:to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3">
                <span className="inline-block px-3 py-1 bg-saas-neon/10 border border-saas-neon/20 text-saas-neon text-xs font-bold rounded-full mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-saas-neon transition-colors drop-shadow-lg">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-100 dark:text-gray-300 text-lg mb-6 line-clamp-2 md:line-clamp-none drop-shadow-md">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-200 dark:text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5"><Calendar size={16} /> {featuredPost.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={16} /> {featuredPost.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Recent Posts Grid */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Latest Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {regularPosts.map(post => (
            <Link to={`/blog/${post.id}`} key={post.id} className="group flex flex-col h-full">
              <div className="relative rounded-2xl overflow-hidden mb-4 aspect-video border border-gray-200 dark:border-gray-800">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-saas-neon text-xs font-bold mb-2 uppercase tracking-wider">{post.category}</span>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-saas-neon transition-colors line-clamp-2">
                {post.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 font-medium mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saas-neon/5 blur-[100px] rounded-full pointer-events-none" />
          
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 relative z-10">Get sales insights delivered weekly.</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
            Join 10,000+ modern revenue teams who read our newsletter for the latest strategies, templates, and tech.
          </p>
          
          <form className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto relative z-10" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your work email" 
              required
              className="flex-1 bg-saas-bg border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-sm text-gray-900 dark:text-white outline-none focus:border-saas-neon transition-colors"
            />
            <button 
              type="submit"
              className="bg-saas-neon hover:bg-saas-neonhover text-white dark:text-black font-black py-3 px-6 rounded-xl transition-all shadow-lg shadow-saas-neon/20 flex items-center justify-center gap-2"
            >
              Subscribe <ArrowRight size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}