import React, { type InputHTMLAttributes, type ButtonHTMLAttributes } from 'react';

// --- Input Component ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const AuthInput: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="flex flex-col space-y-2 mb-6">
    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
      {label}
    </label>
    <input
      {...props}
      className="border-2 border-black p-4 text-lg font-medium outline-none transition-all focus:bg-black focus:text-white placeholder:text-gray-300"
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
    className="w-full bg-black text-white border-2 border-black p-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);