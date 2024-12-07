import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/db'
import { likes, posts } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'

export async function POST(
    req: NextRequest,
    { params }: { params: { postId: string } }
) {
    try {
        // 1. 인증 확인
        const user = await currentUser()
        if (!user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: '인증되지 않은 사용자입니다.'
                    }
                },
                { status: 401 }
            )
        }

        const postId = parseInt(params.postId)

        // 2. 게시물 존재 여부 확인
        const [post] = await db
            .select()
            .from(posts)
            .where(eq(posts.id, postId))
            .limit(1)

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'POST_NOT_FOUND',
                        message: '게시물을 찾을 수 없습니다.'
                    }
                },
                { status: 404 }
            )
        }

        // 3. 이미 좋아요를 눌렀는지 확인
        const [existingLike] = await db
            .select()
            .from(likes)
            .where(and(eq(likes.postId, postId), eq(likes.userId, user.id)))
            .limit(1)

        // 4. 좋아요 토글 처리
        if (existingLike) {
            // 좋아요 취소
            await db.delete(likes).where(eq(likes.id, existingLike.id))
        } else {
            // 좋아요 추가
            await db.insert(likes).values({
                postId,
                userId: user.id
            })
        }

        // 5. 현재 좋아요 수 조회
        const [{ value: totalLikes }] = await db
            .select({ value: count() })
            .from(likes)
            .where(eq(likes.postId, postId))

        // 6. 응답 반환
        return NextResponse.json({
            success: true,
            likes: totalLikes,
            isLiked: !existingLike
        })
    } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '서버 내부 오류가 발생했습니다.'
                }
            },
            { status: 500 }
        )
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: { postId: string } }
) {
    try {
        const user = await currentUser()
        if (!user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: '인증되지 않은 사용자입니다.'
                    }
                },
                { status: 401 }
            )
        }

        const postId = parseInt(params.postId)

        // 좋아요 상태 확인
        const [existingLike] = await db
            .select()
            .from(likes)
            .where(and(eq(likes.postId, postId), eq(likes.userId, user.id)))
            .limit(1)

        // 전체 좋아요 수 조회
        const [{ value: totalLikes }] = await db
            .select({ value: count() })
            .from(likes)
            .where(eq(likes.postId, postId))

        return NextResponse.json({
            success: true,
            likes: totalLikes,
            isLiked: !!existingLike
        })
    } catch (error) {
        console.error('좋아요 상태 조회 중 오류 발생:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '서버 내부 오류가 발생했습니다.'
                }
            },
            { status: 500 }
        )
    }
}
