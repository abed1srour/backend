import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('adminToken');
    const url = request.nextUrl;

    if (!token && url.pathname.startsWith('/admin/dashboard')) {
        return NextResponse.redirect(new URL('/al-bazourieh/nova/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/dashboard'],
};