'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { IComment, ICommentsModalProps } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'

export function CommentsModal({
    postId,
    isOpen,
    onClose
}: ICommentsModalProps) {
    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState<IComment[]>([
        {
            id: '1',
            postId: postId,
            userName: '댓글러1',
            content: '정말 멋진 작품이네요!',
            createdAt: '2024-03-20 10:00'
        },
        {
            id: '2',
            postId: postId,
            userName: '댓글러2',
            content: '어떤 프롬프트를 사용하셨나요?',
            createdAt: '2024-03-20 11:30'
        }
    ])

    const handleAddComment = () => {
        if (!newComment.trim()) return

        const comment: IComment = {
            id: Date.now().toString(),
            postId,
            userName: '현재사용자', // 실제로는 로그인된 사용자 정보를 사용
            content: newComment,
            createdAt: new Date().toLocaleString()
        }

        setComments(prev => [comment, ...prev])
        setNewComment('')
    }

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
                    />
                    <Button onClick={handleAddComment}>작성</Button>
                </div>
                <ScrollArea className="h-[300px] pr-4">
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            className="mb-4 p-3 bg-muted rounded-lg"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">
                                    {comment.userName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {comment.createdAt}
                                </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
