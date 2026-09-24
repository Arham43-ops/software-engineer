import { NextRequest, NextResponse } from 'next/server';

const MOBILE_USER_AGENT =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

export function proxy(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';

    if (MOBILE_USER_AGENT.test(userAgent)) {
        return NextResponse.redirect('https://arham-workspace.vercel.app/', 307);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf)$).*)',
    ],
};
