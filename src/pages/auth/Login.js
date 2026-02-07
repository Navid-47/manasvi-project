import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserByEmail } from '../../services/userService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const userRecord = getUserByEmail(email);
      if (!userRecord || String(userRecord.password || '') !== String(password)) {
        throw new Error('Invalid email or password');
      }

      const role = userRecord.role || 'user';
      const userName = userRecord.name || email.split('@')[0] || 'User';

      login({ id: userRecord.id, email: userRecord.email, role, userName });

      const target = role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
      navigate(target, { state: { loginSuccess: true, userName } });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90"></div>
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80"
          alt="Travel Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand rounded-full blur-[128px] opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-[128px] opacity-20 animate-pulse-slow delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-xl shadow-lg mx-auto">
              TM
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to continue your adventure</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-brand transition-colors" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all placeholder:text-gray-600"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between ml-1">
              <label className="text-xs font-semibold text-gray-400">Password</label>
              <Link to="/forgot-password" സമclassName="text-xs text-brand hover:text-brand-light transition-colors">Forgot Password?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-brand transition-colors" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all placeholder:text-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand to-brand-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-bold hover:text-brand transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;