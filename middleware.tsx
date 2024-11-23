import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

export default clerkMiddleware(async (auth, request) => {})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!.*\\..*|_next).*)',
        '/',
        '/(api|trpc)(.*)'
    ]
}
