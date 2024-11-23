# Next.js에 Clerk 인증 시스템 연동하기

## 1. Clerk 패키지 설치

프로젝트에 Clerk 패키지를 설치합니다:

```bash
npm install @clerk/nextjs
```

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 Clerk 대시보드에서 발급받은 키를 추가합니다:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_**********
CLERK_SECRET_KEY=sk_test_**********
```

## 3. ClerkProvider 설정

`app/layout.tsx`에 ClerkProvider를 추가하여 전역적으로 인증 상태를 관리합니다:

```typescript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body>{children}</body>
            </html>
        </ClerkProvider>
    )
}
```

## 4. 미들웨어 설정

프로젝트 루트에 `middleware.ts` 파일을 생성하여 보호된 라우트를 설정합니다:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 공개 접근이 가능한 경로 정의
const isPublicRoute = createRouteMatcher([
    '/', // 메인 페이지
    '/sign-in(.*)', // 로그인 페이지
    '/sign-up(.*)', // 회원가입 페이지
    '/api/webhook(.*)', // Webhook 엔드포인트
    '/_next(.*)', // Next.js 내부 라우트
    '/favicon.ico',
    '/logo.webp'
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
```

## 5. 인증 컴포넌트 사용

페이지나 컴포넌트에서 Clerk의 인증 관련 컴포넌트를 사용할 수 있습니다:

```typescript
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    useUser
} from '@clerk/nextjs'

export default function Page() {
    const { user } = useUser()

    return (
        <div>
            <SignedIn>
                {/* 로그인한 사용자에게만 보이는 컨텐츠 */}
                <p>Welcome {user?.firstName}!</p>
                <UserButton />
            </SignedIn>

            <SignedOut>
                {/* 로그인하지 않은 사용자에게만 보이는 컨텐츠 */}
                <SignInButton />
            </SignedOut>
        </div>
    )
}
```

## 6. 주요 Clerk 컴포넌트

-   `<SignedIn>`: 인증된 사용자에게만 보이는 컨텐츠를 감싸는 컴포넌트
-   `<SignedOut>`: 비인증 사용자에게만 보이는 컨텐츠를 감싸는 컴포넌트
-   `<SignInButton>`: 로그인 버튼/모달을 제공하는 컴포넌트
-   `<UserButton>`: 사용자 프로필 버튼을 제공하는 컴포넌트
-   `useUser()`: 현재 로그인한 사용자의 정보를 제공하는 훅

## 7. 보호된 API 라우트 설정

API 라우트에서 인증을 적용하려면 다음과 같이 설정합니다:

```typescript
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET() {
    const { userId } = auth()

    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    // 인증된 요청 처리
    return NextResponse.json({ message: 'Protected data!' })
}
```

## 8. 유용한 팁

-   Clerk 대시보드에서 로그인 방식(이메일, 소셜 로그인 등)을 설정할 수 있습니다.
-   `afterSignInUrl`, `afterSignUpUrl` 등을 통해 인증 후 리다이렉션을 설정할 수 있습니다.
-   개발 모드에서는 테스트 이메일을 사용하여 쉽게 테스트할 수 있습니다.

## 9. 환경별 설정

프로덕션 환경과 개발 환경에서 서로 다른 Clerk 인스턴스를 사용하는 것을 권장합니다:

```env
# 개발 환경
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_**********
CLERK_SECRET_KEY=sk_test_**********

# 프로덕션 환경
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_**********
CLERK_SECRET_KEY=sk_live_**********
```
