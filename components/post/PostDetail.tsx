'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react'
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

interface PostDetailProps {
    postId: string
}

export function PostDetail({ postId }: PostDetailProps) {
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        loadPostDetail()
    }, [postId])

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
                title: '���류',
                description: '게시물을 불러오는 중 오류가 발생했습니다.'
            })
        } finally {
            setLoading(false)
        }
    }

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

                    {/* 댓글 영역 - 추후 구현 */}
                    <div className="space-y-4">
                        <Input placeholder="댓글을 입력하세요..." />
                        <ScrollArea className="h-[200px]">
                            <div className="text-center text-muted-foreground py-8">
                                댓글 기능은 준비 중입니다.
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    )
}
