import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight mb-8">Settings</h1>

      {/* Profile */}
      <section className="border-2 border-black p-6 mb-6">
        <h2 className="font-black text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
          <User size={16} /> Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs font-bold uppercase text-gray-500">Username</span>
            <p className="font-semibold mt-1">{user?.username}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-gray-500">Email</span>
            <p className="font-semibold mt-1">{user?.email}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-gray-500">Role</span>
            <p className="font-semibold mt-1">
              <span className="inline-block px-2 py-0.5 bg-black text-white text-xs font-bold uppercase">
                {user?.role}
              </span>
            </p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-gray-500">Workspace</span>
            <p className="font-semibold mt-1">{user?.tenant_name}</p>
          </div>
        </div>
      </section>

      {/* Billing */}
      {user?.role === 'Admin' && (
        <section className="border-2 border-black p-6 mb-6">
          <h2 className="font-black text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <CreditCard size={16} /> Billing
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Manage your subscription and payment methods through the Stripe customer portal.
          </p>
          <button
            className="bg-black text-white px-4 py-2 font-bold uppercase text-xs tracking-wide border-2 border-black hover:bg-white hover:text-black transition-colors opacity-50 cursor-not-allowed"
            disabled
            title="Stripe integration pending — add API keys to enable"
          >
            Manage Subscription
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Stripe API keys required. Add them to your <code>.env</code> file to enable billing.
          </p>
        </section>
      )}

      {/* Logout */}
      <section className="border-2 border-red-500 p-6">
        <h2 className="font-black text-sm uppercase tracking-wide mb-4 text-red-600 flex items-center gap-2">
          <LogOut size={16} /> Sign Out
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          End your session and return to the login page.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 font-bold uppercase text-xs tracking-wide border-2 border-red-600 hover:bg-white hover:text-red-600 transition-colors"
        >
          Sign Out
        </button>
      </section>
    </div>
  );
}
