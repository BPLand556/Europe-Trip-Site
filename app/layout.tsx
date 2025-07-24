import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Adventures of Billy and Bobby - European Travel Map',
  description: 'Follow Billy and Bobby\'s incredible journey across Europe through an interactive map filled with stories, photos, and memories.',
  keywords: 'travel, Europe, interactive map, Billy and Bobby, adventure, storytelling',
  authors: [{ name: 'Billy and Bobby' }],
  openGraph: {
    title: 'The Adventures of Billy and Bobby - European Travel Map',
    description: 'Follow Billy and Bobby\'s incredible journey across Europe through an interactive map filled with stories, photos, and memories.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Billy and Bobby\'s European Adventure Map',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Adventures of Billy and Bobby - European Travel Map',
    description: 'Follow Billy and Bobby\'s incredible journey across Europe through an interactive map filled with stories, photos, and memories.',
    images: ['/og-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
} 