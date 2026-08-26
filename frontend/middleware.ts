import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.has('isLoggedIn');

    // Jika pengguna mencoba mengakses halaman utama (todo list) tapi belum login
    if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/task')) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Jika pengguna sudah login tapi mencoba mengakses halaman login/register
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/task/:path*', '/login', '/register'],
};
