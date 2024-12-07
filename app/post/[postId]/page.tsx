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
        <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
            <Suspense fallback={<PostDetailSkeleton />}>
                <PostDetail postId={params.postId} />
            </Suspense>
        </main>
    )
}

function PostDetailSkeleton() {
    return (
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8">
            {/* 이미지 영역 */}
            <div className="flex-1">
                <Skeleton className="w-full aspect-square rounded-lg" />
            </div>

            {/* 상세 정보 영역 */}
            <div className="flex-1 flex flex-col gap-6">
                {/* 작성자 정보 */}
                <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="w-32 h-6" />
                </div>

                {/* 제목 */}
                <Skeleton className="w-3/4 h-8" />

                {/* 설명 */}
                <Skeleton className="w-full h-24" />

                {/* 프롬프트 */}
                <Skeleton className="w-full h-16" />

                {/* 상호작용 버튼 */}
                <div className="flex gap-4">
                    <Skeleton className="w-24 h-10" />
                    <Skeleton className="w-24 h-10" />
                </div>
            </div>
        </div>
    )
}
