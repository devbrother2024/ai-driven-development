'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CommunityFeedCard from '@/components/CommunityFeedCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 목업 데이터
const MOCK_FEED_DATA = [
    {
        postId: '1',
        imageURL: 'https://picsum.photos/400/400',
        userName: '창작자1',
        likes: 150,
        comments: 23
    },
    {
        postId: '2',
        imageURL: 'https://picsum.photos/401/400',
        userName: '창작자2',
        likes: 89,
        comments: 12
    },
    {
        postId: '3',
        imageURL: 'https://picsum.photos/402/400',
        userName: '창작자3',
        likes: 120,
        comments: 15
    },
    {
        postId: '4',
        imageURL: 'https://picsum.photos/403/400',
        userName: '창작자4',
        likes: 100,
        comments: 10
    },
    {
        postId: '5',
        imageURL: 'https://picsum.photos/404/400',
        userName: '창작자5',
        likes: 110,
        comments: 11
    },
    {
        postId: '6',
        imageURL: 'https://picsum.photos/405/400',
        userName: '창작자6',
        likes: 130,
        comments: 16
    },
    {
        postId: '7',
        imageURL: 'https://picsum.photos/406/400',
        userName: '창작자7',
        likes: 140,
        comments: 17
    },
    {
        postId: '8',
        imageURL: 'https://picsum.photos/407/400',
        userName: '창작자8',
        likes: 160,
        comments: 18
    },
    {
        postId: '9',
        imageURL: 'https://picsum.photos/408/400',
        userName: '창작자9',
        likes: 170,
        comments: 19
    },
    {
        postId: '10',
        imageURL: 'https://picsum.photos/409/400',
        userName: '창작자10',
        likes: 180,
        comments: 20
    }
]

export default function Home() {
    const [prompt, setPrompt] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleGenerateImage = () => {
        if (!prompt.trim()) {
            setError('프롬프트를 입력해 주세요')
            return
        }
        // 실제 API 연동 대신 이미지 생성 페이지로 이동
        router.push(`/generate?prompt=${encodeURIComponent(prompt)}`)
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
                {MOCK_FEED_DATA.map(post => (
                    <CommunityFeedCard key={post.postId} {...post} />
                ))}
            </section>
        </main>
    )
}
