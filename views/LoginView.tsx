
import React, { useState, useEffect, useRef } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

interface LoginViewProps {
  onLogin: (email: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [typedText, setTypedText] = useState('');
  const fullText = "Welcome to Educ-8... kindly log in";

  useEffect(() => {
    if (isExiting) return;
    const timer = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        setTypedText(fullText.substring(0, i + 1));
        i++;
        if (i === fullText.length) {
          clearInterval(typingInterval);
        }
      }, 60);
      return () => clearInterval(typingInterval);
    }, 500); // Delay before typing starts
    return () => clearTimeout(timer);
  }, [isExiting]);

  // --- Flashlight Effect ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      container.style.setProperty('--x', `${e.clientX}px`);
      container.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isExiting) return;
    setIsLoading(true);
    setError(false);

    setTimeout(() => {
      if (password === 'wrong') {
        setError(true);
        setIsLoading(false);
        showToast('Invalid credentials. Please try again.', 'error');
      } else {
        setIsExiting(true);
      }
    }, 1000);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-dark-bg flex items-center justify-center p-4 transition-colors overflow-hidden"
      style={{
        background: `radial-gradient(circle at var(--x) var(--y), rgba(15, 23, 42, 0.8) 0%, #0f172a 30%, #0f172a 100%)`
      }}
    >
      <motion.div 
        animate={{ 
          x: error ? [0, -6, 6, -6, 6, -4, 4, 0] : 0,
          scale: isExiting ? 0 : 1,
          opacity: isExiting ? 0 : 1,
          rotate: isExiting ? -30 : 0
        }}
        transition={{ 
            x: { duration: 0.5, type: 'spring', stiffness: 500, damping: 20 },
            default: { duration: 0.4, ease: 'easeIn' }
        }}
        onAnimationComplete={() => {
            if (error) setError(false);
            if (isExiting) onLogin(email);
        }}
        className={`bg-white/5 p-8 rounded-3xl shadow-2xl w-full max-w-md border backdrop-blur-2xl transition-all ${error ? 'border-amber-500/50 shadow-amber-500/20' : 'border-white/10 shadow-blue-900/40'} glassmorphic-card`}
      >
        <motion.div 
            initial={{scale: 0}} animate={{scale:1}} transition={{delay: 0.2, type:'spring'}}
            className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-blue-500/40">
            E
          </div>
        </motion.div>
        
        <h2 className="text-xl font-medium text-center text-gray-200 mb-8 h-7">
          {typedText}
          <span className="blinking-cursor">|</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@educa8.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (use 'wrong' to test error)"
                className="w-full pl-10 pr-4 py-3 bg-gray-50/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all"
              />
            </div>
          </div>

          <motion.button 
            type="submit" 
            disabled={isLoading || isExiting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Engage'}
            {!isLoading && <ArrowRight size={18} />}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400">
            Demo Logins (any password except 'wrong'):<br/>
            superadmin@educa8.com, admin@educa8.com, teacher@educa8.com, facilitator@educa8.com
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;