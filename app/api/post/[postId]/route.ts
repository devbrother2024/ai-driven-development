import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { images, posts, likes, comments } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { currentUser, clerkClient } from '@clerk/nextjs/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { postId: string } }
) {
    try {
        // 현재 인증된 사용자 ID 가져오기
        const me = await currentUser()

        // 게시물 조회
        const postResult = await db
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
                    AND ${likes.userId} = ${me?.id || ''}
                )`
            })
            .from(posts)
            .innerJoin(images, eq(posts.imageId, images.id))
            .leftJoin(likes, eq(posts.id, likes.postId))
            .leftJoin(comments, eq(posts.id, comments.postId))
            .where(eq(posts.id, parseInt(params.postId)))
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

        const post = postResult[0]

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

        // 게시물 작성자 정보 조회
        const client = await clerkClient()
        const user = await client.users.getUser(post.userId)

        // 응답 데이터 포맷팅
        const formattedPost = {
            postId: post.id.toString(),
            imageURL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${post.imageUrl}`,
            userName: user?.username || user?.firstName || 'Unknown User',
            userProfile: user?.imageUrl,
            title: post.title,
            description: post.description,
            likes: post.likesCount,
            comments: post.commentsCount,
            isLiked: post.isLiked,
            prompt: post.prompt,
            createdAt: post.createdAt.toISOString()
        }

        return NextResponse.json({
            success: true,
            post: formattedPost
        })
    } catch (error) {
        console.error('Post detail error:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'POST_DETAIL_ERROR',
                    message:
                        '게시물 상세 정보를 불러오는 중 오류가 발생했습니다.'
                }
            },
            { status: 500 }
        )
    }
}
