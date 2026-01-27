import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, type FormEvent } from "react";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [contactTopic, setContactTopic] = useState<'support' | 'marketing'>('marketing');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sendingContact, setSendingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState<string>('');
  const [contactError, setContactError] = useState<string>('');
  // Prefill contact email from login email field
  if (!contactEmail && email) {
    setContactEmail(email);
  }

  const [, setLocation] = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({} as any));
        const role = (data as any)?.user?.role;
        setLocation(role === 'admin' ? '/admin' : '/');
      } else {
        const data = await response.json().catch(() => ({}));
        const message = (data && data.message) || 'Login failed';
        setErrors({ email: message });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-page min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Back Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8 flex items-center gap-2 text-white/70 hover:text-amber-400 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </motion.button>
        </Link>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">C</span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Welcome Back
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-white/60 text-sm"
            >
              Sign in to access your celebrity style dashboard
            </motion.p>
          </div>

          {/* Login Form and Google Sign-In Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-6"
          >
            {/* Email/Password Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${
                      errors.email ? 'border-red-500/50' : 'border-white/10'
                    } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all duration-300`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-white/5 border ${
                      errors.password ? 'border-red-500/50' : 'border-white/10'
                    } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all duration-300`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 ${
                  isLoading
                    ? 'bg-white/10 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-amber-500/25'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

  

            {/* Divider */}
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/50">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Google Sign-In Component */}
            <div className="flex justify-center">
              <GoogleSignIn />
            </div>

            {/* Contact Admin (Marketing & Discussion) */}
            <div className="mt-8 space-y-3 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-white font-semibold">Contact Admin (Marketing & Discussion)</div>
              {contactStatus && <div className="text-green-400 text-xs">{contactStatus}</div>}
              {contactError && <div className="text-red-400 text-xs">{contactError}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-white/60 mb-1">Topic</div>
                  <Select value={contactTopic} onValueChange={(v) => setContactTopic(v as any)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Your Email</div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <div className="text-xs text-white/60 mb-1">Subject</div>
                  <input
                    type="text"
                    placeholder="e.g., Marketing collaboration discussion"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-white/60 mb-1">Message</div>
                <Textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Write your message..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={async () => {
                    setContactStatus('');
                    setContactError('');
                    if (!contactEmail || !/\S+@\S+\.\S+/.test(contactEmail)) {
                      setContactError('Please provide a valid email to contact admin');
                      return;
                    }
                    if (!contactSubject.trim() || contactMessage.trim().length < 10) {
                      setContactError('Please provide a subject and a detailed message (min 10 chars)');
                      return;
                    }
                    setSendingContact(true);
                    try {
                      const res = await fetch('/api/support/contact-admin', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          topic: contactTopic,
                          subject: contactSubject.trim(),
                          message: contactMessage.trim(),
                          email: contactEmail.trim(),
                        }),
                      });
                      if (res.ok) {
                        const data = await res.json().catch(() => ({}));
                        console.debug('[contact-admin] response', data);
                        setContactError('');
                        setContactSubject('');
                        setContactMessage('');
                        setContactEmail('');
                        const details = [];
                        if (typeof data.emailed !== 'undefined') details.push(`emailed=${data.emailed}`);
                        if (data.messageId) details.push(`messageId=${data.messageId}`);
                        if (typeof data.emailConfigured !== 'undefined') details.push(`emailConfigured=${data.emailConfigured}`);
                        if (typeof data.connectionOk !== 'undefined') details.push(`connectionOk=${data.connectionOk}`);
                        setContactStatus(`Message sent. ${details.join(' | ')}`);
                      } else {
                        const err = await res.json().catch(() => ({}));
                        console.debug('[contact-admin] error response', err);
                        setContactError(err?.message || 'Failed to send message.');
                      }
                    } catch {
                      setContactError('Network error while sending message.');
                    } finally {
                      setSendingContact(false);
                    }
                  }}
                  disabled={sendingContact}
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                >
                  {sendingContact ? 'Sending...' : 'Send to Admin'}
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center text-xs text-white/40 mt-6">
              <p>
                By signing in, you agree to our{" "}
                <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-8 text-white/40 text-sm"
        >
          <p>
              Don't have an account?{" "}
              <Link href="/signup" className="text-amber-400 hover:text-amber-300 transition-colors">
                Create one here
              </Link>
            </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
