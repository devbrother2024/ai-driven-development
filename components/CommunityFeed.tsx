'use client'

import { useEffect, useState } from 'react'
import { IPost } from '@/types'
import { CommunityFeedCard } from '@/components/CommunityFeedCard'
import { Button } from '@/components/ui/button'
import { useInView } from 'react-intersection-observer'
import { Loader2 } from 'lucide-react'

async function getCommunityFeed(page: number = 1) {
    const response = await fetch(
        `/api/community/feed?page=${page}&limit=12&sortBy=latest`,
        { cache: 'no-store' }
    )
    if (!response.ok) {
        throw new Error('Failed to fetch community feed')
    }
    return response.json()
}

function CommunityFeed() {
    const [posts, setPosts] = useState<IPost[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [totalCount, setTotalCount] = useState(0)
    const { ref, inView } = useInView()

    useEffect(() => {
        loadPosts()
    }, [])

    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMorePosts()
        }
    }, [inView])

    const loadPosts = async () => {
        try {
            setLoading(true)
            const data = await getCommunityFeed()
            if (data.success) {
                setPosts(data.posts)
                setTotalCount(data.totalCount)
                setHasMore(data.hasMore)
            } else {
                console.error('Failed to load posts:', data.error)
            }
        } catch (error) {
            console.error('Failed to load posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMorePosts = async () => {
        if (loading || !hasMore) return

        try {
            setLoading(true)
            const nextPage = page + 1
            const data = await getCommunityFeed(nextPage)
            if (data.success) {
                setPosts(prev => [...prev, ...data.posts])
                setHasMore(data.hasMore)
                setPage(nextPage)
            } else {
                console.error('Failed to load more posts:', data.error)
            }
        } catch (error) {
            console.error('Failed to load more posts:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="w-full max-w-7xl text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">커뮤니티 피드</h2>
                <p className="text-muted-foreground">
                    아직 공유된 이미지가 없습니다.
                </p>
            </div>
        )
    }

    return (
        <section className="w-full max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">커뮤니티 피드</h2>
                <p className="text-muted-foreground">
                    총 {totalCount}개의 이미지
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post: IPost) => (
                    <CommunityFeedCard key={post.postId} post={post} />
                ))}
            </div>
            {hasMore && (
                <div ref={ref} className="flex justify-center mt-8">
                    {loading ? (
                        <Button variant="outline" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            로딩 중...
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={loadMorePosts}>
                            더 보기
                        </Button>
                    )}
                </div>
            )}
        </section>
    )
}

export { CommunityFeed }