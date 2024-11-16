'use client'

import { useState } from 'react'
import { StyleOptions } from './StyleOptions'
import { ImageGeneration } from './ImageGeneration'
import { GeneratedImageActions } from './GeneratedImageActions'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IStyleOptions } from '@/types'

const DEFAULT_STYLE_OPTIONS: IStyleOptions = {
    artStyle: '디지털아트',
    colorTone: '밝은'
}

export function GenerateImageForm() {
    const [prompt, setPrompt] = useState('')
    const [error, setError] = useState('')
    const [styleOptions, setStyleOptions] = useState<IStyleOptions>(
        DEFAULT_STYLE_OPTIONS
    )
    const [generatedImageUrl, setGeneratedImageUrl] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

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

        setIsGenerating(true)
        // 목업 데이터: 실제 API 연동 시 대체 필요
        await new Promise(resolve => setTimeout(resolve, 2000))
        setGeneratedImageUrl('https://picsum.photos/800/600')
        setIsGenerating(false)
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
