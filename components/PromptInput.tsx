'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function PromptInput() {
    const [prompt, setPrompt] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = () => {
        if (!prompt.trim()) {
            setError('프롬프트를 입력해 주세요')
            return
        }

        // 실제 API 연동 대신 임시로 이동만 처리
        router.push('/generate')
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <Input
                placeholder="이미지 생성을 위한 프롬프트를 입력하세요..."
                value={prompt}
                onChange={e => {
                    setPrompt(e.target.value)
                    setError('')
                }}
                className="h-12"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className="w-full"
            >
                이미지 생성하기
            </Button>
        </div>
    )
}
