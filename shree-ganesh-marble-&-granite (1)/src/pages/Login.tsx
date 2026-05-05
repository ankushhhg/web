import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, ArrowRight, ShieldCheck, Gem } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [selection, setSelection] = useState<'chooser' | 'user'>('chooser');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUserAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (isRegistering) {
        await registerWithEmail(email, password, name, phone);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/products');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await login();
      navigate('/products');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-bg flex flex-col items-center justify-center pt-28 pb-12 px-6">
      <motion.div 
        key={selection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-black/5 border border-stone-border"
      >
        {selection === 'chooser' ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-stone-dark text-white rounded-full flex items-center justify-center font-display italic text-2xl mx-auto mb-10 shadow-xl shadow-stone-dark/20">G</div>
            <h1 className="text-3xl font-display text-stone-dark mb-4">Portal Access</h1>
            <p className="text-gray-400 text-sm font-light mb-12">Please select your authorization tier to proceed.</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => setSelection('user')}
                className="w-full group bg-white border border-stone-border hover:border-stone-accent p-6 rounded-[2rem] flex items-center justify-between transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 bg-stone-bg rounded-full flex items-center justify-center text-stone-dark group-hover:bg-stone-accent group-hover:text-white transition-colors">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-display text-stone-dark">Client Entrance</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Architects & Designers</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-stone-border group-hover:text-stone-accent transform group-hover:translate-x-1 transition-all" />
              </button>

              <Link 
                to="/admin/login"
                className="w-full group bg-stone-dark p-6 rounded-[2rem] flex items-center justify-between transition-all hover:shadow-xl hover:shadow-stone-dark/20"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-display text-white">Internal Vault</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Authorized Personnel</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-white/20 group-hover:text-stone-accent transform group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <button onClick={() => setSelection('chooser')} className="text-[9px] font-bold uppercase tracking-widest text-stone-accent mb-6 hover:underline flex items-center justify-center gap-2 mx-auto">
                <ArrowRight className="rotate-180" size={12} />
                Back to Selection
              </button>
              <div className="w-16 h-16 bg-stone-dark text-white rounded-full flex items-center justify-center font-display italic text-2xl mx-auto mb-6">G</div>
              <h1 className="text-3xl font-display text-stone-dark mb-2">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-400 text-sm font-light">
                {isRegistering 
                  ? 'Join our community of elite architects.' 
                  : 'Sign in to access your reserved collections.'}
              </p>
            </div>

            <form onSubmit={handleUserAuth} className="space-y-4 mb-8">
              {error && (
                <div className="p-3 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-100 text-center">
                  {error}
                </div>
              )}

              {isRegistering && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-4 block mb-1">Full Name</label>
                    <input 
                      required
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Jean Nouvel"
                      className="w-full bg-stone-bg border border-stone-border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-stone-accent transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-4 block mb-1">Mobile Number</label>
                    <input 
                      required
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 00000 00000"
                      className="w-full bg-stone-bg border border-stone-border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-stone-accent transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-4 block mb-1">Email Address</label>
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="architect@studio.com"
                  className="w-full bg-stone-bg border border-stone-border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-stone-accent transition-all"
                />
              </div>

              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-4 block mb-1">Passphrase</label>
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-bg border border-stone-border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-stone-accent transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 mt-4 relative overflow-hidden"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : (
                  <span>{isRegistering ? 'Register & Enter' : 'Sign In'}</span>
                )}
              </button>
            </form>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-border"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-white px-4 text-gray-300">Social Connect</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 py-4 border border-stone-border rounded-2xl hover:bg-stone-bg transition-colors mb-8"
            >
              <Gem size={16} className="text-stone-accent" />
              <span className="text-xs font-bold text-stone-dark uppercase tracking-widest">Connect with Google</span>
            </button>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-[10px] uppercase font-bold tracking-widest text-stone-dark/40 hover:text-stone-accent transition-colors"
              >
                {isRegistering ? 'Already have an account? Sign In' : 'New to Shree Ganesh? Create Account'}
              </button>
            </div>
          </>
        )}
      </motion.div>

      <div className="mt-12 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-dark/20 flex gap-8">
        <Link to="/" className="hover:text-stone-dark transition-colors">Home</Link>
        <Link to="/contact" className="hover:text-stone-dark transition-colors">Support</Link>
      </div>
    </div>
  );
};

export default Login;
