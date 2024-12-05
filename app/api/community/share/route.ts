import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { posts, images } from '@/db/schema'
import { currentUser } from '@clerk/nextjs/server'
import { IErrorResponse } from '@/types'

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

        const { imageId, title, description, tags } = await request.json()

        // 이미지 존재 여부 및 소유권 확인
        const image = await db
            .select()
            .from(images)
            .where(and(eq(images.id, imageId), eq(images.userId, user.id)))
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

        // isPublic으로 공유 여부 확인
        if (image.isPublic) {
            return NextResponse.json<IErrorResponse>(
                {
                    success: false,
                    error: {
                        code: 'ALREADY_SHARED',
                        message: '이미 커뮤니티에 공유된 이미지입니다.'
                    }
                },
                { status: 400 }
            )
        }

        // 트랜잭션으로 태그 업데이트와 게시물 생성을 함께 처리
        const result = await db.transaction(async tx => {
            // 이미지 태그 업데이트
            await tx
                .update(images)
                .set({
                    tags: tags,
                    isPublic: true, // 공유 시 자동으로 공개로 설정
                    updatedAt: new Date()
                })
                .where(eq(images.id, imageId))

            // 게시물 생성
            const [post] = await tx
                .insert(posts)
                .values({
                    imageId,
                    userId: user.id,
                    title,
                    description
                })
                .returning()

            return post
        })

        return NextResponse.json({
            success: true,
            post: result
        })
    } catch (error) {
        console.error('Community Share Error:', error)
        return NextResponse.json<IErrorResponse>(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '서버 내부 오류가 발생했습니다.'
                }
            },
            { status: 500 }
        )
    }
}
