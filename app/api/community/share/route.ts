import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { images, posts } from '@/db/schema'
import { currentUser } from '@clerk/nextjs/server'
import { ISharePostRequest, ISharePostResponse, IErrorResponse } from '@/types'

export async function POST(request: NextRequest) {
    try {
        const user = await currentUser()
        if (!user?.id) {
            return NextResponse.json<IErrorResponse>(
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

        const body: ISharePostRequest = await request.json()

        // 이미지 존재 여부 및 소유권 확인
        const image = await db
            .select()
            .from(images)
            .where(eq(images.id, body.imageId))
            .limit(1)
            .then(rows => rows[0])

        if (!image) {
            return NextResponse.json<IErrorResponse>(
                {
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: '이미지를 찾을 수 없습니다.'
                    }
                },
                { status: 404 }
            )
        }

        if (image.userId !== user.id) {
            return NextResponse.json<IErrorResponse>(
                {
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: '이 이미지를 공유할 권한이 없습니다.'
                    }
                },
                { status: 403 }
            )
        }

        // 이미지를 공개로 설정
        await db
            .update(images)
            .set({ isPublic: true })
            .where(eq(images.id, body.imageId))

        // 게시물 생성
        const [post] = await db
            .insert(posts)
            .values({
                imageId: body.imageId,
                userId: user.id,
                title: body.title,
                description: body.description
            })
            .returning()

        return NextResponse.json<ISharePostResponse>({
            success: true,
            post: {
                id: post.id,
                imageId: post.imageId,
                userId: post.userId,
                title: post.title,
                description: post.description,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            }
        })
    } catch (error) {
        console.error('Share Post Error:', error)
        return NextResponse.json<IErrorResponse>(
            {
                success: false,
                error: {
                    code: 'SHARE_FAILED',
                    message: '게시물 공유에 실패했습니다.'
                }
            },
            { status: 500 }
        )
    }
}
