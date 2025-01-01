import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/dashboard")) {
        if (token?.name !== "jobsicke" && token?.name !== "admin") {
            const url = req.nextUrl.clone();
            url.pathname = "/unauthorized"; // 권한 없음 페이지로 이동
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"], // dashboard 관련 경로에만 적용
};
