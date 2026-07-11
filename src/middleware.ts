import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (err) {
    console.error('[Middleware] Supabase error:', err);
    // On failure, gracefully continue instead of crashing the site with a 500 Error
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    // Exclude sw.js, static files, images
    '/((?!_next/static|_next/image|favicon.ico|sw\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
