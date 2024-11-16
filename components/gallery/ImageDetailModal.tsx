'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { IGalleryImage, IImageDetailModalProps } from '@/types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function ImageDetailModal({
    image,
    isOpen,
    onClose
}: IImageDetailModalProps) {
    const [isPublic, setIsPublic] = useState(image.isPublic)
    const [tags, setTags] = useState(image.tags)
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 이미지 섹션 */}
                    <div className="relative aspect-square">
                        <Image
                            src={image.imageUrl}
                            alt={image.prompt}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>

                    {/* 정보 섹션 */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                프롬프트
                            </h3>
                            <p className="text-gray-600">{image.prompt}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                스타일 옵션
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-sm">
                                    <span className="font-medium">
                                        아트 스타일:
                                    </span>{' '}
                                    {image.styleOptions.artStyle}
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">색조:</span>{' '}
                                    {image.styleOptions.colorTone}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">태그</h3>
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
                                    onKeyPress={e =>
                                        e.key === 'Enter' && addTag()
                                    }
                                />
                                <Button onClick={addTag}>추가</Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="font-medium">공개 설정</span>
                            <Switch
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={onClose}>
                                취소
                            </Button>
                            <Button
                                onClick={() => {
                                    // 변경사항 저장 로직
                                    onClose()
                                }}
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
