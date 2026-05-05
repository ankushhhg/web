import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldAlert, ArrowLeft, Terminal, Mail, Key } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const { loginWithEmail, profile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');
    try {
      await loginWithEmail(email, password);
      // Wait for profile update to catch admin role redirect logic below
    } catch (err: any) {
      setError(err.message || 'Authentication Failed');
      setIsAuthenticating(false);
    }
  };

  // If already logged in as admin, redirect
  React.useEffect(() => {
    if (profile?.role === 'admin') {
      navigate('/admin');
    }
  }, [profile, navigate]);

  return (
    <div className="min-h-screen bg-stone-dark flex items-center justify-center px-6 overflow-hidden relative">
      {/* Background Decorative patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#111] rounded-[3rem] p-12 md:p-16 border border-white/5 shadow-2xl relative z-10"
      >
        <div className="flex justify-between items-start mb-16">
          <div className="w-12 h-12 bg-white text-stone-dark rounded-full flex items-center justify-center font-display italic text-2xl">G</div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-[8px] font-bold uppercase tracking-widest">
            <ShieldAlert size={10} />
            <span>Restricted Access</span>
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-display text-white mb-4">Internal Systems</h1>
          <p className="text-white/40 text-sm font-light leading-relaxed">
            Authorized personnel only. Secure vault access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block ml-4">Identifier</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-stone-accent transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block ml-4">Security Key</label>
            <div className="relative">
              <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-stone-accent transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-white text-stone-dark py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
          >
            {isAuthenticating ? <span>Authenticating...</span> : (
              <>
                <Lock size={16} />
                <span>Verify Credentials</span>
              </>
            )}
          </button>
        </form>
        
        <Link 
          to="/" 
          className="flex items-center justify-center space-x-2 py-4 text-white/20 hover:text-white/40 transition-colors text-[9px] font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} />
          <span>Return to Public Site</span>
        </Link>

        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center space-x-4">
           <Terminal size={20} className="text-stone-accent" />
           <div>
             <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Identity Status</p>
             <p className="text-xs text-white/30 font-mono">
               {profile ? `Authenticated as ${profile.role}` : 'Connection: Secure'}
             </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
