import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
    function middleware(req) {
        const session = req.nextauth.token
        const path = req.nextUrl.pathname

        if ((path.startsWith('/edit') || path.startsWith('/dashboard')) &&
            session?.name !== 'jobsicke1' && session?.name !== 'admin1') {
            return NextResponse.redirect(new URL('/not-authorized', req.url))
        }
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
)

export const config = {
    matcher: ['/edit/:path*', '/dashboard/:path*']
}