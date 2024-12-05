'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useGalleryStore } from '@/store/gallery'
import { GalleryCard } from './GalleryCard'
import { ImageDetailModal } from './ImageDetailModal'
import { ShareModal } from './ShareModal'
import { IGalleryImage } from '@/types'

// 무한 스크롤을 위한 커스텀 훅
const useIntersection = (ref: React.RefObject<HTMLElement>) => {
    const [isIntersecting, setIntersecting] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting)
        })

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            observer.disconnect()
        }
    }, [ref])

    return isIntersecting
}

export default function GalleryGrid() {
    const {
        filteredImages,
        isLoading,
        error,
        hasMore,
        fetchImages,
        loadMoreImages,
        deleteImage
    } = useGalleryStore()

    const [selectedImage, setSelectedImage] = useState<IGalleryImage | null>(
        null
    )
    const [shareImage, setShareImage] = useState<IGalleryImage | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)

    // 무한 스크롤을 위한 ref와 intersection observer
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const isIntersecting = useIntersection(loadMoreRef)

    // 초기 데이터 로드
    useEffect(() => {
        fetchImages()
    }, [fetchImages])

    // 무한 스크롤
    useEffect(() => {
        if (isIntersecting && hasMore && !isLoading) {
            loadMoreImages()
        }
    }, [isIntersecting, hasMore, isLoading, loadMoreImages])

    const handleImageClick = useCallback((image: IGalleryImage) => {
        setSelectedImage(image)
        setIsDetailModalOpen(true)
    }, [])

    const handleShareClick = useCallback((image: IGalleryImage) => {
        setShareImage(image)
        setIsShareModalOpen(true)
    }, [])

    const handleDeleteClick = useCallback(
        async (imageId: string) => {
            if (window.confirm('이미지를 삭제하시겠습니까?')) {
                await deleteImage(imageId)
            }
        },
        [deleteImage]
    )

    if (error) {
        return (
            <div className="flex justify-center items-center h-48 text-red-500">
                {error}
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map(image => (
                    <GalleryCard
                        key={image.id}
                        image={image}
                        onImageClick={() => handleImageClick(image)}
                        onShareClick={() => handleShareClick(image)}
                        onDelete={() => handleDeleteClick(image.id)}
                    />
                ))}
            </div>

            {/* 로딩 상태 표시 */}
            {isLoading && (
                <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            )}

            {/* 무한 스크롤을 위한 관찰 대상 */}
            <div ref={loadMoreRef} className="h-4 mt-4" />

            {/* 상세 모달 */}
            <ImageDetailModal
                image={selectedImage}
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setSelectedImage(null)
                }}
            />

            {/* 공유 모달 */}
            {shareImage && (
                <ShareModal
                    image={shareImage}
                isOpen={isShareModalOpen}
                onClose={() => {
                    setIsShareModalOpen(false)
                    setShareImage(null)
                    }}
                />
            )}
        </div>
    )
}
