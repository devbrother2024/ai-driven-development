import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { GalleryFilters } from '@/components/gallery/GalleryFilters'

export default function GalleryPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">내 갤러리</h1>
                <GalleryFilters />
            </div>
            <GalleryGrid />
        </div>
    )
}
