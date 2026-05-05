import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, History, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { user, profile, logout, login } = useAuth();
  const { items } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center border-b border-black/5 bg-white/50 dark:bg-stone-dark/50 backdrop-blur-md transition-colors duration-300 dark:border-white/10">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A1A1A] dark:bg-stone-cream rounded-full flex items-center justify-center text-white dark:text-stone-dark font-display italic text-xl">G</div>
          <span className="text-xl font-light tracking-widest uppercase hidden sm:block dark:text-stone-cream">Shree Ganesh <span className="font-bold">Marbles</span></span>
        </Link>

        <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-dark/60 dark:text-stone-cream/60">
          <Link to="/" className="hover:text-stone-dark dark:hover:text-stone-cream transition-colors">Home</Link>
          <Link to="/products" className="hover:text-stone-dark dark:hover:text-stone-cream transition-colors">Collections</Link>
          <Link to="/contact" className="hover:text-stone-dark dark:hover:text-stone-cream transition-colors">Contact</Link>
          {profile?.role === 'admin' && <Link to="/admin" className="hover:text-stone-dark transition-colors text-stone-accent">Admin</Link>}
        </div>

        <div className="flex items-center space-x-6">
          <button 
            onClick={toggleTheme}
            className="p-2 text-stone-dark/60 hover:text-stone-dark transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10 dark:text-stone-cream/60 dark:hover:text-stone-cream"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <Link to="/cart" className="relative text-stone-dark/60 hover:text-stone-dark transition-colors dark:text-stone-cream/60 dark:hover:text-stone-cream">
            <ShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-stone-accent text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/account" className="text-stone-dark/60 hover:text-stone-dark transition-colors flex items-center gap-2 dark:text-stone-cream/60 dark:hover:text-stone-cream">
                <User size={18} />
                <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-widest italic">{profile?.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-widest text-stone-dark/30 hover:text-red-500 transition-colors dark:text-stone-cream/30 dark:hover:text-red-400">
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="btn-outline px-6 py-2.5 !text-[9px] dark:border-stone-cream/20 dark:text-stone-cream dark:hover:bg-stone-cream dark:hover:text-stone-dark"
            >
              Sign In
            </Link>
          )}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-stone-dark dark:text-stone-cream">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>


      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/products" className="block text-lg font-medium text-slate-900">Stones</Link>
              <Link to="/applications" className="block text-lg font-medium text-slate-900">Applications</Link>
              <Link to="/contact" className="block text-lg font-medium text-slate-900">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
