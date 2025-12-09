'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isActive = (href: string) => pathname === href;

  return (
    <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={role === 'ADMIN' ? '/admin' : '/'} className="text-lg font-semibold text-midnight">
          3DMaquette
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {role !== 'ADMIN' && (
            <Link className={linkClass(isActive('/'))} href="/">
              Home
            </Link>
          )}
          {session?.user && role !== 'ADMIN' && (
            <Link className={linkClass(isActive('/orders'))} href="/orders">
              Orders
            </Link>
          )}
          {role === 'ADMIN' && (
            <Link className={linkClass(isActive('/admin'))} href="/admin">
              Admin
            </Link>
          )}
          {!session?.user && (
            pathname === '/login' ? (
              <Link className="text-sm text-midnight font-medium" href="/register">
                Register
              </Link>
            ) : (
              <Link className="text-sm text-midnight font-medium" href="/login">
                Sign in
              </Link>
            )
          )}
          {session?.user && (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-full bg-midnight text-white px-3 py-1 text-xs font-semibold shadow"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function linkClass(active: boolean) {
  return `px-2 py-1 rounded-md ${active ? 'text-accent font-semibold' : 'text-slate-700 hover:text-midnight'}`;
}
