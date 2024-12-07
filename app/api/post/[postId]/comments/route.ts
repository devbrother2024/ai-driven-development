import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { comments } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { currentUser, clerkClient } from '@clerk/nextjs/server'

// 댓글 목록 조회
export async function GET(
    request: NextRequest,
    { params }: { params: { postId: string } }
) {
    try {
        // 댓글 조회
        const commentResults = await db
            .select({
                id: comments.id,
                postId: comments.postId,
                userId: comments.userId,
                content: comments.content,
                createdAt: comments.createdAt
            })
            .from(comments)
            .where(eq(comments.postId, parseInt(params.postId)))
            .orderBy(desc(comments.createdAt))

        // 작성자 정보 조회
        const userIds = Array.from(
            new Set(commentResults.map(comment => comment.userId))
        )

        const client = await clerkClient()
        const users = await client.users.getUserList({
            userId: userIds
        })

        // 응답 데이터 포맷팅
        const formattedComments = commentResults.map(comment => {
            const user = users.data.find(u => u.id === comment.userId)
            return {
                id: comment.id.toString(),
                postId: comment.postId.toString(),
                userName: user?.username || user?.firstName || 'Unknown User',
                userProfile: user?.imageUrl,
                content: comment.content,
                createdAt: comment.createdAt.toISOString()
            }
        })

        return NextResponse.json({
            success: true,
            comments: formattedComments
        })
    } catch (error) {
        console.error('Comments fetch error:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'COMMENTS_FETCH_ERROR',
                    message: '댓글을 불러오는 중 오류가 발생했습니다.'
                }
            },
            { status: 500 }
        )
    }
}

// 새 댓글 작성
export async function POST(
    request: NextRequest,
    { params }: { params: { postId: string } }
) {
    try {
        // 현재 인증된 사용자 확인
        const user = await currentUser()
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: '로그인이 필요합니다.'
                    }
                },
                { status: 401 }
            )
        }

        // 요청 데이터 파싱
        const { content } = await request.json()

        // 입력값 검증
        if (!content || content.length > 500) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_CONTENT',
                        message: '댓글 내용이 누락되었거나 너무 깁니다.'
                    }
                },
                { status: 400 }
            )
        }

        // 댓글 저장
        const [newComment] = await db
            .insert(comments)
            .values({
                postId: parseInt(params.postId),
                userId: user.id,
                content,
                createdAt: new Date()
            })
            .returning()

        // 응답 데이터 포맷팅
        const formattedComment = {
            id: newComment.id.toString(),
            postId: newComment.postId.toString(),
            userName: user.username || user.firstName || 'Unknown User',
            userProfile: user.imageUrl,
            content: newComment.content,
            createdAt: newComment.createdAt.toISOString()
        }

        return NextResponse.json({
            success: true,
            comment: formattedComment
        })
    } catch (error) {
        console.error('Comment creation error:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'COMMENT_CREATION_ERROR',
                    message: '댓글 작성 중 오류가 발생했습니다.'
                }
            },
            { status: 500 }
        )
    }
}
