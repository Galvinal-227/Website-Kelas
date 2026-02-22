import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Image, 
  Mail, 
  School,
  Sparkles,
  LogIn,
  LogOut,
  UserPlus,
  MessageCircle,
  User,
  ChevronRight,
  Shield,
  Crown,
  HelpCircle
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);
  const { currentUser, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { 
      name: 'Beranda', 
      path: '/home', 
      icon: <Home className="w-4 h-4" />,
      color: 'from-orange-500 to-amber-500'
    },
    { 
      name: 'Anggota', 
      path: '/anggota', 
      icon: <Users className="w-4 h-4" />,
      color: 'from-orange-500 to-amber-500'
    },
    { 
      name: 'About', 
      path: '/about', 
      icon: <Sparkles className="w-4 h-4" />,
      color: 'from-orange-500 to-amber-500'
    },
    { 
      name: 'Galeri', 
      path: '/galeri', 
      icon: <Image className="w-4 h-4" />,
      color: 'from-orange-500 to-amber-500'
    },
    { 
      name: 'Kontak', 
      path: '/kontak', 
      icon: <Mail className="w-4 h-4" />,
      color: 'from-orange-500 to-amber-500'
    },
    { 
      name: 'Help', 
      path: '/help', 
      icon: <HelpCircle className="w-4 h-4" />,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  const UserProfileButton = () => {
    const userInitial = currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U';
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

    return (
      <div 
        className="relative"
        ref={userMenuRef}
      >
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="relative group flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg
            bg-gradient-to-br from-gray-800/80 to-gray-900/80 
            border border-gray-700/50 hover:border-gray-600/50
            backdrop-blur-sm transition-all duration-200"
        >
          {/* Avatar dengan badge admin */}
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 
              flex items-center justify-center text-xs font-bold text-white shadow-md">
              {userInitial.toUpperCase()}
            </div>
            
            {/* Badge admin kecil */}
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-red-600 to-orange-600 
                border border-gray-900 flex items-center justify-center">
                <Crown size={8} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-300 group-hover:text-white hidden sm:block">
                {userName}
              </span>
              
              {/* Badge admin di samping nama */}
              {isAdmin && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] rounded-full">
                  <Shield size={8} />
                  <span>Admin</span>
                </span>
              )}
            </div>
            
            {/* Email kecil di bawah nama */}
            <span className="text-[10px] text-gray-500 hidden sm:block">
              {currentUser?.email?.split('@')[0]}@...
            </span>
          </div>
          
          <ChevronRight 
            size={14} 
            className={`text-gray-500 transition-transform duration-200 ${
              showUserMenu ? 'rotate-90' : ''
            }`}
          />
        </button>

        {/* User Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute top-full right-0 mt-2 min-w-[200px] z-50">
            <div className="bg-gradient-to-b from-gray-900/95 to-gray-950/95 
              border border-gray-800/50 rounded-lg backdrop-blur-md shadow-xl 
              overflow-hidden py-1">
              
              {/* User Info */}
              <div className="px-3 py-2 border-b border-gray-800/50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 
                      flex items-center justify-center text-xs font-bold text-white">
                      {userInitial.toUpperCase()}
                    </div>
                    {isAdmin && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-red-600 to-orange-600 
                        border border-gray-900 flex items-center justify-center">
                        <Crown size={8} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white truncate">
                      {currentUser?.displayName || 'User'}
                    </p>
                    <div className="flex items-center gap-1">
                      {isAdmin && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-red-600/80 to-orange-600/80 
                          text-white text-[10px] rounded-full">
                          <Shield size={8} />
                          <span>Administrator</span>
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">
                        {currentUser?.email?.split('@')[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  to={isAdmin ? "/admin-profile" : "/profile"}
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 
                    hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  {isAdmin ? 'Profil Admin' : 'Profil Saya'}
                </Link>
                
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-orange-300 
                      hover:text-orange-200 hover:bg-orange-900/20 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Dashboard Admin
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-300 
                    hover:text-rose-200 hover:bg-rose-900/20 transition-colors mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const LoginButton = () => {
    return (
      <div className="flex items-center gap-2">
        <Link 
          to="/login"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-gradient-to-br from-orange-600/90 to-amber-600/90 
            hover:from-orange-500 hover:to-amber-500
            border border-orange-500/50 hover:border-orange-400/50
            text-sm text-white font-medium
            backdrop-blur-sm transition-all duration-200
            shadow-lg shadow-orange-500/20"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Masuk</span>
        </Link>
      </div>
    );
  };

  const NavButton = ({ item, isActive }) => {
    return (
      <Link
        to={item.path}
        className="relative group"
      >
        <div
          className={clsx(
            "relative rounded-lg px-3 py-2",
            "border border-gray-800/50",
            "bg-gradient-to-br from-gray-900/80 to-gray-950/80",
            "backdrop-blur-sm",
            "transition-all duration-200",
            "flex items-center gap-2",
            "min-w-[80px]",
            isActive 
              ? `bg-gradient-to-br ${item.color} text-white shadow-lg`
              : "text-gray-300 hover:text-white hover:border-gray-700/50"
          )}
        >
          {/* Active indicator */}
          {isActive && (
            <div 
              className="absolute -inset-0.5 rounded-lg bg-gradient-to-br opacity-30"
              style={{ background: item.color.replace('from-', '').replace('to-', '') }}
            />
          )}
          
          {/* Icon */}
          <div className={clsx(
            "relative z-10",
            isActive ? "text-white" : "text-gray-400 group-hover:text-white"
          )}>
            {item.icon}
          </div>
          
          {/* Text */}
          <span className="relative z-10 font-medium text-xs">
            {item.name}
          </span>
        </div>
      </Link>
    );
  };

  const MobileNavItem = ({ item, isActive }) => {
    return (
      <Link
        to={item.path}
        className="block"
        onClick={() => setIsOpen(false)}
      >
        <div
          className={clsx(
            "relative rounded-lg px-4 py-3 mx-2 my-1",
            "border border-gray-800/50",
            "bg-gradient-to-br from-gray-900/90 to-gray-950/90",
            "transition-all duration-200",
            "flex items-center gap-3",
            isActive 
              ? `bg-gradient-to-br ${item.color} text-white`
              : "text-gray-300 active:bg-gray-800/50"
          )}
        >
          {/* Icon */}
          <div className={clsx(
            isActive ? "text-white" : "text-gray-400"
          )}>
            {item.icon}
          </div>
          
          {/* Text */}
          <span className="font-medium text-sm flex-1">
            {item.name}
          </span>
          
          {/* Admin badge untuk mobile */}
          {item.name === 'Admin' && isAdmin && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-red-600 to-orange-600 
              text-white text-[10px] rounded-full">
              <Shield size={8} />
            </span>
          )}
          
          {/* Active indicator */}
          {isActive && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      </Link>
    );
  };

  const MobileAuthButtons = () => {
    return (
      <div className="px-2 py-3 border-t border-gray-800/50 mt-2">
        {currentUser ? (
          <div className="space-y-2">
            {/* User info mobile */}
            <div className="px-3 py-2 rounded-lg bg-gradient-to-br from-gray-800/80 
              to-gray-900/80 border border-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 
                    flex items-center justify-center text-xs font-bold text-white">
                    {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                  </div>
                  {isAdmin && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-red-600 to-orange-600 
                      border border-gray-900 flex items-center justify-center">
                      <Crown size={8} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {currentUser?.displayName || currentUser?.email}
                  </p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-red-600/80 to-orange-600/80 
                      text-white text-[10px] rounded-full">
                      <Shield size={8} />
                      <span>Admin</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Admin menu mobile */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg 
                  bg-gradient-to-br from-red-700/90 to-orange-700/90 
                  border border-red-600/50 text-sm text-white"
              >
                <Shield className="w-4 h-4" />
                Dashboard Admin
              </Link>
            )}
            
            {/* Profile link */}
            <Link
              to={isAdmin ? "/admin-profile" : "/profile"}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg 
                bg-gradient-to-br from-gray-800/80 to-gray-900/80 
                border border-gray-700/50 text-sm text-gray-300 hover:text-white"
            >
              <User className="w-4 h-4" />
              {isAdmin ? 'Profil Admin' : 'Profil Saya'}
            </Link>
            
            {/* Logout button */}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg 
                bg-gradient-to-br from-rose-700/90 to-rose-800/90 
                border border-rose-600/50 text-sm text-white"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/signup"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                bg-gradient-to-br from-gray-800/80 to-gray-900/80 
                border border-gray-700/50 text-sm text-gray-300 hover:text-white"
            >
              <UserPlus className="w-4 h-4" />
              Daftar
            </Link>
            
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                bg-gradient-to-br from-orange-600/90 to-amber-600/90 
                border border-orange-500/50 text-sm text-white font-medium"
            >
              <LogIn className="w-4 h-4" />
              Masuk
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav 
      ref={menuRef}
      className={clsx(
        "fixed w-full z-50 transition-all duration-300",
        scrolled 
          ? 'bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-md border-b border-gray-800/30 shadow-lg py-0' 
          : 'bg-gradient-to-b from-gray-900/90 to-transparent backdrop-blur-sm py-2'
      )}
    >
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-14">
          {/* Logo - Compact */}
          <Link 
            to="/home" 
            className="flex items-center gap-2 group"
          >
            {/* Logo icon */}
            <div className="relative">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 
                  flex items-center justify-center shadow-lg shadow-orange-500/20 
                  border border-orange-500/30">
                  <School className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Logo text */}
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-base font-bold bg-gradient-to-r from-orange-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                  XI PPLG 1
                </h1>
                {isAdmin && (
                  <span className="ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-red-600 to-orange-600 
                    text-white text-[10px] rounded-full">
                    <Shield size={8} />
                    <span>Admin</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                SMKN 2 Nganjuk
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Compact */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.name} className="relative">
                  <NavButton item={item} isActive={isActive} />
                </div>
              );
            })}
            
            {/* Auth Buttons */}
            <div className="ml-2">
              {currentUser ? <UserProfileButton /> : <LoginButton />}
            </div>
          </div>

          {/* Mobile Menu Button - Compact */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg group relative"
            aria-label="Toggle menu"
          >
            <div className="relative">
              {isOpen ? (
                <X className="w-5 h-5 text-orange-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-400 group-hover:text-orange-400" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile Navigation - Compact */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-1">
            <div className="bg-gradient-to-b from-gray-900/95 to-gray-950/95 border border-gray-800/50 
              rounded-lg backdrop-blur-md shadow-xl overflow-hidden">
              <div className="p-2">
                <div className="space-y-0">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <div key={item.name}>
                        <MobileNavItem item={item} isActive={isActive} />
                      </div>
                    );
                  })}
                </div>
                
                {/* Mobile Auth Section */}
                <MobileAuthButtons />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />
      )}
    </nav>
  );
};

export default Navbar;