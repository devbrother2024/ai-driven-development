import { Button } from '@/components/ui/button'
import { Download, Save, Share2 } from 'lucide-react'
import { IStyleOptions } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface GeneratedImageActionsProps {
    imageUrl: string
    prompt: string
    styleOptions: IStyleOptions
}

export function GeneratedImageActions({
    imageUrl,
    prompt,
    styleOptions
}: GeneratedImageActionsProps) {
    const { toast } = useToast()

    const handleSave = async () => {
        // 목업: 실제 API 연동 시 대체 필요
        toast({
            title: '저장 완료',
            description: '이미지가 갤러리에 저장되었습니다.'
        })
    }

    const handleShare = () => {
        // 목업: 실제 구현 시 공유 페이지로 이동
        toast({
            title: '준비 중',
            description: '커뮤니티 공유 기능은 준비 중입니다.'
        })
    }

    const handleDownload = () => {
        // 목업: 실제 구현 시 다운로드 로직 구현
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = 'generated-image.jpg'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="flex gap-2">
            <Button onClick={handleSave} variant="outline">
                <Save className="mr-2 h-4 w-4" />
                갤러리에 저장하기
            </Button>
            <Button onClick={handleShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                공유하기
            </Button>
            <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                다운로드
            </Button>
        </div>
    )
}
