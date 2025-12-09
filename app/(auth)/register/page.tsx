'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Could not register');
      return;
    }
    router.push('/login');
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 bg-[radial-gradient(circle_at_10%_20%,rgba(11,165,233,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(15,23,42,0.06),transparent_20%),#f8fafc]">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <h1 className="text-2xl font-semibold text-midnight mb-2">Create your account</h1>
        <p className="text-sm text-slate-600 mb-6">Join and submit your first 3D print request.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-accent"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            Create account
          </button>
        </form>
        <p className="text-sm text-slate-600 mt-4">
          Already have an account? <Link className="text-accent font-semibold" href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
