import React, { type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react';

// --- Input Component ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const AuthInput: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="flex flex-col space-y-2 mb-8 group">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-[1.25rem] py-4 px-6 text-xs font-bold outline-none focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/10 text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 shadow-sm"
    />
  </div>
);

// --- Button Component ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AuthButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full bg-saas-neon hover:scale-[1.02] active:scale-95 text-black font-black py-5 rounded-[1.25rem] transition-all shadow-2xl shadow-saas-neon/20 uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:hover:scale-100"
  >
    {children}
  </button>
);