import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Loader2, UserPlus, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      // Clean up Firebase error messages for a cleaner UI
      const message = err.message?.replace('Firebase: ', '') || 'Authentication failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans">
      {/* Dynamic Backgrounds with Cross-fade Transition */}
      <div 
        className={`absolute inset-0 bg-[url('https://autoimage.capitalone.com/cms/Auto/assets/images/2381-hero-10-automakers-with-the-highest-percentage-of-electrified-vehicles-2023.jpg')] bg-cover bg-center transition-opacity duration-1000 ease-in-out ${isSignUp ? 'opacity-0' : 'opacity-100'}`}
      />
      <div 
        className={`absolute inset-0 bg-[url('https://hips.hearstapps.com/hmg-prod/images/lucid-air-108-1599688023.jpg')] bg-cover bg-center transition-opacity duration-1000 ease-in-out ${isSignUp ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Dark Cinematic Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Ambient Atmospheric Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="w-full max-w-md p-6 relative z-10">
        {/* Liquid Glass Card - Ultra Transparent See-through Design */}
        <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-500">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-inner group transition-transform duration-500 hover:rotate-12">
              {isSignUp ? (
                <UserPlus className="text-cyan-400 w-10 h-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              ) : (
                <Shield className="text-cyan-400 w-10 h-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              )}
            </div>
            <h1 className="text-4xl font-serif italic text-white tracking-tighter text-center mb-2">
              SafeRouteAI
            </h1>
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold text-center max-w-[300px]">
              {isSignUp ? 'Secure Personnel Enrollment' : 'Reduce accidents and detect unsafe driving with accuracy and speed.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Terminal ID</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/[0.05] transition-all"
                  placeholder="commander@fleet.ai"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/[0.05] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-4 rounded-xl uppercase tracking-wider font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group bg-white text-black font-bold py-4 rounded-2xl shadow-2xl shadow-white/5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="uppercase tracking-widest text-xs">Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-xs">
                      {isSignUp ? 'Initialize Enrollment' : 'Authorize Access'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-500" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-white/20 hover:text-white text-[10px] transition-all duration-300 uppercase tracking-[0.2em] font-bold border-b border-transparent hover:border-white/20 pb-1"
            >
              {isSignUp ? 'Already authorized? Return to Login' : 'New Unit? Request Enrollment'}
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-white/[0.05] text-[9px] uppercase tracking-[0.4em] font-black">
              Fleet Command Protocol • Level 4 Clearance Required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

