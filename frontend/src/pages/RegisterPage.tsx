import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
    const { register } = useAuth();
  const [tenantName, setTenantName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // TODO: Replace with your actual register function from useAuth()
      await register({ 
        tenantName:tenantName, 
        username:username, 
        email:email, 
        password:password 
    });
      console.log('Registering payload:', { tenantName, username, email, password });
      
      // Mock success and redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">SaaS CRM.</h1>
        <p className="text-gray-500 mb-10 text-sm uppercase tracking-wide font-semibold">
          Initialize your workspace
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 border-2 border-red-500 bg-red-50 text-red-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
              className="w-full border-2 border-black p-3 text-sm font-semibold focus:outline-none focus:ring-0 placeholder:text-gray-400"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Admin Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border-2 border-black p-3 text-sm font-semibold focus:outline-none focus:ring-0 placeholder:text-gray-400"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-black p-3 text-sm font-semibold focus:outline-none focus:ring-0 placeholder:text-gray-400"
              placeholder="hello@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Secure Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-black p-3 text-sm font-semibold focus:outline-none focus:ring-0 placeholder:text-gray-400"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 font-bold uppercase tracking-wide text-sm border-2 border-black hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating...' : 'Create Workspace'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-black underline hover:no-underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}