import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Europe Trip Tracker</title>
    <description>Travel journal from our European adventure</description>
    <link>${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'}</link>
    <atom:link href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'}/api/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${post.title || 'Untitled Post'}</title>
      <description>${post.caption || ''}</description>
      <link>${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'}/post/${post.slug}</link>
      <guid>${post.id}</guid>
      <pubDate>${post.takenAt || post.createdAt}</pubDate>
      ${post.city ? `<category>${post.city}</category>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Failed to generate RSS:', error);
    return NextResponse.json(
      { error: 'Failed to generate RSS' },
      { status: 500 }
    );
  }
}
