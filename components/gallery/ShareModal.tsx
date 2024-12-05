'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { IShareModalProps } from '@/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export function ShareModal({ image, isOpen, onClose }: IShareModalProps) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState(image?.tags || [])
    const [newTag, setNewTag] = useState('')

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag])
            setNewTag('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleShare = async () => {
        if (!image) return

        try {
            setIsLoading(true)

            // 입력값 검증
            if (!title.trim()) {
                toast({
                    variant: 'destructive',
                    title: '제목을 입력해주세요.'
                })
                return
            }

            const response = await fetch('/api/community/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageId: image.id,
                    title: title.trim(),
                    description: description.trim(),
                    tags
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error.message || '공유에 실패했습니다.')
            }

            toast({
                title: '공유 완료',
                description: '커뮤니티에 성공적으로 공유되었습니다.'
            })

            onClose()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: '공유 실패',
                description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                        커뮤니티에 공유하기
                    </h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">제목</label>
                        <Input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="게시물 제목을 입력하세요"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">설명</label>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="게시물에 대한 설명을 입력하세요"
                            rows={4}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">태그</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="text-gray-500 hover:text-gray-700"
                                        disabled={isLoading}
                                        type="button"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newTag}
                                onChange={e => setNewTag(e.target.value)}
                                placeholder="새 태그 추가"
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                            <Button
                                onClick={addTag}
                                type="button"
                                disabled={isLoading}
                            >
                                추가
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button"
                            disabled={isLoading}
                        >
                            취소
                        </Button>
                        <Button
                            onClick={handleShare}
                            type="button"
                            disabled={isLoading}
                        >
                            {isLoading ? '공유 중...' : '공유하기'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
