import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight, Twitter, Github, Linkedin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-saas-bg text-gray-900 dark:text-white pt-20 pb-10 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-saas-neon text-white dark:text-black p-1.5 rounded-lg shadow-lg shadow-saas-neon/20">
                <LayoutDashboard size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Xentrix</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-sm leading-relaxed">
              The modern CRM designed to help fast-growing teams automate workflows, close deals faster, and scale effortlessly.
            </p>
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Subscribe to our newsletter</p>
              <form className="flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email" 
                  className="bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-xl py-2 px-4 text-sm w-full outline-none focus:border-saas-neon transition-colors text-gray-900 dark:text-white"
                />
                <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-colors shrink-0">
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Links: Product */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/#features" className="hover:text-saas-neon transition-colors">Features</Link></li>
              <li><Link to="/integrations" className="hover:text-saas-neon transition-colors">Integrations</Link></li>
              <li><Link to="/pricing" className="hover:text-saas-neon transition-colors">Pricing</Link></li>
              <li><Link to="/blog" className="hover:text-saas-neon transition-colors">Changelog</Link></li>
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/about" className="hover:text-saas-neon transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-saas-neon transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-saas-neon transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-saas-neon transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/privacy" className="hover:text-saas-neon transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-saas-neon transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-saas-neon transition-colors">Cookie Policy</Link></li>
              <li><Link to="/security" className="hover:text-saas-neon transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800 gap-4">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} Xentrix CRM. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs font-bold tracking-widest">
             <a href="https://github.com/wannabes48" target="_blank" rel="noreferrer" className="hover:text-saas-neon transition-colors">A CRAFT OF SIRO PRODUCTION</a>
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="https://danielsiroportfolio.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-saas-neon transition-colors">
              <Globe size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-saas-neon transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://github.com/wannabes48" target="_blank" rel="noreferrer" className="hover:text-saas-neon transition-colors">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-saas-neon transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>

  );
}