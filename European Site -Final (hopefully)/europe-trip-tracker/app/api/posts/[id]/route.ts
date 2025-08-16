import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { postWithMediaSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = postWithMediaSchema.parse(body);

    // Delete existing media
    await prisma.media.deleteMany({
      where: { postId: params.id },
    });

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...validatedData,
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

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to update post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
