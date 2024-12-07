'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { IPost } from '@/types'
import { useState } from 'react'
import { CommentsModal } from '@/components/CommentsModal'

interface CommunityFeedCardProps {
    post: IPost
}

export function CommunityFeedCard({ post }: CommunityFeedCardProps) {
    const router = useRouter()
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)

    const handleClick = () => {
        router.push(`/post/${post.postId}`)
    }

    const handleCommentsClick = (e: React.MouseEvent) => {
        e.stopPropagation() // 카드 클릭 이벤트 전파 방지
        setIsCommentsOpen(true)
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
                            onClick={e => {
                                e.stopPropagation() // 카드 클릭 이벤트 전파 방지
                                // 좋아요 기능 구현 예정
                            }}
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
