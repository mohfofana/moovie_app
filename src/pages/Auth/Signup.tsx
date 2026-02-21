import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { useAuth } from '@/context/authContext';
import { cn } from '@/utils/helper';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    profileName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        profileName: formData.profileName || undefined,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-bg-secondary to-black" />

      {/* Subtle animated orb */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] animate-pulse" />

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Cinescope</h1>
          <p className="text-gray-400 text-sm">Create your account</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="dark-glass rounded-2xl p-8 space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Profile Name Input */}
            <div>
              <label htmlFor="profileName" className="block text-sm font-medium text-gray-300 mb-2">
                Profile Name <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                id="profileName"
                name="profileName"
                type="text"
                value={formData.profileName}
                onChange={handleChange}
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder-gray-500",
                  "focus:outline-none focus:border-white/25 focus:bg-white/8",
                  "transition-all duration-200"
                )}
                placeholder="Choose a profile name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder-gray-500",
                  "focus:outline-none focus:border-white/25 focus:bg-white/8",
                  "transition-all duration-200"
                )}
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder-gray-500",
                  "focus:outline-none focus:border-white/25 focus:bg-white/8",
                  "transition-all duration-200"
                )}
                placeholder="Create a password (min. 8 characters)"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder-gray-500",
                  "focus:outline-none focus:border-white/25 focus:bg-white/8",
                  "transition-all duration-200"
                )}
                placeholder="Confirm your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-3 rounded-lg font-semibold mt-6",
                "bg-white text-black",
                "hover:bg-gray-100",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isLoading && "opacity-50"
              )}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white font-medium hover:underline transition-all"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>

        {/* Terms */}
        <p className="text-gray-500 text-xs text-center mt-8">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </m.div>
    </div>
  );
};

export default Signup;
