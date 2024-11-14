import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { IComment } from '@/types'
import { useState } from 'react'

interface ICommentModalProps {
    isOpen: boolean
    onClose: () => void
    postId: string
    comments: IComment[]
    onAddComment: (content: string) => void
}

export default function CommentModal({
    isOpen,
    onClose,
    postId,
    comments,
    onAddComment
}: ICommentModalProps) {
    const [newComment, setNewComment] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (newComment.trim()) {
            onAddComment(newComment)
            setNewComment('')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>댓글</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto space-y-4">
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            className="p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">
                                    {comment.userName}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(
                                        comment.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요"
                        className="flex-1"
                    />
                    <Button type="submit" disabled={!newComment.trim()}>
                        작성
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
