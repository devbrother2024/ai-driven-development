'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { IGalleryImage, IShareModalProps } from '@/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function ShareModal({ image, isOpen, onClose }: IShareModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
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

    const handleShare = () => {
        // 공유 로직 구현
        onClose()
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
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">설명</label>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="게시물에 대한 설명을 입력하세요"
                            rows={4}
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
                                onKeyPress={e => e.key === 'Enter' && addTag()}
                            />
                            <Button onClick={addTag}>추가</Button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={onClose}>
                            취소
                        </Button>
                        <Button onClick={handleShare}>공유하기</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
