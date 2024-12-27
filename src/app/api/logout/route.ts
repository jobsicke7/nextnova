// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.redirect('/login');

    // 쿠키에서 세션 토큰 제거
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.callback-url');

    return response;
}
