import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 공개 접근이 가능한 경로 정의
const isPublicRoute = createRouteMatcher([
    '/', // 메인 페이지
    '/api/community/feed(.*)', // 커뮤니티 피드 페이지
    '/sign-in(.*)', // 로그인 페이지
    '/sign-up(.*)', // 회원가입 페이지
    '/api/webhook(.*)', // Webhook 엔드포인트
    '/_next(.*)', // Next.js 내부 라우트
    '/favicon.ico',
    '/logo.webp',
    '/fonts/(.*)', // 폰트 파일
    '/images/(.*)' // 이미지 파일
])

export default clerkMiddleware(async (auth, request) => {
    // 공개 경로가 아닌 경우 인증 필요
    if (!isPublicRoute(request)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!.*\\..*|_next).*)',
        '/',
        '/(api|trpc)(.*)'
    ]
}
