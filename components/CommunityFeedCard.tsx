'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { IPost } from '@/types'
import { useState } from 'react'
import { CommentsModal } from '@/components/CommentsModal'
import { useToast } from '@/hooks/use-toast'

interface CommunityFeedCardProps {
    post: IPost
}

export function CommunityFeedCard({ post }: CommunityFeedCardProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [isLiked, setIsLiked] = useState(post.isLiked)
    const [likeCount, setLikeCount] = useState(post.likes)
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = () => {
        router.push(`/post/${post.postId}`)
    }

    const handleCommentsClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsCommentsOpen(true)
    }

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.stopPropagation()

        if (isLoading) return // 이전 요청이 진행 중이면 중복 요청 방지

        try {
            setIsLoading(true)

            const response = await fetch(`/api/post/${post.postId}/like`, {
                method: 'POST'
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error?.message || '좋아요 처리 중 오류가 발생했습니다.'
                )
            }

            // 좋아요 상태와 카운트 업데이트
            setIsLiked(data.isLiked)
            setLikeCount(data.likes)

            // 전역 상태 갱신을 위해 router.refresh() 호출
            router.refresh()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: '오류 발생',
                description:
                    error instanceof Error
                        ? error.message
                        : '좋아요 처리 중 오류가 발생했습니다.'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div
                className="overflow-hidden rounded-xl border border-purple-600/10 
                         bg-gradient-to-b from-gray-900/90 to-gray-950/90 
                         shadow-lg"
            >
                <div
                    className="group relative aspect-square overflow-hidden cursor-pointer"
                    onClick={handleClick}
                >
                    <Image
                        src={post.imageURL}
                        alt={post.prompt || '생성된 이미지'}
                        fill
                        className="object-cover transition-transform duration-500 
                                 group-hover:scale-105"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-gray-950 
                                  via-transparent to-transparent opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-gray-950/40 
                                  via-transparent to-transparent"
                    />

                    <div
                        className="absolute inset-0 ring-1 ring-inset ring-white/10 
                                 group-hover:ring-purple-600/20 transition-all duration-300"
                    />
                </div>

                <div className="p-4 space-y-4 backdrop-blur-sm bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar
                                className="w-9 h-9 ring-2 ring-purple-600/30 
                                           shadow-lg"
                            >
                                <AvatarImage src={post.userProfile} />
                                <AvatarFallback
                                    className="bg-purple-600/20 
                                             text-purple-300"
                                >
                                    {post.userName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span
                                className="font-medium text-sm text-gray-100 
                                         tracking-wide"
                            >
                                {post.userName}
                            </span>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-300 hover:text-purple-300 
                                   hover:bg-purple-600/20 transition-colors"
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-2 transition-all
                                    hover:bg-purple-600/20
                                    ${
                                        isLiked
                                            ? 'text-purple-300'
                                            : 'text-gray-300'
                                    }`}
                            onClick={handleLikeClick}
                            disabled={isLoading}
                        >
                            <Heart
                                className={`transition-all duration-300
                                        ${
                                            isLiked
                                                ? 'fill-purple-300 scale-110'
                                                : ''
                                        }`}
                            />
                            <span className="font-medium">{likeCount}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-gray-300 
                                   hover:text-purple-300 hover:bg-purple-600/20"
                            onClick={handleCommentsClick}
                        >
                            <MessageCircle />
                            <span className="font-medium">{post.comments}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <CommentsModal
                postId={post.postId}
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
            />
        </>
    )
}
