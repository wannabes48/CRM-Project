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
      <form onSubmit={handleSubmit}>
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

      <div className="mt-8 text-center">
        <span className="text-sm font-bold uppercase tracking-wide text-gray-500">
          Already registered?{' '}
        </span>
        <Link to="/login" className="text-sm font-bold uppercase tracking-wide hover:underline text-black border-b-2 border-black pb-1">
          Log In Here
        </Link>
      </div>
    </AuthLayout>
  );
};