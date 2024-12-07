import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { IImageGenerationProps } from '@/types'

export function ImageGeneration({
    onGenerate,
    isGenerating,
    generatedImageUrl
}: IImageGenerationProps) {
    return (
        <div className="space-y-6">
            <Button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        이미지 생성 중...
                    </>
                ) : (
                    '이미지 생성하기'
                )}
            </Button>

            {generatedImageUrl && (
                <div className="relative aspect-square w-full max-w-2xl mx-auto rounded-lg overflow-hidden ring-2 ring-purple-600/20">
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
