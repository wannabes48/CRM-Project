import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Moon, Sun, Globe, Search, Menu, LayoutDashboard, Users, Briefcase, Ticket as TicketIcon, Phone, Settings, HelpCircle, CalendarIcon, BarChart3, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import LogoutConfirmModal from '../modals/LogoutConfirmModal';

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
        {/* Workspace Brand / User */}
        <div className={`flex items-center gap-4 mb-10 group cursor-pointer ${!isLeftSidebarOpen && 'justify-center'}`}>
          <div className="w-10 h-10 rounded-2xl bg-saas-neon shadow-[0_0_20px_rgba(178,255,77,0.4)] shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
             <div className="w-4 h-4 rounded-full bg-black/20 animate-pulse"></div>
          </div>
          {isLeftSidebarOpen && (
            <div className="truncate animate-in fade-in slide-in-from-left-2 duration-500">
              <p className="text-sm font-black text-gray-900 dark:text-white truncate tracking-tight uppercase leading-tight">
                {user?.username || 'Loading...'}
              </p>
              <div className="flex items-center gap-1.5 overflow-hidden">
                <div className="w-1 h-1 rounded-full bg-saas-neon shrink-0"></div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 truncate uppercase tracking-widest">
                  {user?.tenant_name || 'Workspace'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Global Search Component */}
        {isLeftSidebarOpen ? (
          <div className="relative mb-10 group" ref={searchRef}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className={`transition-colors duration-300 ${isSearching ? 'text-saas-neon animate-pulse' : 'text-gray-400 group-focus-within:text-saas-neon'}`} size={16} />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowDropdown(true)}
              placeholder="Global Search..." 
              className="w-full bg-gray-50 dark:bg-saas-surface text-gray-900 dark:text-white rounded-[1.25rem] py-3.5 pl-12 pr-4 text-xs font-bold outline-none border border-transparent focus:border-saas-neon/30 focus:ring-4 focus:ring-saas-neon/5 transition-all placeholder:text-gray-400 placeholder:font-medium shadow-sm"
            />
            
            {/* SEARCH RESULTS DROPDOWN */}
            {showDropdown && (
              <div className="absolute top-full left-0 w-[calc(100%+4rem)] -ml-8 mt-4 bg-white dark:bg-saas-surface border border-gray-100 dark:border-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
                <div className="max-h-[32rem] overflow-y-auto custom-scrollbar p-3">
                  
                  {isSearching && (
                    <div className="p-8 flex justify-center">
                      <div className="w-6 h-6 border-2 border-saas-neon border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {!isSearching && (
                    <div className="space-y-1">
                      {/* Contacts Section */}
                      {searchResults.contacts.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-3 py-2">People & Contacts</p>
                          {searchResults.contacts.map((c: any) => (
                            <div key={c.id} className="group p-3 hover:bg-saas-bg dark:hover:bg-saas-surfacehover rounded-2xl cursor-pointer transition-all flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:text-saas-neon group-hover:bg-saas-neon/10 transition-colors">
                                {c.name.split(' ').map((n: any) => n[0]).join('')}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-black text-gray-900 dark:text-white truncate">{c.name}</p>
                                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate">{c.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Deals Section */}
                      {searchResults.deals.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-3 py-2">Active Deals</p>
                          {searchResults.deals.map((d: any) => (
                            <div key={d.id} className="group p-3 hover:bg-saas-bg dark:hover:bg-saas-surfacehover rounded-2xl cursor-pointer transition-all flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-saas-neon/10 flex items-center justify-center text-saas-neon group-hover:scale-110 transition-transform">
                                <Briefcase size={14} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-black text-saas-neon truncate">{d.name}</p>
                                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate tracking-tight">{d.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tickets Section */}
                      {searchResults.tickets.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-3 py-2">Support Tickets</p>
                          {searchResults.tickets.map((t: any) => (
                            <div key={t.id} className="group p-3 hover:bg-saas-bg dark:hover:bg-saas-surfacehover rounded-2xl cursor-pointer transition-all flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <TicketIcon size={14} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-black text-gray-900 dark:text-white truncate">{t.name}</p>
                                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate">{t.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isSearching && searchResults.contacts.length === 0 && searchResults.deals.length === 0 && searchResults.tickets.length === 0 && (
                         <div className="py-12 px-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mx-auto text-gray-300 dark:text-gray-700">
                               <Search size={24} />
                            </div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No results for "{searchQuery}"</p>
                         </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 text-[9px] font-black uppercase text-gray-400 tracking-widest text-center">
                  Press enter to see all results
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-10 p-3.5 rounded-2xl bg-gray-50 dark:bg-saas-surface text-gray-400 cursor-pointer hover:text-saas-neon hover:shadow-lg transition-all" onClick={() => setIsLeftSidebarOpen(true)}>
            <Search size={20} />
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
          {isLeftSidebarOpen && <div className="mb-4 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] ml-2">Main Menu</div>}
          <nav className="space-y-1.5 mb-10 w-full">
            <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" isOpen={isLeftSidebarOpen} />
            <NavItem to="/contacts" icon={<Users size={18} />} label="Directory" isOpen={isLeftSidebarOpen} />
            <NavItem to="/pipeline" icon={<Briefcase size={18} />} label="Pipeline" isOpen={isLeftSidebarOpen} />
            <NavItem to="/tickets" icon={<TicketIcon size={18} />} label="Support" isOpen={isLeftSidebarOpen} />
            <NavItem to="/calendar" icon={<CalendarIcon size={18} />} label="Calendar" isOpen={isLeftSidebarOpen} />
            <NavItem to="/reports" icon={<BarChart3 size={18} />} label="Analytics" isOpen={isLeftSidebarOpen} />
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800/50">
            {isLeftSidebarOpen && <div className="mb-4 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] ml-2">System</div>}
            <nav className="space-y-1.5">
              <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" isOpen={isLeftSidebarOpen} />
              <button 
                onClick={() => setIsLogoutModalOpen(true)} 
                className={`w-full flex items-center p-3.5 rounded-2xl cursor-pointer transition-all duration-300 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-black group ${!isLeftSidebarOpen && 'justify-center mb-4'}`}
              >
                <div className="shrink-0 transition-transform group-hover:rotate-12 duration-300"><LogOut size={18} /></div>
                {isLeftSidebarOpen && <span className="ml-4 text-xs uppercase tracking-widest font-black">Log Out</span>}
              </button>
            </nav>
          </div>
        </div>
      </aside>

      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={async () => {
          setIsLoggingOut(true);
          await logout();
          setIsLoggingOut(false);
          setIsLogoutModalOpen(false);
        }}
        loading={isLoggingOut}
      />

      {/* CENTER MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-saas-bg transition-colors duration-500">
        
        {/* Top Header */}
        <header className="flex justify-between items-center px-10 py-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-saas-bg/80 backdrop-blur-md shrink-0 z-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} 
              className="p-3 rounded-xl bg-gray-50 dark:bg-saas-surface border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-saas-neon hover:border-saas-neon/30 transition-all shadow-sm active:scale-95"
            >
              <Menu size={20} strokeWidth={2.5} />
            </button>
            <div className="hidden lg:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Workspace</span> 
              <span className="text-gray-300 dark:text-gray-700 font-light">/</span> 
              <span className="text-gray-900 dark:text-white">{pageTitle}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            {/* App Logic / Utilities */}
            <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-saas-surface rounded-2xl border border-gray-100 dark:border-gray-800">
               <Globe size={16} className="text-gray-400 hover:text-saas-neon cursor-pointer transition-colors" />
               <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
               <HelpCircle size={16} className="text-gray-400 hover:text-saas-neon cursor-pointer transition-colors" />
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme} 
                className="p-3 rounded-2xl bg-saas-surface dark:bg-saas-surface border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-saas-neon hover:border-saas-neon/30 transition-all shadow-sm group active:scale-95"
              >
                {theme === 'dark' 
                  ? <Sun size={20} className="group-hover:rotate-45 transition-transform duration-500" /> 
                  : <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-500" />
                }
              </button>
              <NotificationBell />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content Area */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar-premium">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet /> 
          </div>
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
      className={({ isActive }) => `flex items-center p-3.5 rounded-2xl cursor-pointer transition-all duration-300 group ${
        isActive 
          ? 'bg-saas-neon text-black font-black shadow-2xl shadow-saas-neon/20 ring-1 ring-white/20' 
          : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-saas-surfacehover font-black'
      } ${!isOpen && 'justify-center'}`}
    >
      <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'group-hover:scale-110' : ''}`}>{icon}</div>
      {isOpen && <span className="ml-4 text-xs uppercase tracking-widest font-black leading-none">{label}</span>}
    </NavLink>
  );
}