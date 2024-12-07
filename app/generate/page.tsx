import { GenerateImageForm } from '@/components/generate/GenerateImageForm'
import { Card } from '@/components/ui/card'

export default function GeneratePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-6 py-24">
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-4">
                        <div className="absolute inset-0 bg-purple-600/30 blur-3xl rounded-full" />
                        <h1 className="text-4xl font-bold relative bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                            AI 이미지 생성
                        </h1>
                    </div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        프롬프트만 입력하면 AI가 당신의 상상을 예술 작품으로
                        만들어드립니다
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute inset-0 bg-purple-600/5 blur-xl rounded-lg" />
                    <div className="relative bg-gray-800/30 backdrop-blur-sm border border-purple-600/20 rounded-lg p-6">
                        <GenerateImageForm />
                    </div>
                </div>
            </div>
        </main>
    )
}
