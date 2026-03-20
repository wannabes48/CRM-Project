import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-white text-black selection:bg-black selection:text-white">
      {/* Left Side: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 border-r-2 border-black bg-gray-50">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">SaaS CRM.</h1>
        </div>
        <div>
          <h2 className="text-7xl font-black tracking-tighter leading-none mb-6 uppercase">
            {title}
          </h2>
          <p className="text-xl font-medium tracking-wide text-gray-500 max-w-md">
            {subtitle}
          </p>
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
          © {new Date().getFullYear()} System Architecture
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md">
          {/* Mobile Title Header */}
          <div className="lg:hidden mb-12">
            <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">SaaS CRM.</h1>
            <h2 className="text-4xl font-black tracking-tighter uppercase">{title}</h2>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};