import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 添加路径信息到请求头
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-invoke-path', path);

    // 定义需要保护的路径
    const isProtectedPath = path === '/' ||
        path.startsWith('/api/prompts') || 
        path.startsWith('/api/tags') ||
        path.startsWith('/prompts') ||
        path.startsWith('/manage');

    if (isProtectedPath) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXT_AUTH_SECRET,
            secureCookie: process.env.NODE_ENV === "production",
        });

        // 检查 cookie 中的会话信息
        const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
            request.cookies.get('__Secure-next-auth.session-token')?.value;

        if (!token) {
            if (path.startsWith('/api/')) {
                return NextResponse.json(
                    { error: '请先登录' },
                    { status: 401 }
                );
            }
            
            // 重定向到登录页面
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        '/',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/api/prompts/:path*',
        '/api/tags/:path*',
        '/prompts/:path*',
        '/manage/:path*',
    ],
};
