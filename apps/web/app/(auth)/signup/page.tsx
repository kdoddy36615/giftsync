'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (data.session) {
      // User signed up and automatically logged in
      router.push('/dashboard');
      router.refresh();
    } else {
      // Email confirmation required
      setError('Please check your email to confirm your account before signing in.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#2d2d2d] rounded-lg p-8 shadow-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e4e4e7] mb-2">
          Create an account
        </h1>
        <p className="text-[#a1a1aa]">
          Start organizing your gift lists today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#e4e4e7] mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2d2d2d] rounded-lg text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#e4e4e7] mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2d2d2d] rounded-lg text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-[#e4e4e7] mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2d2d2d] rounded-lg text-[#e4e4e7] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
            placeholder="Re-enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#6366f1] hover:bg-[#5558e3] disabled:bg-[#4c4f9f] disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[#a1a1aa]">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#6366f1] hover:text-[#5558e3] font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
