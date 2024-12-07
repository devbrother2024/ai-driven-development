'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle } from 'lucide-react'
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
                className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={handleClick}
            >
                {/* 이미지 */}
                <div className="relative aspect-square">
                    <Image
                        src={post.imageURL}
                        alt={post.prompt || '생성된 이미지'}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* 하단 정보 */}
                <div className="p-4 space-y-4">
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={post.userProfile} />
                            <AvatarFallback>{post.userName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                            {post.userName}
                        </span>
                    </div>

                    {/* 상호작용 */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={handleLikeClick}
                            disabled={isLoading}
                        >
                            <Heart
                                className={`transition-colors ${
                                    isLiked ? 'fill-red-500 text-red-500' : ''
                                }`}
                            />
                            <span>{likeCount}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={handleCommentsClick}
                        >
                            <MessageCircle />
                            <span>{post.comments}</span>
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
