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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>댓글</DialogTitle>
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
                    />
                    <Button onClick={handleAddComment} disabled={submitting}>
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
                        <div className="flex justify-center items-center h-full text-muted-foreground">
                            아직 댓글이 없습니다.
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
