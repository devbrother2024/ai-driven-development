import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageGenerationProps {
    onGenerate: () => void
    isGenerating: boolean
    generatedImageUrl: string
}

export function ImageGeneration({
    onGenerate,
    isGenerating,
    generatedImageUrl
}: ImageGenerationProps) {
    return (
        <div className="space-y-4">
            <Button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        이미지 생성 중...
                    </>
                ) : (
                    '이미지 생성하기'
                )}
            </Button>

            {generatedImageUrl && (
                <div className="relative aspect-square w-full max-w-2xl mx-auto">
                    <Image
                        src={generatedImageUrl}
                        alt="Generated image"
                        fill
                        className="object-contain"
                    />
                </div>
            )}
        </div>
    )
}
