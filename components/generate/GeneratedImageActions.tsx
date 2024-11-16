import { Button } from '@/components/ui/button'
import { Download, Save, Share2 } from 'lucide-react'
import { IGeneratedImageActionsProps } from '@/types'
import { useToast } from '@/hooks/use-toast'

export function GeneratedImageActions({
    imageUrl,
    prompt,
    styleOptions
}: IGeneratedImageActionsProps) {
    const { toast } = useToast()

    const handleSave = async () => {
        toast({
            title: '저장 완료',
            description: '이미지가 갤러리에 저장되었습니다.'
        })
    }

    const handleShare = () => {
        toast({
            title: '준비 중',
            description: '커뮤니티 공유 기능은 준비 중입니다.'
        })
    }

    const handleDownload = async () => {
        try {
            // 이미지 URL에서 Blob 가져오기
            const response = await fetch(imageUrl)
            const blob = await response.blob()

            // Blob URL 생성
            const blobUrl = window.URL.createObjectURL(blob)

            // 다운로드 링크 생성 및 클릭
            const link = document.createElement('a')
            link.href = blobUrl

            // 파일명 생성 (현재 시간 기준)
            const timestamp = new Date().getTime()
            link.download = `generated-image-${timestamp}.jpg`

            // 링크 클릭하여 다운로드 시작
            document.body.appendChild(link)
            link.click()

            // cleanup
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)

            toast({
                title: '다운로드 완료',
                description: '이미지가 다운로드되었습니다.'
            })
        } catch (error) {
            console.error('Download error:', error)
            toast({
                variant: 'destructive',
                title: '다운로드 실패',
                description: '이미지 다운로드 중 오류가 발생했습니다.'
            })
        }
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
