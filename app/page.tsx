import { Suspense } from 'react'
import { PromptInput } from '@/components/PromptInput'
import { CommunityFeed } from '@/components/CommunityFeed'
import { Skeleton } from '@/components/ui/skeleton'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-24 gap-8">
            <div className="w-full max-w-3xl">
                <PromptInput />
            </div>
            <Suspense fallback={<CommunityFeedSkeleton />}>
                <CommunityFeed />
            </Suspense>
        </main>
    )
}

function CommunityFeedSkeleton() {
    return (
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col gap-4 p-4 border rounded-lg"
                >
                    <Skeleton className="w-full h-48 rounded-lg" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="w-24 h-4" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="w-16 h-4" />
                        <Skeleton className="w-16 h-4" />
                    </div>
                </div>
            ))}
        </div>
    )
}
