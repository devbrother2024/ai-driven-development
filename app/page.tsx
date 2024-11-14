'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CommunityFeedCard from '@/components/CommunityFeedCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IPost } from '@/types'

// 목업 데이터에 isLiked 추가
const INITIAL_FEED_DATA: IPost[] = [
    {
        postId: '1',
        imageURL: 'https://picsum.photos/400/400',
        userName: '창작자1',
        likes: 150,
        comments: 23,
        isLiked: false
    },
    {
        postId: '2',
        imageURL: 'https://picsum.photos/401/400',
        userName: '창작자2',
        likes: 89,
        comments: 12,
        isLiked: false
    },
    {
        postId: '3',
        imageURL: 'https://picsum.photos/402/400',
        userName: '창작자3',
        likes: 120,
        comments: 15,
        isLiked: false
    },
    {
        postId: '4',
        imageURL: 'https://picsum.photos/403/400',
        userName: '창작자4',
        likes: 100,
        comments: 10,
        isLiked: false
    },
    {
        postId: '5',
        imageURL: 'https://picsum.photos/404/400',
        userName: '창작자5',
        likes: 110,
        comments: 11,
        isLiked: false
    },
    {
        postId: '6',
        imageURL: 'https://picsum.photos/405/400',
        userName: '창작자6',
        likes: 130,
        comments: 16,
        isLiked: false
    },
    {
        postId: '7',
        imageURL: 'https://picsum.photos/406/400',
        userName: '창작자7',
        likes: 140,
        comments: 17,
        isLiked: false
    },
    {
        postId: '8',
        imageURL: 'https://picsum.photos/407/400',
        userName: '창작자8',
        likes: 160,
        comments: 18,
        isLiked: false
    },
    {
        postId: '9',
        imageURL: 'https://picsum.photos/408/400',
        userName: '창작자9',
        likes: 170,
        comments: 19,
        isLiked: false
    },
    {
        postId: '10',
        imageURL: 'https://picsum.photos/409/400',
        userName: '창작자10',
        likes: 180,
        comments: 20,
        isLiked: false
    }
]

export default function Home() {
    const [prompt, setPrompt] = useState('')
    const [error, setError] = useState('')
    const [feedData, setFeedData] = useState(INITIAL_FEED_DATA)
    const router = useRouter()

    const handleGenerateImage = () => {
        if (!prompt.trim()) {
            setError('프롬프트를 입력해 주세요')
            return
        }
        router.push(`/generate?prompt=${encodeURIComponent(prompt)}`)
    }

    const handleLike = (postId: string) => {
        setFeedData(prev =>
            prev.map(post =>
                post.postId === postId
                    ? {
                          ...post,
                          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                          isLiked: !post.isLiked
                      }
                    : post
            )
        )
    }

    const handleAddComment = (postId: string, content: string) => {
        setFeedData(prev =>
            prev.map(post =>
                post.postId === postId
                    ? { ...post, comments: post.comments + 1 }
                    : post
            )
        )
        // 실제 구현에서는 여기서 API 호출을 통해 댓글을 저장합니다
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <section className="max-w-2xl mx-auto space-y-4 mb-16">
                <div className="space-y-2">
                    <Input
                        placeholder="이미지 생성을 위한 프롬프트를 입력하세요"
                        value={prompt}
                        onChange={e => {
                            setPrompt(e.target.value)
                            setError('')
                        }}
                        className="h-12"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <Button
                    onClick={handleGenerateImage}
                    disabled={!prompt.trim()}
                    className="w-full h-12"
                >
                    이미지 생성하기
                </Button>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedData.map(post => (
                    <CommunityFeedCard
                        key={post.postId}
                        {...post}
                        onLike={handleLike}
                        onAddComment={handleAddComment}
                    />
                ))}
            </section>
        </main>
    )
}
