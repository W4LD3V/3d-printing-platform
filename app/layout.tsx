import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { NavBar } from '@/components/navbar';

const font = Manrope({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: '3D Printing Platform',
  description: 'Order and manage 3D prints with ease.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className}>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
