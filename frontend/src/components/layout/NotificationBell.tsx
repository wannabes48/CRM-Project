import { useState, useRef, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-400 hover:text-saas-neon hover:bg-saas-neon/10 transition-all duration-300"
      >
        <Bell size={20} strokeWidth={2.5} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-[#09090B]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1E1E20] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
            <h3 className="font-black text-black dark:text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="text-[10px] bg-saas-neon/20 text-saas-neon px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {unreadCount} New
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-saas-neon hover:underline font-bold"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500 text-sm italic">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="text-gray-300" size={24} />
                </div>
                <p className="text-gray-500 text-sm font-medium">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative ${!notification.is_read ? 'bg-saas-neon/5 dark:bg-saas-neon/[0.02]' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notification.is_read ? 'bg-gray-300 dark:bg-gray-700' : 'bg-saas-neon shadow-[0_0_8px_rgba(178,255,77,0.5)]'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm font-bold truncate ${notification.is_read ? 'text-gray-600 dark:text-gray-400' : 'text-black dark:text-white'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-gray-400 font-medium shrink-0 whitespace-nowrap">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          {notification.link && (
                            <Link 
                              to={notification.link}
                              onClick={() => {
                                markAsRead(notification.id);
                                setIsOpen(false);
                              }}
                              className="text-[10px] bg-saas-neon text-black font-black px-2 py-1 rounded-md uppercase tracking-tighter flex items-center gap-1 hover:scale-105 transition-transform"
                            >
                              View <ExternalLink size={10} strokeWidth={3} />
                            </Link>
                          )}
                          {!notification.is_read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="text-[10px] text-saas-neon font-black uppercase tracking-tighter flex items-center gap-0.5 hover:underline"
                            >
                              <Check size={10} strokeWidth={3} /> Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
            <button className="w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-saas-neon font-bold transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
