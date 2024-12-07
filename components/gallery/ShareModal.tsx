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
                        : '알 수 없는 오류가 발생��습니다.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-gray-900/95 border-purple-600/20 text-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                        커뮤니티에 공유하기
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-200">
                            제목
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            className="bg-gray-900/50 border-purple-600/30 text-gray-200 
                                     placeholder-gray-400 focus:border-purple-500 
                                     focus:ring-purple-500/30"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-200">
                            설명
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="설명을 입력하세요"
                            className="bg-gray-900/50 border-purple-600/30 text-gray-200 
                                     placeholder-gray-400 focus:border-purple-500 
                                     focus:ring-purple-500/30 min-h-[100px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-200">태그</Label>
                        <TagInput
                            value={tags}
                            onChange={setTags}
                            placeholder="태그를 입력하고 Enter를 누르세요"
                            className="bg-gray-900/50 border-purple-600/30 text-gray-200"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="border-purple-600/30 text-gray-200 hover:bg-purple-600/20"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {isSubmitting ? '공유 중...' : '공유하기'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
