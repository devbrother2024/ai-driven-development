'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useGalleryStore } from '@/store/gallery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TagInput } from '@/components/ui/tag-input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    imageId: string
    currentTags: string[]
}

export default function ShareModal({
    isOpen,
    onClose,
    imageId,
    currentTags
}: ShareModalProps) {
    const { toast } = useToast()
    const updateImage = useGalleryStore(state => state.updateImage)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState<string[]>(currentTags)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) {
            toast({
                variant: 'destructive',
                title: '제목을 입력해주세요.'
            })
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch('/api/community/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageId,
                    title: title.trim(),
                    description: description.trim(),
                    tags
                })
            })

            if (!response.ok) {
                throw new Error('공유하기에 실패했습니다.')
            }

            await updateImage(imageId, tags, true)

            toast({
                title: '성공적으로 공유되었습니다.',
                description: '커뮤니티에서 확인하실 수 있습니다.'
            })
            onClose()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: '오류가 발생했습니다.',
                description:
                    error instanceof Error
                        ? error.message
                        : '알 수 없는 오류가 발생했습니다.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>커뮤니티에 공유하기</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">제목</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">설명</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="설명을 입력하세요"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>태그</Label>
                        <TagInput
                            value={tags}
                            onChange={setTags}
                            placeholder="태그를 입력하고 Enter를 누르세요"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            취소
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? '공유 중...' : '공유하기'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
