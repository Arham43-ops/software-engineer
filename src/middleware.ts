import { NextRequest, NextResponse } from 'next/server';

const MOBILE_USER_AGENT =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';

    if (MOBILE_USER_AGENT.test(userAgent)) {
        return NextResponse.redirect('https://arham-workspace.vercel.app/', 307);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Run on application routes while skipping Next.js internals and
         * static assets that do not need device detection.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf)$).*)',
    ],
};
