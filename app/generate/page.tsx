import { GenerateImageForm } from '@/components/generate/GenerateImageForm'
import { Card } from '@/components/ui/card'

export default function GeneratePage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">이미지 생성</h1>
            <Card className="p-6">
                <GenerateImageForm />
            </Card>
        </div>
    )
}
