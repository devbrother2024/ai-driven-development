'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { StyleOptions } from './StyleOptions'
import { ImageGeneration } from './ImageGeneration'
import { GeneratedImageActions } from './GeneratedImageActions'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IStyleOptions, IGenerateResponse } from '@/types'
import { useToast } from '@/hooks/use-toast'

const DEFAULT_STYLE_OPTIONS: IStyleOptions = {
    artStyle: '디지털아트',
    colorTone: '밝은'
}

export function GenerateImageForm() {
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const [prompt, setPrompt] = useState('')
    const [error, setError] = useState('')
    const [styleOptions, setStyleOptions] = useState<IStyleOptions>(
        DEFAULT_STYLE_OPTIONS
    )
    const [generatedImageUrl, setGeneratedImageUrl] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        const urlPrompt = searchParams.get('prompt')
        if (urlPrompt) {
            setPrompt(decodeURIComponent(urlPrompt))
        }
    }, [searchParams])

    const handlePromptChange = (value: string) => {
        setPrompt(value)
        if (value.length > 500) {
            setError('500자 이내로 입력해 주세요')
        } else {
            setError('')
        }
    }

    const handleGenerate = async () => {
        if (!prompt) {
            setError('프롬프트를 입력해 주세요')
            return
        }

        if (prompt.length > 500) {
            setError('500자 이내로 입력해 주세요')
            return
        }

        try {
            setIsGenerating(true)
            setError('')

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                    styleOptions
                })
            })

            const data: IGenerateResponse = await response.json()

            if (!data.success) {
                throw new Error(
                    data.error?.message || '이미지 생성에 실패했습니다'
                )
            }

            setGeneratedImageUrl(data.imageUrl)
            toast({
                title: '이미지 생성 완료',
                description: '이미지가 성공적으로 생성되었습니다.'
            })
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : '이미지 생성 중 오류가 발생했습니다'
            setError(errorMessage)
            toast({
                variant: 'destructive',
                title: '오류 발생',
                description: errorMessage
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">
                    프롬프트 입력
                </label>
                <Textarea
                    value={prompt}
                    onChange={e => handlePromptChange(e.target.value)}
                    placeholder="생성하고 싶은 이미지를 자세히 설명해주세요..."
                    className="min-h-[100px]"
                    disabled={isGenerating}
                />
                {error && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>

            <StyleOptions options={styleOptions} onChange={setStyleOptions} />

            <ImageGeneration
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                generatedImageUrl={generatedImageUrl}
            />

            {generatedImageUrl && (
                <GeneratedImageActions
                    imageUrl={generatedImageUrl}
                    prompt={prompt}
                    styleOptions={styleOptions}
                />
            )}
        </div>
    )
}
