'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IPostDetail, IComment } from '@/types'
import {
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    MoreHorizontal
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

// 목업 데이터
const MOCK_POST_DETAIL: IPostDetail = {
    postId: '1',
    imageURL: 'https://picsum.photos/800/800',
    userName: '창작자1',
    author: {
        id: '1',
        name: '창작자1',
        profileImage: 'https://picsum.photos/50/50'
    },
    likes: 150,
    comments: 23,
    scraps: 45,
    isLiked: false,
    isScrapped: false,
    prompt: '우주를 여행하는 고양이, 디지털 아트',
    styleOptions: {
        style: '디지털 아트',
        mood: '환상적인',
        lighting: '네온'
    },
    createdAt: '2024-03-15T12:00:00Z'
}

const MOCK_COMMENTS: IComment[] = [
    {
        id: '1',
        postId: '1',
        author: {
            id: '2',
            name: '사용자1',
            profileImage: 'https://picsum.photos/51/51'
        },
        content: '정말 멋진 작품이네요! 프롬프트도 너무 독특해요.',
        createdAt: '2024-03-15T12:30:00Z'
    },
    {
        id: '2',
        postId: '1',
        author: {
            id: '3',
            name: '사용자2',
            profileImage: 'https://picsum.photos/52/52'
        },
        content: '고양이의 표정이 너무 귀여워요!',
        createdAt: '2024-03-15T13:00:00Z',
        parentId: '1' // 답글 예시
    }
]

export default function PostDetail({ params }: { params: { postId: string } }) {
    const [post, setPost] = useState<IPostDetail>(MOCK_POST_DETAIL)
    const [comments, setComments] = useState<IComment[]>(MOCK_COMMENTS)
    const [newComment, setNewComment] = useState('')
    const [replyTo, setReplyTo] = useState<string | null>(null)
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
        null
    )
    const [editContent, setEditContent] = useState('')

    const handleLike = () => {
        setPost(prev => ({
            ...prev,
            likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
            isLiked: !prev.isLiked
        }))
    }

    const handleScrap = () => {
        setPost(prev => ({
            ...prev,
            scraps: prev.isScrapped ? prev.scraps - 1 : prev.scraps + 1,
            isScrapped: !prev.isScrapped
        }))
    }

    const handleShare = async () => {
        try {
            await navigator.share({
                title: post.prompt,
                text: `${post.author.name}님의 AI 생성 이미지`,
                url: window.location.href
            })
        } catch (error) {
            console.log('공유하기 실패')
        }
    }

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        const newCommentObj: IComment = {
            id: `${Date.now()}`,
            postId: post.postId,
            author: {
                id: 'current-user',
                name: '현재 사용자',
                profileImage: 'https://picsum.photos/53/53'
            },
            content: newComment,
            createdAt: new Date().toISOString(),
            parentId: replyTo || undefined
        }

        setComments(prev => [...prev, newCommentObj])
        setPost(prev => ({ ...prev, comments: prev.comments + 1 }))
        setNewComment('')
        setReplyTo(null)
    }

    const handleEditComment = (commentId: string, newContent: string) => {
        setComments(prev =>
            prev.map(comment =>
                comment.id === commentId
                    ? { ...comment, content: newContent }
                    : comment
            )
        )
        setEditingCommentId(null)
    }

    const handleDeleteComment = (commentId: string) => {
        setComments(prev => prev.filter(comment => comment.id !== commentId))
        setPost(prev => ({ ...prev, comments: prev.comments - 1 }))
    }

    const isCommentAuthor = (authorId: string) => authorId === 'current-user'

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* 이미지 섹션 */}
                <div className="relative aspect-square w-full">
                    <Image
                        src={post.imageURL}
                        alt={post.prompt}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="p-6 space-y-6">
                    {/* 작성자 정보 및 상호작용 버튼 */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    src={post.author.profileImage}
                                    alt={post.author.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-medium">
                                    {post.author.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(
                                        post.createdAt
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-2"
                            >
                                <Heart
                                    className={cn('w-6 h-6 transition-colors', {
                                        'fill-red-500 text-red-500':
                                            post.isLiked
                                    })}
                                />
                                <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2">
                                <MessageCircle className="w-6 h-6" />
                                <span>{post.comments}</span>
                            </button>
                            <button
                                onClick={handleScrap}
                                className="flex items-center gap-2"
                            >
                                <Bookmark
                                    className={cn('w-6 h-6 transition-colors', {
                                        'fill-yellow-500 text-yellow-500':
                                            post.isScrapped
                                    })}
                                />
                                <span>{post.scraps}</span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2"
                            >
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* 프롬프트 및 스타일 정보 */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <h3 className="font-medium mb-2">프롬프트</h3>
                            <p className="text-gray-700">{post.prompt}</p>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">스타일 옵션</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <span className="text-gray-500">
                                        스타일:
                                    </span>{' '}
                                    {post.styleOptions.style}
                                </div>
                                <div>
                                    <span className="text-gray-500">
                                        분위기:
                                    </span>{' '}
                                    {post.styleOptions.mood}
                                </div>
                                <div>
                                    <span className="text-gray-500">조명:</span>{' '}
                                    {post.styleOptions.lighting}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 댓글 섹션 */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-lg">
                            댓글 {post.comments}개
                        </h3>

                        {/* 댓글 작성 폼 */}
                        <form
                            onSubmit={handleAddComment}
                            className="flex gap-2"
                        >
                            <Input
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder={
                                    replyTo
                                        ? '답글을 입력하세요'
                                        : '댓글을 입력하세요'
                                }
                            />
                            <Button type="submit" disabled={!newComment.trim()}>
                                작성
                            </Button>
                        </form>

                        {/* 댓글 목록 */}
                        <div className="space-y-4">
                            {comments.map(comment => (
                                <div
                                    key={comment.id}
                                    className={cn('p-4 bg-gray-50 rounded-lg', {
                                        'ml-8': comment.parentId // 답글인 경우 들여쓰기
                                    })}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                                <Image
                                                    src={
                                                        comment.author
                                                            .profileImage
                                                    }
                                                    alt={comment.author.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="font-medium">
                                                {comment.author.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(
                                                    comment.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {isCommentAuthor(comment.author.id) && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setEditingCommentId(
                                                                comment.id
                                                            )
                                                            setEditContent(
                                                                comment.content
                                                            )
                                                        }}
                                                    >
                                                        수정
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDeleteComment(
                                                                comment.id
                                                            )
                                                        }
                                                        className="text-red-500"
                                                    >
                                                        삭제
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                    {editingCommentId === comment.id ? (
                                        <form
                                            onSubmit={e => {
                                                e.preventDefault()
                                                handleEditComment(
                                                    comment.id,
                                                    editContent
                                                )
                                            }}
                                            className="flex gap-2"
                                        >
                                            <Input
                                                value={editContent}
                                                onChange={e =>
                                                    setEditContent(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <Button
                                                type="submit"
                                                disabled={!editContent.trim()}
                                            >
                                                수정
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setEditingCommentId(null)
                                                }
                                            >
                                                취소
                                            </Button>
                                        </form>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-gray-700">
                                                {comment.content}
                                            </p>
                                            {!comment.parentId && (
                                                <button
                                                    onClick={() =>
                                                        setReplyTo(comment.id)
                                                    }
                                                    className="text-sm text-gray-500 hover:text-gray-700"
                                                >
                                                    답글 달기
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
