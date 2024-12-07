'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { IComment, ICommentsModalProps } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'

export function CommentsModal({
    postId,
    isOpen,
    onClose
}: ICommentsModalProps) {
    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState<IComment[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const { toast } = useToast()

    // 댓글 목록 로드
    const loadComments = async () => {
        try {
            setLoading(true)
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
            setLoading(false)
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

    // 모달이 열릴 때 댓글 목록 로드
    useEffect(() => {
        if (isOpen) {
            loadComments()
        }
    }, [isOpen, postId])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-gray-900/95 border-purple-600/20 text-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                        댓글
                    </DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 mb-4">
                    <Input
                        placeholder="댓글을 입력하세요..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') handleAddComment()
                        }}
                        disabled={submitting}
                        className="bg-gray-900/50 border-purple-600/30 text-gray-200 
                                 placeholder-gray-400 focus:border-purple-500 
                                 focus:ring-purple-500/30"
                    />
                    <Button
                        onClick={handleAddComment}
                        disabled={submitting}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            '작성'
                        )}
                    </Button>
                </div>
                <ScrollArea className="h-[300px] pr-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                        </div>
                    ) : comments.length > 0 ? (
                        comments.map(comment => (
                            <div
                                key={comment.id}
                                className="mb-4 p-3 bg-gray-800/50 border border-purple-600/20 
                                         backdrop-blur-sm rounded-lg hover:bg-gray-800/70 
                                         transition-colors"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Avatar className="w-6 h-6 ring-2 ring-purple-600/30">
                                        <AvatarImage
                                            src={comment.userProfile}
                                        />
                                        <AvatarFallback className="bg-purple-600/20 text-gray-200">
                                            {comment.userName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex justify-between items-center w-full">
                                        <span className="font-medium text-sm text-gray-200">
                                            {comment.userName}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(
                                                comment.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm pl-8 text-gray-300">
                                    {comment.content}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-full text-gray-400">
                            아직 댓글이 없습니다.
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
