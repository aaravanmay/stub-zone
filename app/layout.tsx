import type { Metadata } from 'next';
import { DM_Sans, Sora, Space_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Stub Zone — MLB The Show 26 Companion',
  description:
    'Your Diamond Dynasty companion app for MLB The Show 26. Track market flips, build your team, manage collections, and dominate the marketplace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${sora.variable} ${spaceMono.variable}`}
    >
      <body className="bg-bg-primary text-text-primary font-body min-h-screen antialiased">
        <Navbar />
        <main className="pt-16 pb-20 md:pb-6 md:pl-16">
          {children}
        </main>
      </body>
    </html>
  );
}
