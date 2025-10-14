import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Lock, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [, setLocation] = useLocation();

  useEffect(() => {
    try {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const t = params.get('token');
      if (t) setToken(t);
      else setError('Invalid reset link. Please request a new one.');
    } catch {
      setError('Invalid reset link. Please request a new one.');
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    if (!token) {
      setError('Missing reset token');
      setIsLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(data.message || 'Password has been reset successfully');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-md">
        <Link href="/login">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mb-8 flex items-center gap-2 text-white/70 hover:text-amber-400 transition-colors duration-300">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Login</span>
          </motion.button>
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="text-2xl font-bold text-white mb-2">Reset Password</motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="text-white/60 text-sm">Enter a new password to complete the reset.</motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all duration-300"
                />
              </div>
            </div>

            <motion.button type="submit" disabled={isLoading} whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }} className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 ${isLoading ? 'bg-white/10 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-amber-500/25'}`}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Resetting...
                </div>
              ) : (
                'Reset Password'
              )}
            </motion.button>
          </form>

          {message && (
            <div className="mt-4 text-sm text-white/80">
              <p>{message}</p>
              <p className="mt-2">
                <Link href="/login" className="text-amber-400 hover:text-amber-300">Return to login</Link>
              </p>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
      </motion.div>
    </div>
  );
}