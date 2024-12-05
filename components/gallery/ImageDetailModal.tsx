'use client'

import { useEffect } from 'react'
import { useGalleryStore } from '@/store/gallery'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IGalleryImage } from '@/types'
import { useState } from 'react'

interface ImageDetailModalProps {
    image: IGalleryImage | null
    isOpen: boolean
    onClose: () => void
}

export function ImageDetailModal({
    image,
    isOpen,
    onClose
}: ImageDetailModalProps) {
    const { updateImage } = useGalleryStore()
    const [tags, setTags] = useState<string[]>([])
    const [newTag, setNewTag] = useState('')

    // 이미지가 변경될 때마다 태그 업데이트
    useEffect(() => {
        if (image) {
            setTags(image.tags)
        }
    }, [image])

    const handleAddTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag])
            setNewTag('')
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleSave = async () => {
        if (image) {
            await updateImage(image.id, tags, image.isPublic)
            onClose()
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddTag()
        }
    }

    if (!image) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 이미지 섹션 */}
                    <div className="relative aspect-square">
                        <img
                            src={image.imageUrl}
                            alt={image.prompt}
                            className="object-cover rounded-lg w-full h-full"
                        />
                    </div>

                    {/* 정보 섹션 */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold">프롬프트</h3>
                            <p className="text-sm text-gray-600">
                                {image.prompt}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">스타일 옵션</h3>
                            <p className="text-sm text-gray-600">
                                아트 스타일: {image.styleOptions.artStyle}
                                <br />
                                색상 톤: {image.styleOptions.colorTone}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">태그</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="text-gray-500 hover:text-red-500"
                                            type="button"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    placeholder="새 태그 추가"
                                    onKeyPress={handleKeyPress}
                                />
                                <Button onClick={handleAddTag} type="button">
                                    추가
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                type="button"
                            >
                                취소
                            </Button>
                            <Button onClick={handleSave} type="button">
                                저장
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
