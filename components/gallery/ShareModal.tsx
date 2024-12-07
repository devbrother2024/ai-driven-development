'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useGalleryStore } from '@/store/gallery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TagInput } from '@/components/ui/tag-input'
import { X } from 'lucide-react'
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
    imageUrl: string
    prompt?: string
}

export default function ShareModal({
    isOpen,
    onClose,
    imageId,
    currentTags,
    imageUrl,
    prompt = '생성된 이미지'
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
            <DialogContent className="max-w-4xl p-0 gap-0 bg-gray-900/95 border-purple-600/20 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row h-[80vh] md:h-[70vh]">
                    {/* 이미지 프리뷰 섹션 */}
                    <div className="relative flex-1 bg-black/50">
                        <img
                            src={imageUrl}
                            alt={prompt}
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                        {/* 이미지 로딩 중이나 오류 시 보여줄 fallback */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            {prompt}
                        </div>
                    </div>

                    {/* 공유 설정 섹션 */}
                    <div className="w-full md:w-96 flex flex-col bg-gray-900/50 border-l border-purple-600/10">
                        {/* 닫기 버튼 */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* 헤더 */}
                        <div className="p-6 border-b border-purple-600/10">
                            <h2 className="text-lg font-semibold text-purple-300">
                                커뮤니티에 공유하기
                            </h2>
                        </div>

                        {/* 콘텐츠 */}
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-grow">
                                {/* 제목 입력 */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="title"
                                        className="text-sm font-medium text-purple-400"
                                    >
                                        제목
                                    </Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="제목을 입력하세요"
                                        className="h-9 bg-gray-800/50 border-purple-600/30 
                                                 text-purple-200 placeholder-gray-500"
                                    />
                                </div>

                                {/* 설명 입력 */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="description"
                                        className="text-sm font-medium text-purple-400"
                                    >
                                        설명
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={e =>
                                            setDescription(e.target.value)
                                        }
                                        placeholder="설명을 입력하세요"
                                        className="min-h-[120px] bg-gray-800/50 
                                                 border-purple-600/30 text-purple-200 
                                                 placeholder-gray-500"
                                    />
                                </div>

                                {/* 태그 입력 */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-purple-400">
                                        태그
                                    </Label>
                                    <TagInput
                                        value={tags}
                                        onChange={setTags}
                                        placeholder="태그를 입력하고 Enter를 누르세요"
                                        className="bg-gray-800/50 border-purple-600/30 
                                                 text-purple-200"
                                    />
                                </div>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="p-6 border-t border-purple-600/10 flex gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-purple-600/10 text-purple-400 
                                             hover:bg-purple-600/20 border-0"
                                >
                                    취소
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 
                                             text-white"
                                >
                                    {isSubmitting ? '공유 중...' : '공유하기'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
