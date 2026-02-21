import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { HiUser, HiClock, HiHeart, HiBookmark, HiSparkles, HiCog, HiLogout } from 'react-icons/hi';
import { useAuth } from '@/context/authContext';
import { cn } from '@/utils/helper';

interface UserMenuProps {
  isNotFoundPage?: boolean;
  showBg?: boolean;
}

const UserMenu = ({ isNotFoundPage, showBg }: UserMenuProps) => {
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  // If not logged in, show Sign In button
  if (!user && !isLoading) {
    return (
      <Link
        to="/login"
        className={cn(
          'px-5 py-2 rounded-full font-medium text-[14px] transition-all duration-200',
          'bg-white text-black hover:bg-gray-100'
        )}
      >
        Sign In
      </Link>
    );
  }

  // If loading, show nothing or a placeholder
  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
    );
  }

  // Menu items
  const menuItems = [
    { icon: HiUser, label: 'Profile', path: '/profile' },
    { icon: HiBookmark, label: 'Watchlist', path: '/watchlist' },
    { icon: HiHeart, label: 'Favorites', path: '/favorites' },
    { icon: HiSparkles, label: 'Recommendations', path: '/recommendations' },
    { icon: HiClock, label: 'History', path: '/history' },
    { icon: HiCog, label: 'Settings', path: '/settings' },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 p-1.5 rounded-full transition-all duration-200',
          'hover:bg-white/10',
          isNotFoundPage || showBg ? 'text-gray-700 dark:text-white' : 'text-white/90'
        )}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-white/20">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 dark-glass rounded-2xl overflow-hidden border border-white/10 shadow-xl"
          >
            {/* User Info */}
            <div className="p-4 border-b border-white/10">
              <p className="text-white font-semibold text-sm truncate">
                {user?.username}
              </p>
              <p className="text-gray-400 text-xs truncate mt-0.5">
                {user?.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                >
                  <item.icon className="text-[18px]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-white/10 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-gray-300 hover:text-white w-full"
              >
                <HiLogout className="text-[18px]" />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
