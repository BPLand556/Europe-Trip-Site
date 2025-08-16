import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();
    
    if (passcode === process.env.ADMIN_PASSCODE) {
      // Set httpOnly cookie for admin session
      const cookieStore = cookies();
      cookieStore.set('admin-session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid passcode' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Authentication failed:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('admin-session');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
