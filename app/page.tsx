import { PromptInput } from '@/components/PromptInput'
import { CommunityFeedCard } from '@/components/CommunityFeedCard'
import { mockPosts } from '@/utils/mockData'

export default function Home() {
    return (
        <main className="container mx-auto px-4 py-8 space-y-12">
            {/* 프롬프트 입력 섹션 */}
            <section className="pt-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    AI로 상상을 현실로 만들어보세요
                </h1>
                <PromptInput />
            </section>

            {/* 커뮤니티 피드 섹션 */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">커뮤니티 피드</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {mockPosts.map(post => (
                        <CommunityFeedCard key={post.postId} post={post} />
                    ))}
                </div>
            </section>
        </main>
    )
}
