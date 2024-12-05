import { NextRequest, NextResponse } from 'next/server'
import { desc, eq, and, gte, lte, sql } from 'drizzle-orm'
import { db } from '@/db'
import { images } from '@/db/schema'
import { currentUser } from '@clerk/nextjs/server'
import { IGalleryResponse, IErrorResponse } from '@/types'

export async function GET(request: NextRequest) {
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

        // URL 쿼리 파라미터 파싱
        const searchParams = request.nextUrl.searchParams
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const artStyle = searchParams.get('artStyle')
        const colorTone = searchParams.get('colorTone')
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        const sortBy = searchParams.get('sortBy') as 'latest' | 'oldest'
        const isPublic = searchParams.get('isPublic')

        // 쿼리 조건 구성
        const conditions = [eq(images.userId, user.id)]

        if (artStyle) {
            conditions.push(eq(images.artStyle, artStyle))
        }
        if (colorTone) {
            conditions.push(eq(images.colorTone, colorTone))
        }
        if (startDate) {
            conditions.push(gte(images.createdAt, new Date(startDate)))
        }
        if (endDate) {
            conditions.push(lte(images.createdAt, new Date(endDate)))
        }
        if (isPublic !== null && isPublic === 'true') {
            conditions.push(eq(images.isPublic, true))
        }

        // 전체 개수 조회
        const totalCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(images)
            .where(and(...conditions))
            .then(result => Number(result[0].count))

        // 이미지 목록 조회
        const imageList = await db
            .select()
            .from(images)
            .where(and(...conditions))
            .orderBy(
                sortBy === 'oldest' ? images.createdAt : desc(images.createdAt)
            )
            .limit(limit)
            .offset((page - 1) * limit)

        // 응답 데이터 구성
        const response: IGalleryResponse = {
            images: imageList.map(img => ({
                id: img.id.toString(),
                userId: img.userId,
                imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${img.filePath}`,
                prompt: img.prompt,
                styleOptions: {
                    artStyle: img.artStyle,
                    colorTone: img.colorTone
                },
                tags: img.tags,
                isPublic: img.isPublic,
                createdAt: img.createdAt.toISOString(),
                updatedAt: img.updatedAt.toISOString()
            })),
            totalCount,
            hasMore: totalCount > page * limit
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error('Gallery GET Error:', error)
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
