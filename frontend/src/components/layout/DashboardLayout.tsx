import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Moon, Sun, Globe, Search, Menu, LayoutDashboard, Users, Briefcase, Ticket as TicketIcon, Phone, Settings, HelpCircle, CalendarIcon, BarChart3, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../contexts/AuthContext';
import NotificationBell from './NotificationBell';

export default function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  
  const location = useLocation();
  const pathTitles: Record<string, string> = {
    '/dashboard': 'Overview',
    '/contacts': 'Directory',
    '/pipeline': 'Pipeline',
    '/tickets': 'Support',
    '/calendar': 'Calendar',
    '/reports': 'Reports',
    '/settings': 'Settings',
  };
  const pageTitle = pathTitles[location.pathname] || 'Dashboard';

  // --- NEW SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({ contacts: [], deals: [], tickets: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API Call
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const response = await api.get(`search/?q=${searchQuery}`);
          setSearchResults(response.data);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowDropdown(false);
        setSearchResults({ contacts: [], deals: [], tickets: [] });
      }
    }, 300); // Waits 300ms after the user stops typing before calling the API

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-saas-bg transition-colors duration-300">
      
      {/* LEFT SIDEBAR */}
      <aside className={`border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-saas-bg flex flex-col py-6 shrink-0 z-20 transition-all duration-300 ${isLeftSidebarOpen ? 'w-64 px-6' : 'w-20 px-4 items-center'}`}>
        <div className={`flex items-center gap-3 mb-8 ${!isLeftSidebarOpen && 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-saas-neon shadow-[0_0_10px_rgba(178,255,77,0.5)] shrink-0"></div>
          {isLeftSidebarOpen && (
            <div className="truncate">
              <p className="text-sm font-bold text-black dark:text-white truncate">
                {user?.username || 'Loading...'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.tenant_name || 'Workspace'}
              </p>
            </div>
          )}
        </div>

        {isLeftSidebarOpen ? (
          <div className="relative mb-8" ref={searchRef}>
            <Search className={`absolute left-3 top-2.5 ${isSearching ? 'text-saas-neon animate-pulse' : 'text-gray-400'}`} size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowDropdown(true)}
              placeholder="Global Search..." 
              className="w-full bg-gray-100 dark:bg-saas-surface text-black dark:text-white rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-saas-neon transition-all"
            />
            
            {/* FLOATING DROPDOWN RESULTS */}
            {showDropdown && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-saas-surface border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                  
                  {/* Contacts Results */}
                  {searchResults.contacts.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">Contacts</p>
                      {searchResults.contacts.map((c: any) => (
                        <div key={c.id} className="p-2 hover:bg-gray-50 dark:hover:bg-saas-surfacehover rounded-lg cursor-pointer transition-colors">
                          <p className="text-sm font-bold text-black dark:text-white truncate">{c.name}</p>
                          <p className="text-xs text-gray-500 truncate">{c.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Deals Results */}
                  {searchResults.deals.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">Deals</p>
                      {searchResults.deals.map((d: any) => (
                        <div key={d.id} className="p-2 hover:bg-gray-50 dark:hover:bg-saas-surfacehover rounded-lg cursor-pointer transition-colors">
                          <p className="text-sm font-bold text-saas-neon truncate">{d.name}</p>
                          <p className="text-xs text-gray-500 truncate">{d.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tickets Results */}
                  {searchResults.tickets.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">Tickets</p>
                      {searchResults.tickets.map((t: any) => (
                        <div key={t.id} className="p-2 hover:bg-gray-50 dark:hover:bg-saas-surfacehover rounded-lg cursor-pointer transition-colors">
                          <p className="text-sm font-bold text-black dark:text-white truncate">{t.name}</p>
                          <p className="text-xs text-gray-500 truncate">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Results State */}
                  {!isSearching && searchResults.contacts.length === 0 && searchResults.deals.length === 0 && searchResults.tickets.length === 0 && (
                     <div className="p-4 text-center text-xs text-gray-500">No results found for "{searchQuery}"</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 p-2 rounded-lg bg-gray-100 dark:bg-saas-surface text-gray-400 cursor-pointer hover:text-saas-neon" onClick={() => setIsLeftSidebarOpen(true)}>
            <Search size={20} />
          </div>
        )}

        {isLeftSidebarOpen && <div className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Dashboard</div>}
        <nav className="space-y-2 mb-8 w-full">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" isOpen={isLeftSidebarOpen} />
          <NavItem to="/contacts" icon={<Users size={20} />} label="Directory" isOpen={isLeftSidebarOpen} />
          <NavItem to="/pipeline" icon={<Briefcase size={20} />} label="Pipeline" isOpen={isLeftSidebarOpen} />
          <NavItem to="/tickets" icon={<TicketIcon size={20} />} label="Support" isOpen={isLeftSidebarOpen} />
          <NavItem to="/calendar" icon={<CalendarIcon size={20} />} label="Calendar" isOpen={isLeftSidebarOpen} />
          <NavItem to="/reports" icon={<BarChart3 size={20} />} label="Reports" isOpen={isLeftSidebarOpen} />
        </nav>

        <div className="mt-auto w-full">
          {isLeftSidebarOpen && <div className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Settings</div>}
          <nav className="space-y-2">
            <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" isOpen={isLeftSidebarOpen} />
            <button onClick={logout} className={`w-full flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium ${!isLeftSidebarOpen && 'justify-center'}`}>
              <div className="shrink-0"><LogOut size={20} /></div>
              {isLeftSidebarOpen && <span className="ml-3 text-sm">Log Out</span>}
            </button>
          </nav>
        </div>
      </aside>

      {/* CENTER MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="flex justify-between items-center p-4 md:px-8 md:py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-saas-bg shrink-0">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-saas-surface text-gray-400 hover:text-saas-neon transition-colors">
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <span>Workspace</span> <span className="text-gray-300 dark:text-gray-600">/</span> <span className="text-black dark:text-white font-medium">{pageTitle}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-saas-surface text-gray-400 hover:text-saas-neon transition-all">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <NotificationBell />
            <Globe size={20} className="text-gray-400 hover:text-saas-neon cursor-pointer hidden sm:block" />
          </div>
        </header>

        {/* Dynamic Page Content (This injects DashboardPage.tsx) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet /> 
        </main>
      </div>

    </div>
  );
}

// NavItem Helper Component
function NavItem({ to, icon, label, isOpen }: any) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-saas-neon text-black font-bold shadow-[0_0_15px_rgba(178,255,77,0.3)]' 
          : 'text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-saas-surfacehover font-medium'
      } ${!isOpen && 'justify-center'}`}
    >
      <div className="shrink-0">{icon}</div>
      {isOpen && <span className="ml-3 text-sm">{label}</span>}
    </NavLink>
  );
}