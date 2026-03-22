import React from 'react';
import { Hexagon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex bg-saas-bg transition-colors duration-700 overflow-hidden">
      {/* Left Side: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 border-r border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-saas-bg/50 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-saas-neon text-black p-2.5 rounded-xl shadow-lg shadow-saas-neon/20">
              <Hexagon size={24} fill="currentColor" strokeWidth={0} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none">Xentrix<span className="text-saas-neon">.CRM</span></h1>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-10 bg-saas-neon rounded-full"></div>
            <h2 className="text-7xl font-black tracking-tighter leading-none dark:text-white uppercase">
              {title}
            </h2>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 max-w-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          © {new Date().getFullYear()} Unified Intelligence Systems
        </div>

        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-saas-neon/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-right-8 duration-700">
          {/* Mobile Title Header */}
          <div className="lg:hidden mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-saas-neon text-black p-2 rounded-lg">
                <Hexagon size={20} fill="currentColor" strokeWidth={0} />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Xentrix<span className="text-saas-neon">.CRM</span></h1>
            </div>
            <div className="mt-8">
               <h2 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none">{title}</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-4">{subtitle}</p>
            </div>
          </div>
          
          <div className="bg-white/40 dark:bg-saas-surface/40 backdrop-blur-2xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 md:p-10 shadow-xl shadow-black/5">
             {children}
          </div>
        </div>

        {/* Decorative background element for right side */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-saas-neon/5 blur-[100px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};