import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    // Debug: log all cookies received
    // console.log('Middleware cookies:', req.cookies);

    const token = req.cookies.get('uid')?.value;
    const { pathname } = req.nextUrl;
    const response = NextResponse.next();

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/.well-known")
    ) {
        return NextResponse.next();
    }


    if (pathname === '/login' || pathname === '/signup') {
        console.log("Why here");
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {

        const res = await fetch(`${process.env.API_URL}/user/verify_login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        const data = await res.json();

        console.log("After why here", data, token, pathname)
        if (res.status !== 200 || !data.valid) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        // console.log("Here");
        const user = data.user;
        response.cookies.set('User', JSON.stringify(user), {
            path: '/',
            httpOnly: false, // set true for security if you don't need JS access
        });
        console.log(data)
    } catch (error) {
        console.error('Error verifying token');
        return NextResponse.redirect(new URL('/login', req.url));
    }
    // localStorage.setItem('uid', token);
    console.log("Before return");
    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
    ],
};
