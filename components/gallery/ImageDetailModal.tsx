'use client'

import { useEffect } from 'react'
import { useGalleryStore } from '@/store/gallery'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IGalleryImage } from '@/types'
import { useState } from 'react'
import { X, Plus, Download, Share2 } from 'lucide-react'

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
            <DialogContent className="max-w-4xl p-0 gap-0 bg-gray-900/95 border-purple-600/20 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row h-[80vh] md:h-[70vh]">
                    {/* 이미지 섹션 */}
                    <div className="relative flex-1 bg-black/50">
                        <img
                            src={image.imageUrl}
                            alt={image.prompt}
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                    </div>

                    {/* 상세 정보 섹션 */}
                    <div className="w-full md:w-96 flex flex-col bg-gray-900/50 border-l border-purple-600/10">
                        {/* 닫기 버튼 */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* 콘텐츠 */}
                        <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-grow">
                            {/* 프롬프트 섹션 */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-purple-400">
                                    프롬프트
                                </h3>
                                <p className="text-gray-200">{image.prompt}</p>
                            </div>

                            {/* 스타일 섹션 */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-purple-400">
                                    스타일 옵션
                                </h3>
                                <div className="grid gap-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-400">
                                            아트 스타일
                                        </span>
                                        <span className="text-sm text-purple-300">
                                            {image.styleOptions.artStyle}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-400">
                                            색상 톤
                                        </span>
                                        <span className="text-sm text-purple-300">
                                            {image.styleOptions.colorTone}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 태그 섹션 */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-purple-400">
                                    태그
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-purple-600/20 
                                                     text-purple-300 rounded-full text-sm 
                                                     flex items-center gap-1 group"
                                        >
                                            {tag}
                                            <button
                                                onClick={() =>
                                                    handleRemoveTag(tag)
                                                }
                                                className="text-purple-400/60 
                                                         group-hover:text-purple-300 
                                                         transition-colors"
                                                type="button"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={e =>
                                            setNewTag(e.target.value)
                                        }
                                        placeholder="새 태그 추가"
                                        onKeyPress={handleKeyPress}
                                        className="flex-1 h-9 bg-gray-800/50 
                                                 border-purple-600/30 text-purple-200 
                                                 placeholder-gray-500"
                                    />
                                    <Button
                                        onClick={handleAddTag}
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-9 px-3 text-purple-300 
                                                 hover:text-purple-200 
                                                 hover:bg-purple-600/30"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="p-6 border-t border-purple-600/10 flex gap-2">
                            <Button
                                onClick={handleSave}
                                type="button"
                                variant="secondary"
                                className="flex-1 bg-purple-600/10 text-purple-400 
                                         hover:bg-purple-600/20 border-0"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                저장
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-1 bg-purple-600/10 text-purple-400 
                                         hover:bg-purple-600/20 border-0"
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                공유
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
