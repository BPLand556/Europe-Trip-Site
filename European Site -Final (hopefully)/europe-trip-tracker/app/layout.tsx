import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Europe Trip Tracker',
  description: 'Travel journal from our European adventure - beautiful photos, stories, and memories from our journey across Europe.',
  keywords: 'Europe, travel, photography, adventure, journal, blog',
  authors: [{ name: 'Europe Trip Tracker' }],
  openGraph: {
    title: 'Europe Trip Tracker',
    description: 'Travel journal from our European adventure',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Europe Trip Tracker',
    description: 'Travel journal from our European adventure',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
