'use client'

import { IPost } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { CommentsModal } from './CommentsModal'

interface ICommunityFeedCardProps {
    post: IPost
}

export function CommunityFeedCard({
    post: initialPost
}: ICommunityFeedCardProps) {
    const [post, setPost] = useState(initialPost)
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault() // Link 컴포넌트의 기본 동작 방지
        setPost(prev => ({
            ...prev,
            likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
            isLiked: !prev.isLiked
        }))
    }

    const handleCommentsClick = (e: React.MouseEvent) => {
        e.preventDefault() // Link 컴포넌트의 기본 동작 방지
        setIsCommentsOpen(true)
    }

    return (
        <>
            <Link href={`/post/${post.postId}`}>
                <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
                    <div className="relative aspect-square">
                        <Image
                            src={post.imageURL}
                            alt="Generated Image"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">{post.userName}</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleLikeClick}
                                    className="flex items-center gap-1"
                                >
                                    <Heart
                                        size={16}
                                        className={
                                            post.isLiked
                                                ? 'fill-red-500 text-red-500'
                                                : ''
                                        }
                                    />
                                    <span className="text-sm">
                                        {post.likes}
                                    </span>
                                </button>
                                <button
                                    onClick={handleCommentsClick}
                                    className="flex items-center gap-1"
                                >
                                    <MessageCircle size={16} />
                                    <span className="text-sm">
                                        {post.comments}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
            <CommentsModal
                postId={post.postId}
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
            />
        </>
    )
}
