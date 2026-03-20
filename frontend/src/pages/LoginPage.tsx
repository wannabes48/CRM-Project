import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
    } catch (err: any) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">SaaS CRM.</h1>
        <p className="text-gray-500 mb-10 text-sm uppercase tracking-wide font-semibold">
          Sign in to your workspace
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 border-2 border-red-500 bg-red-50 text-red-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-saas-surface text-black dark:text-white p-3 text-sm font-semibold focus:outline-none focus:border-saas-neon placeholder:text-gray-400 transition-colors"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-saas-surface text-black dark:text-white p-3 text-sm font-semibold focus:outline-none focus:border-saas-neon placeholder:text-gray-400 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 font-bold uppercase tracking-wide text-sm border-2 border-black hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-black underline hover:no-underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
