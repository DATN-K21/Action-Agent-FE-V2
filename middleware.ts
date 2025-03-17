import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { Role } from '@/constants/auth-constant';

const allowedOrigins = [process.env.NEXT_PUBLIC_ORIGIN];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname, origin } = url;
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const session = await auth();

  // Prevent API access from different origins (CORS check)
  if (pathname.startsWith('/api') && !isAllowedOrigin) {
    return NextResponse.redirect(new URL('/unauthorized', url));
  }

  // Allow access to all APIs under `/api/access`
  if (pathname.startsWith('/api/access')) {
    return NextResponse.next();
  }

  // Allow all authentication-related APIs except for `/api/auth/session`
  if (pathname.startsWith('/api/auth') && pathname !== '/api/auth/session') {
    return NextResponse.next();
  }

  // If the request is for login or register and the user is logged in, redirect to home
  if ((pathname === '/login' || pathname === '/register') && session) {
    return NextResponse.redirect(new URL('/', url));
  }

  // If the user is not logged in, only allow access to login and register
  if (!session && !['/login', '/register'].includes(pathname)) {
    return NextResponse.redirect(new URL('/login', url));
  }

  // If the user does not have an error and is trying to log out, redirect to home
  if (!session?.error && pathname === '/logout') {
    return NextResponse.redirect(new URL('/', url));
  }

  // If refresh token error, redirect to logout
  if (session?.error === 'RefreshTokenError' && pathname !== '/logout') {
    return NextResponse.redirect(new URL('/logout', url));
  }

  // Role-based access control: Check user roles for specific routes
  if (session) {
    const userRole = session.user.role;

    // Allow only users with appropriate roles to access certain routes
    if (pathname.startsWith('/admin') && userRole !== Role.ADMIN) {
      return NextResponse.redirect(new URL('/unauthorized', url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!unauthorized|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
