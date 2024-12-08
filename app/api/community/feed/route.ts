import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { images, posts, likes, comments } from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'
import { getAuth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

const DEFAULT_PAGE_SIZE = 12

export async function GET(request: NextRequest) {
    try {
        // 현재 인증된 사용자 ID 가져오기
        const { userId } = getAuth(request)

        // URL 파라미터 파싱
        const searchParams = request.nextUrl.searchParams
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(
            searchParams.get('limit') || String(DEFAULT_PAGE_SIZE)
        )
        const sortBy = searchParams.get('sortBy') || 'latest'

        // 오프셋 계산
        const offset = (page - 1) * limit

        // 공개된 이미지만 조회하는 기본 쿼리
        const baseQuery = db
            .select({
                id: posts.id,
                imageId: posts.imageId,
                userId: posts.userId,
                title: posts.title,
                description: posts.description,
                createdAt: posts.createdAt,
                imageUrl: images.filePath,
                prompt: images.prompt,
                // 좋아요 수를 서브쿼리로 계산
                likesCount: sql<number>`CAST(COUNT(DISTINCT ${likes.id}) AS INTEGER)`,
                // 댓글 수를 서브쿼리로 계산
                commentsCount: sql<number>`CAST(COUNT(DISTINCT ${comments.id}) AS INTEGER)`,
                // 현재 사용자의 좋아요 여부 확인
                isLiked: sql<boolean>`EXISTS (
                    SELECT 1 FROM ${likes}
                    WHERE ${likes.postId} = ${posts.id}
                    AND ${likes.userId} = ${userId || ''}
                )`
            })
            .from(posts)
            .innerJoin(images, eq(posts.imageId, images.id))
            .leftJoin(likes, eq(posts.id, likes.postId))
            .leftJoin(comments, eq(posts.id, comments.postId))
            .where(eq(images.isPublic, true))
            .groupBy(
                posts.id,
                posts.imageId,
                posts.userId,
                posts.title,
                posts.description,
                posts.createdAt,
                images.filePath,
                images.prompt
            )

        // 정렬 조건 적용
        const query =
            sortBy === 'oldest'
                ? baseQuery.orderBy(posts.createdAt)
                : baseQuery.orderBy(desc(posts.createdAt))

        // 전체 게시물 수 조회
        const totalCountResult = await db
            .select({
                count: sql<number>`CAST(COUNT(DISTINCT ${posts.id}) AS INTEGER)`
            })
            .from(posts)
            .innerJoin(images, eq(posts.imageId, images.id))
            .where(eq(images.isPublic, true))

        const totalCount = totalCountResult[0].count

        // 페이지네이션 적용하여 게시물 조회
        const postsResult = await query.limit(limit).offset(offset)

        // 사용자 정보 조회 (Clerk API 사용)
        const userIds = Array.from(
            new Set(postsResult.map(post => post.userId))
        )
        const client = await clerkClient()
        const clerkUsers = await client.users.getUserList({
            userId: userIds
        })

        // 응답 데이터 포맷팅
        const formattedPosts = postsResult.map(post => {
            const user = clerkUsers.data.find(u => u.id === post.userId)
            return {
                postId: post.id.toString(),
                imageURL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${post.imageUrl}`,
                userName: user?.username || user?.firstName || 'Unknown User',
                userProfile: user?.imageUrl,
                likes: post.likesCount,
                comments: post.commentsCount,
                isLiked: post.isLiked,
                prompt: post.prompt,
                createdAt: post.createdAt.toISOString()
            }
        })

        return NextResponse.json({
            success: true,
            posts: formattedPosts,
            totalCount,
            hasMore: totalCount > page * limit
        })
    } catch (error) {
        console.error('Community feed error:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'FEED_ERROR',
                    message: '커뮤니티 피드를 불러오는 중 오류가 발생했습니다.'
                }
            },
            { status: 500 }
        )
    }
}
