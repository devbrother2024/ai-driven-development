'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

export function PromptInput() {
    const [prompt, setPrompt] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = () => {
        if (!prompt.trim()) {
            setError('프롬프트를 입력해 주세요')
            return
        }

        const encodedPrompt = encodeURIComponent(prompt.trim())
        router.push(`/generate?prompt=${encodedPrompt}`)
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="flex gap-2">
                <Input
                    placeholder="이미지 생성을 위한 프롬프트를 입력하세요..."
                    value={prompt}
                    onChange={e => {
                        setPrompt(e.target.value)
                        setError('')
                    }}
                    className="flex-1 h-12 bg-gray-900/50 border-purple-600/30 text-gray-200 
                             placeholder-gray-400 focus:border-purple-500 
                             focus:ring-purple-500/30"
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!prompt.trim()}
                    className="h-12 px-6 bg-purple-600 hover:bg-purple-700 text-white"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    생성하기
                </Button>
            </div>
            {error && (
                <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded">
                    {error}
                </p>
            )}
        </div>
    )
}
