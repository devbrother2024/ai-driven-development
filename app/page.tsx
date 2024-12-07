import { Suspense } from 'react'
import { PromptInput } from '@/components/PromptInput'
import { CommunityFeed } from '@/components/CommunityFeed'
import { Skeleton } from '@/components/ui/skeleton'

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_70%)] pointer-events-none" />

                <div className="container mx-auto px-6 py-16 relative">
                    <div className="text-center space-y-8 relative">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-purple-600/30 blur-3xl rounded-full" />
                            <h1 className="text-4xl md:text-6xl font-bold relative bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                                상상력을 현실로 바꾸는 AI
                            </h1>
                        </div>

                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            프롬프트만 입력하면 AI가 당신의 상상을 예술 작품으로
                            만들어드립니다.
                        </p>

                        <div className="max-w-3xl mx-auto relative">
                            <div className="absolute inset-0 bg-purple-600/10 blur-xl rounded-lg" />
                            <PromptInput />
                        </div>
                    </div>
                </div>
            </div>

            {/* Community Feed Section */}
            <div className="container mx-auto px-6 py-12">
                <Suspense fallback={<CommunityFeedSkeleton />}>
                    <CommunityFeed />
                </Suspense>
            </div>
        </main>
    )
}

function CommunityFeedSkeleton() {
    return (
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col gap-4 p-4 border border-purple-600/20 rounded-lg bg-gray-800/30 backdrop-blur-sm"
                >
                    <Skeleton className="w-full h-48 rounded-lg bg-gray-700/50" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-10 h-10 rounded-full bg-gray-700/50" />
                        <Skeleton className="w-24 h-4 bg-gray-700/50" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="w-16 h-4 bg-gray-700/50" />
                        <Skeleton className="w-16 h-4 bg-gray-700/50" />
                    </div>
                </div>
            ))}
        </div>
    )
}
