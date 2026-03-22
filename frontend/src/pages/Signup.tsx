import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { AuthInput, AuthButton } from '../components/ui/AuthElements';

export const Signup: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Stripe checkout & API integration goes here
    console.log('Registering tenant:', { companyName, email, password });
  };

  return (
    <AuthLayout 
      title="Start Building." 
      subtitle="Initialize your workspace and start managing your customer relationships today."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Company / Workspace Name"
          type="text"
          placeholder="Acme Corp"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />

        <AuthInput
          label="Admin Email"
          type="email"
          placeholder="admin@acmecorp.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <AuthInput
          label="Secure Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <AuthButton type="submit">Initialize Workspace</AuthButton>
      </form>

      <div className="mt-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
          Already part of a team?
        </p>
        <Link to="/login" className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white hover:text-saas-neon underline underline-offset-8 decoration-gray-100 dark:decoration-gray-800 hover:decoration-saas-neon transition-all">
          Authorize Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Signup;