import GalleryGrid from '@/components/gallery/GalleryGrid'
import GalleryFilters from '@/components/gallery/GalleryFilters'

export default function GalleryPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-6 py-24">
                <div className="mb-8">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-purple-600/30 blur-3xl rounded-full" />
                        <h1 className="text-4xl font-bold relative bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                            내 갤러리
                        </h1>
                    </div>
                    <GalleryFilters />
                </div>
                <GalleryGrid />
            </div>
        </main>
    )
}
