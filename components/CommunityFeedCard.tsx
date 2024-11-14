import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { IPost, ICommunityFeedCardComment } from '@/types'
import { useState } from 'react'
import CommentModal from './CommentModal'
import { cn } from '@/lib/utils'

interface ICommunityFeedCardProps extends IPost {
    onLike: (postId: string) => void
    onAddComment: (postId: string, content: string) => void
}

// 임시 목업 댓글 데이터
const MOCK_COMMENTS: ICommunityFeedCardComment[] = [
    {
        id: '1',
        postId: '1',
        userName: '사용자1',
        content: '멋진 이미지네요!',
        createdAt: new Date().toISOString()
    }
    // ... 더 많은 목업 댓글
]

export default function CommunityFeedCard({
    postId,
    imageURL,
    userName,
    likes,
    comments,
    isLiked,
    onLike,
    onAddComment
}: ICommunityFeedCardProps) {
    const [isCommentOpen, setIsCommentOpen] = useState(false)

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault() // Link 컴포넌트의 기본 동작 방지
        onLike(postId)
    }

    const handleCommentClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsCommentOpen(true)
    }

    const handleAddComment = (content: string) => {
        onAddComment(postId, content)
    }

    return (
        <>
            <Link href={`/post/${postId}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0 relative aspect-square">
                        <Image
                            src={imageURL}
                            alt={`${userName}의 생성 이미지`}
                            fill
                            className="object-cover"
                        />
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between items-center">
                        <span className="font-medium">{userName}</span>
                        <div className="flex gap-4">
                            <button
                                onClick={handleLikeClick}
                                className="flex items-center gap-1"
                            >
                                <Heart
                                    className={cn('w-4 h-4', {
                                        'fill-red-500 text-red-500': isLiked
                                    })}
                                />
                                <span className="text-sm">{likes}</span>
                            </button>
                            <button
                                onClick={handleCommentClick}
                                className="flex items-center gap-1"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">{comments}</span>
                            </button>
                        </div>
                    </CardFooter>
                </Card>
            </Link>

            <CommentModal
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
                postId={postId}
                comments={MOCK_COMMENTS}
                onAddComment={handleAddComment}
            />
        </>
    )
}
