import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90"></div>
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Travel Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-brand rounded-full blur-[128px] opacity-20 animate-pulse-slow"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
      >
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} className="mr-1" /> Back to Login
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Mail className="text-brand" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
          <p className="text-gray-400 text-sm">No worries, we'll send you reset instructions.</p>
        </div>

        {isSent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-green-500/10 border border-green-500/20 rounded-2xl p-6"
          >
            <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
            <h3 className="text-white font-bold text-lg mb-2">Check your email</h3>
            <p className="text-gray-300 text-sm mb-6">We sent a password reset link to <br /> <span className="text-white font-semibold">{email}</span></p>
            <button
              onClick={() => setIsSent(false)}
              className="text-brand hover:text-white text-sm font-semibold transition-colors"
            >
              Try another email
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand to-brand-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;