'use client'

import { useState } from 'react'
import { GalleryCard } from './GalleryCard'
import { ImageDetailModal } from './ImageDetailModal'
import { ShareModal } from './ShareModal'
import { IGalleryImage } from '@/types'
import { useGalleryStore } from '@/store/gallery'
import { useToast } from '@/hooks/use-toast'

export function GalleryGrid() {
    const [selectedImage, setSelectedImage] = useState<IGalleryImage | null>(
        null
    )
    const [showShareModal, setShowShareModal] = useState(false)
    const [shareImage, setShareImage] = useState<IGalleryImage | null>(null)
    const { filteredImages, deleteImage } = useGalleryStore()
    const { toast } = useToast()

    const handleDelete = (imageId: string) => {
        deleteImage(imageId)
        toast({
            title: '이미지가 삭제되었습니다',
            description: '갤러리에서 이미지가 성공적으로 제거되었습니다.'
        })
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map(image => (
                    <GalleryCard
                        key={image.id}
                        image={image}
                        onImageClick={() => setSelectedImage(image)}
                        onShareClick={() => {
                            setShareImage(image)
                            setShowShareModal(true)
                        }}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {selectedImage && (
                <ImageDetailModal
                    image={selectedImage}
                    isOpen={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}

            {showShareModal && shareImage && (
                <ShareModal
                    image={shareImage}
                    isOpen={showShareModal}
                    onClose={() => {
                        setShowShareModal(false)
                        setShareImage(null)
                    }}
                />
            )}
        </>
    )
}
