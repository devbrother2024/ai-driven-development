'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { getMockPostDetail, mockComments } from '@/utils/mockData'
import { IPost, IComment } from '@/types'
import Link from 'next/link'

export default function PostDetail() {
    const params = useParams()
    const postId = params.postId as string
    const [post, setPost] = useState<IPost | null>(null)
    const [comments, setComments] = useState<IComment[]>([])
    const [newComment, setNewComment] = useState('')

    useEffect(() => {
        // 실제로는 API 호출
        const postData = getMockPostDetail(postId)
        setPost(postData)
        setComments(mockComments)
    }, [postId])

    const handleLike = () => {
        if (!post) return
        setPost(prev => {
            if (!prev) return prev
            return {
                ...prev,
                likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
                isLiked: !prev.isLiked
            }
        })
    }

    const handleAddComment = () => {
        if (!newComment.trim() || !post) return

        const comment: IComment = {
            id: Date.now().toString(),
            postId: post.postId,
            userName: '현재사용자',
            content: newComment,
            createdAt: new Date().toLocaleString(),
            userProfile: 'https://picsum.photos/50/50?random=999'
        }

        setComments(prev => [comment, ...prev])
        setNewComment('')
    }

    if (!post) return null

    return (
        <main className="container mx-auto px-4 py-8 max-w-5xl">
            <Link
                href="/"
                className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft size={20} />
                <span>돌아가기</span>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 이미지 섹션 */}
                <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                        src={post.imageURL}
                        alt="Generated Image"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* 상세 정보 섹션 */}
                <div className="space-y-6">
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={post.userProfile} />
                            <AvatarFallback>{post.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-medium">{post.userName}</h2>
                            <p className="text-sm text-muted-foreground">
                                {post.createdAt}
                            </p>
                        </div>
                    </div>

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
                            onClick={handleLike}
                        >
                            <Heart
                                size={20}
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
                            <MessageCircle size={20} />
                            <span>{comments.length}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Share2 size={20} />
                            <span>공유</span>
                        </Button>
                    </div>

                    {/* 댓글 섹션 */}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="댓글을 입력하세요..."
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') handleAddComment()
                                }}
                            />
                            <Button onClick={handleAddComment}>작성</Button>
                        </div>
                        <ScrollArea className="h-[300px]">
                            {comments.map(comment => (
                                <div
                                    key={comment.id}
                                    className="flex gap-3 mb-4 p-3 bg-muted rounded-lg"
                                >
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage
                                            src={comment.userProfile}
                                        />
                                        <AvatarFallback>
                                            {comment.userName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-sm">
                                                {comment.userName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {comment.createdAt}
                                            </span>
                                        </div>
                                        <p className="text-sm">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </main>
    )
}
