import { Suspense } from 'react'
import { PostDetail } from '@/components/post/PostDetail'
import { Skeleton } from '@/components/ui/skeleton'

interface PostPageProps {
    params: {
        postId: string
    }
}

export default function PostPage({ params }: PostPageProps) {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-6 py-24">
                <Suspense fallback={<PostDetailSkeleton />}>
                    <PostDetail postId={params.postId} />
                </Suspense>
            </div>
        </main>
    )
}

function PostDetailSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="h-8 mb-8" /> {/* 돌아가기 버튼 공간 */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* 이미지 영역 */}
                <div className="flex-1">
                    <Skeleton className="w-full aspect-square rounded-lg bg-gray-800/50" />
                </div>

                {/* 상세 정보 영역 */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-full bg-gray-800/50" />
                        <Skeleton className="w-32 h-6 bg-gray-800/50" />
                    </div>

                    {/* 제목 */}
                    <Skeleton className="w-3/4 h-8 bg-gray-800/50" />

                    {/* 설명 */}
                    <Skeleton className="w-full h-24 bg-gray-800/50" />

                    {/* 프롬프트 */}
                    <Skeleton className="w-full h-16 bg-gray-800/50" />

                    {/* 상호작용 버튼 */}
                    <div className="flex gap-4">
                        <Skeleton className="w-24 h-10 bg-gray-800/50" />
                        <Skeleton className="w-24 h-10 bg-gray-800/50" />
                    </div>
                </div>
            </div>
        </div>
    )
}
