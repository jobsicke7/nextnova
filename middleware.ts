// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

// 허용된 닉네임 리스트
const allowedNicknames = ['jobsicke', 'jobsickes'];

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('next-auth.session-token');

    // 세션 토큰이 없는 경우 로그인 페이지로 리다이렉트
    if (!sessionCookie && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 세션이 있는 경우 닉네임 확인
    if (sessionCookie && request.nextUrl.pathname.startsWith('/dashboard')) {
        const sessionToken = sessionCookie.value; // 문자열 값 추출

        // 사용자 닉네임 가져오기 (비동기 호출)
        const userNickname = await getUserNickname(sessionToken);

        // 닉네임이 허용되지 않은 경우 접근 금지 페이지로 리다이렉트
        if (!allowedNicknames.includes(userNickname)) {
            return NextResponse.redirect(new URL('/not-authorized', request.url));
        }
    }

    // /login에 접근 시 세션이 있으면 리다이렉트
    if (sessionCookie && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 요청을 그대로 처리
    return NextResponse.next();
}

// 사용자 닉네임을 가져오는 함수 (예: 네이버 프로필 API 호출)
async function getUserNickname(token: string): Promise<string> {
    const response = await fetch('https://openapi.naver.com/v1/nid/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user nickname');
    }

    const data = await response.json();

    // 네이버 API에서 닉네임 추출
    return data.response.nickname;
}

// 미들웨어가 적용될 경로 설정
export const config = {
    matcher: ['/dashboard', '/login'], // /dashboard와 /login 경로에만 미들웨어 적용
};
