import { NextResponse } from 'next/server';
import { generateUploadSignature } from '@/lib/cloudinary';

export async function GET() {
  try {
    const signature = generateUploadSignature();
    return NextResponse.json(signature);
  } catch (error) {
    console.error('Failed to generate upload signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
