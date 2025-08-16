import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { postWithMediaSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

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
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = postWithMediaSchema.parse(body);

    const slug = generateSlug(validatedData.title);

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        slug,
        media: {
          create: validatedData.media.map((media, index) => ({
            ...media,
            order: index,
          })),
        },
      },
      include: {
        media: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 400 }
    );
  }
}
