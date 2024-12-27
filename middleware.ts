// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

// 이 함수는 비동기로 실행할 수 있으며, await를 사용할 경우에 사용
export function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get('next-auth.session-token');

    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    if (!sessionToken && request.nextUrl.pathname.startsWith('/chat')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 로그인되어 있으면 chat 페이지로 접근 가능
    if (sessionToken && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/chat', request.url));
    }

    // 그 외의 경우에는 요청을 그대로 처리
    return NextResponse.next();
}

export const config = {
    matcher: ['/chat', '/login'],  // /chat과 /login 경로에만 미들웨어 적용
};
