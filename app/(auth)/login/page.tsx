'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const search = useSearchParams();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: search?.get('callbackUrl') ?? '/'
    });
    if (res?.error) {
      setError('Invalid credentials');
      return;
    }
    router.push(res?.url || '/orders');
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 bg-[radial-gradient(circle_at_10%_20%,rgba(11,165,233,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(15,23,42,0.06),transparent_20%),#f8fafc]">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <h1 className="text-2xl font-semibold text-midnight mb-2">Welcome back</h1>
        <p className="text-sm text-slate-600 mb-6">Access your printing dashboard.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-accent"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-accent"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-midnight text-white rounded-lg py-3 font-semibold hover:translate-y-[-1px] transition"
          >
            Sign in
          </button>
        </form>
        <p className="text-sm text-slate-600 mt-4">
          No account? <Link className="text-accent font-semibold" href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
