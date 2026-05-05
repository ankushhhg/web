import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, History, MapPin, Package, LogOut, ChevronRight, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
  const { user, profile, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-stone-dark border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-stone-bg flex flex-col items-center justify-center pt-20 px-6">
        <div className="w-16 h-16 bg-stone-border rounded-full flex items-center justify-center mb-6">
          <User size={32} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-display text-stone-dark mb-4">Account Access</h2>
        <p className="text-gray-400 mb-10 text-sm font-light text-center max-w-xs">Please sign in to access your reserved collections and project details.</p>
        <Link to="/login" className="btn-primary px-12 py-4">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-bg pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] p-10 md:p-12 mb-8 shadow-2xl shadow-black/5 border border-stone-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <User size={120} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 bg-stone-dark text-white rounded-full flex items-center justify-center text-3xl font-display italic">
              {profile.name[0]}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-display text-stone-dark mb-2">{profile.name}</h1>
              <p className="text-gray-400 text-sm font-light flex items-center justify-center md:justify-start gap-2">
                <Mail size={14} />
                {profile.email}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="text-[9px] font-bold uppercase tracking-widest bg-stone-accent/10 text-stone-accent px-3 py-1 rounded-full border border-stone-accent/20">
                   {profile.role} Member
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest bg-stone-border text-gray-500 px-3 py-1 rounded-full">
                  Verified Heritage Tier
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="space-y-6">
            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-stone-dark/40 ml-4">Architecture & Logistics</h3>
            
            <Link to="/orders" className="group block bg-white p-8 rounded-[2rem] border border-stone-border hover:border-stone-accent transition-all hover:shadow-xl shadow-black/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-stone-bg rounded-2xl flex items-center justify-center text-stone-dark group-hover:bg-stone-dark group-hover:text-white transition-colors">
                    <History size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-display text-stone-dark">Reservation Archives</h4>
                    <p className="text-xs text-gray-400 font-light">Track current and past stone imports</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-stone-border group-hover:text-stone-accent transform group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link to="/products" className="group block bg-white p-8 rounded-[2rem] border border-stone-border hover:border-stone-accent transition-all hover:shadow-xl shadow-black/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-stone-bg rounded-2xl flex items-center justify-center text-stone-dark group-hover:bg-stone-dark group-hover:text-white transition-colors">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-display text-stone-dark">Explore Collections</h4>
                    <p className="text-xs text-gray-400 font-light">View new Statuario & Onyx arrivals</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-stone-border group-hover:text-stone-accent transform group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-6 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors border border-dashed border-red-100 rounded-[2rem] hover:bg-red-50">
              <LogOut size={14} />
              Terminate Secure Session
            </button>
          </div>

          {/* Details & Settings */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-stone-border shadow-2xl shadow-black/5">
            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-stone-dark/40 mb-8">Member Credentials</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <Shield size={18} className="text-stone-accent mt-1" />
                <div>
                  <p className="text-[10px] font-bold text-stone-dark/60 uppercase tracking-widest mb-1">Security Status</p>
                  <p className="text-sm text-stone-dark font-light leading-relaxed">Your account is secured with Google OAuth 2.0 and enterprise-grade cloud encryption.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-stone-accent mt-1" />
                <div>
                  <p className="text-[10px] font-bold text-stone-dark/60 uppercase tracking-widest mb-1">Logistics & Shipping</p>
                  <p className="text-sm text-stone-dark font-light leading-relaxed">Default project address is configured at first checkout. Global tracking enabled.</p>
                </div>
              </div>

              <div className="p-6 bg-stone-bg rounded-2xl border border-stone-border/50 mt-4">
                <p className="text-[10px] font-bold text-stone-dark/30 uppercase tracking-widest mb-3">Customer Support</p>
                <a 
                  href="https://wa.me/917028111062" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>Chat with Stone Expert</span>
                </a>
              </div>

              <div className="p-6 bg-stone-bg rounded-2xl border border-stone-border/50 mt-4">
                <p className="text-[10px] font-bold text-stone-dark/30 uppercase tracking-widest mb-3">Technical Identity</p>
                <div className="font-mono text-[10px] text-gray-400 break-all bg-white/50 p-3 rounded-lg border border-white">
                  UID: {user.uid}
                </div>
              </div>
            </div>
          </div>
        </div>

        {profile.role === 'admin' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-stone-dark text-white p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-xl font-display italic">Internal Portal Detected</h3>
              <p className="text-white/40 text-xs font-light mt-1">You have administrative privileges for inventory and logistics management.</p>
            </div>
            <Link to="/admin" className="bg-white text-stone-dark px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
              Launch Dashboard
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Account;
