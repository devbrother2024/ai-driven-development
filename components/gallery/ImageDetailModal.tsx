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
    isShared?: boolean
}

export function ImageDetailModal({
    image,
    isOpen,
    onClose,
    isShared = false
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
            <DialogContent className="max-w-3xl bg-gray-900/95 border-purple-600/20 text-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 이미지 섹션 */}
                    <div className="relative aspect-square">
                        <img
                            src={image.imageUrl}
                            alt={image.prompt}
                            className="object-cover rounded-lg w-full h-full ring-2 ring-purple-600/20"
                        />
                    </div>

                    {/* 정보 섹션 */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                                프롬프트
                            </h3>
                            <p className="mt-2 text-sm text-gray-300">
                                {image.prompt}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                                스타일 옵션
                            </h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-300">
                                <p>
                                    아트 스타일: {image.styleOptions.artStyle}
                                </p>
                                <p>색상 톤: {image.styleOptions.colorTone}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                                태그
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-800/50 border border-purple-600/20 rounded-full text-sm text-gray-200 flex items-center gap-1"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                            type="button"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-3">
                                <Input
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    placeholder="새 태그 추가"
                                    onKeyPress={handleKeyPress}
                                    className="bg-gray-900/50 border-purple-600/30 text-gray-200 
                                             placeholder-gray-400 focus:border-purple-500 
                                             focus:ring-purple-500/30"
                                />
                                <Button
                                    onClick={handleAddTag}
                                    type="button"
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    추가
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                type="button"
                                className="border-purple-600/30 text-gray-200 hover:bg-purple-600/20"
                            >
                                취소
                            </Button>
                            <Button
                                onClick={handleSave}
                                type="button"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                저장
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
