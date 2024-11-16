'use client'

import { useState } from 'react'
import { GalleryCard } from './GalleryCard'
import { ImageDetailModal } from './ImageDetailModal'
import { ShareModal } from './ShareModal'
import { IGalleryImage } from '@/types'
import { mockGalleryImages } from '@/utils/mockData'

export function GalleryGrid() {
    const [selectedImage, setSelectedImage] = useState<IGalleryImage | null>(
        null
    )
    const [showShareModal, setShowShareModal] = useState(false)
    const [images] = useState<IGalleryImage[]>(mockGalleryImages)

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map(image => (
                    <GalleryCard
                        key={image.id}
                        image={image}
                        onImageClick={() => setSelectedImage(image)}
                        onShareClick={() => {
                            setSelectedImage(image)
                            setShowShareModal(true)
                        }}
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

            {showShareModal && selectedImage && (
                <ShareModal
                    image={selectedImage}
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </>
    )
}
