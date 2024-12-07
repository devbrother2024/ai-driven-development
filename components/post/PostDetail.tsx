'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface Post {
    postId: string
    imageURL: string
    userName: string
    userProfile: string
    title: string
    description: string
    likes: number
    comments: number
    isLiked: boolean
    prompt: string
    createdAt: string
}

interface Comment {
    id: string
    postId: string
    userName: string
    userProfile: string
    content: string
    createdAt: string
}

interface PostDetailProps {
    postId: string
}

export function PostDetail({ postId }: PostDetailProps) {
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState<Comment[]>([])
    const [loadingComments, setLoadingComments] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const { toast } = useToast()

    // 게시물 상세 정보 로드
    const loadPostDetail = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/post/${postId}`)
            const data = await response.json()

            if (data.success) {
                setPost(data.post)
            } else {
                toast({
                    variant: 'destructive',
                    title: '오류',
                    description: data.error.message
                })
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: '오류',
                description: '게시물을 불러오는 중 오류가 발생했습니다.'
            })
        } finally {
            setLoading(false)
        }
    }

    // 댓글 목록 로드
    const loadComments = async () => {
        try {
            setLoadingComments(true)
            const response = await fetch(`/api/post/${postId}/comments`)
            const data = await response.json()

            if (data.success) {
                setComments(data.comments)
            } else {
                toast({
                    variant: 'destructive',
                    title: '오류',
                    description: data.error.message
                })
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: '오류',
                description: '댓글을 불러오는 중 오류가 발생했습니다.'
            })
        } finally {
            setLoadingComments(false)
        }
    }

    // 댓글 작성
    const handleAddComment = async () => {
        if (!newComment.trim() || submitting) return

        try {
            setSubmitting(true)
            const response = await fetch(`/api/post/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newComment })
            })

            const data = await response.json()

            if (data.success) {
                setComments(prev => [data.comment, ...prev])
                setNewComment('')
                // 댓글 수 업데이트
                if (post) {
                    setPost({
                        ...post,
                        comments: post.comments + 1
                    })
                }
                toast({
                    title: '성공',
                    description: '댓글이 작성되었습니다.'
                })
            } else {
                toast({
                    variant: 'destructive',
                    title: '오류',
                    description: data.error.message
                })
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: '오류',
                description: '댓글 작성 중 오류가 발생했습니다.'
            })
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        loadPostDetail()
        loadComments()
    }, [postId])

    if (loading || !post) {
        return null // Suspense의 fallback이 표시됨
    }

    return (
        <div className="w-full max-w-7xl">
            <Link
                href="/"
                className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>돌아가기</span>
            </Link>

            <div className="flex flex-col md:flex-row gap-8">
                {/* 이미지 영역 */}
                <div className="flex-1">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                            src={post.imageURL}
                            alt={post.title || '생성된 이미지'}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* 상세 정보 영역 */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={post.userProfile} />
                            <AvatarFallback>{post.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-medium">{post.userName}</h2>
                            <p className="text-sm text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* 제목과 설명 */}
                    {post.title && (
                        <h1 className="text-2xl font-bold">{post.title}</h1>
                    )}
                    {post.description && (
                        <p className="text-muted-foreground">
                            {post.description}
                        </p>
                    )}

                    {/* 프롬프트 */}
                    <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">프롬프트</h3>
                        <p className="text-sm">{post.prompt}</p>
                    </div>

                    {/* 상호작용 버튼 */}
                    <div className="flex gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Heart
                                className={
                                    post.isLiked
                                        ? 'fill-red-500 text-red-500'
                                        : ''
                                }
                            />
                            <span>{post.likes}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <MessageCircle />
                            <span>{post.comments}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Share2 />
                            <span>공유</span>
                        </Button>
                    </div>

                    {/* 댓글 영역 */}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="댓글을 입력하세요..."
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') handleAddComment()
                                }}
                                disabled={submitting}
                            />
                            <Button
                                onClick={handleAddComment}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    '작성'
                                )}
                            </Button>
                        </div>
                        <ScrollArea className="h-[300px]">
                            {loadingComments ? (
                                <div className="flex justify-center items-center h-[200px]">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : comments.length > 0 ? (
                                comments.map(comment => (
                                    <div
                                        key={comment.id}
                                        className="mb-4 p-3 bg-muted rounded-lg"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarImage
                                                    src={comment.userProfile}
                                                />
                                                <AvatarFallback>
                                                    {comment.userName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex justify-between items-center w-full">
                                                <span className="font-medium text-sm">
                                                    {comment.userName}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        comment.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm pl-8">
                                            {comment.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-center items-center h-[200px] text-muted-foreground">
                                    아직 댓글이 없습니다.
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    )
}
