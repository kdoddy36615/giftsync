'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (data.session) {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');

    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: 'demo@test.com',
      password: 'TestPassword123!',
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (data.session) {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="bg-[#141414] border border-[#2d2d2d] rounded-lg p-8 shadow-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e4e4e7] mb-2">
          Welcome back
        </h1>
        <p className="text-[#a1a1aa]">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-[#dc2626] bg-opacity-10 border border-[#dc2626] rounded-lg p-4">
            <p className="text-[#dc2626] text-sm">{error}</p>
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
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#6366f1] hover:bg-[#5558e3] disabled:bg-[#4c4f9f] disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2d2d2d]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#141414] text-[#71717a]">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full bg-[#27272a] hover:bg-[#3f3f46] disabled:bg-[#1f1f23] disabled:cursor-not-allowed text-[#e4e4e7] font-semibold py-3 px-4 rounded-lg transition-colors duration-200 border border-[#2d2d2d]"
        >
          {isLoading ? 'Signing in...' : 'Demo Login'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[#a1a1aa]">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-[#6366f1] hover:text-[#5558e3] font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
