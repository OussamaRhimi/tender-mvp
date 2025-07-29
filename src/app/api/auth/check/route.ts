// src/app/api/auth/check/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/getCurrentUser'; // Adjust path if needed

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (user) {
      // Return user info or just a simple success indicator
      return NextResponse.json({ authenticated: true, user }, { status: 200 });
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    // Handle potential errors during user retrieval
    console.error("Error in /api/auth/check:", error); // Log for debugging
    return NextResponse.json({ authenticated: false, error: 'Authentication check failed' }, { status: 500 });
  }
}