'use client'

import { IGalleryCardProps } from '@/types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Share, Trash2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export function GalleryCard({
    image,
    onImageClick,
    onShareClick,
    onDelete
}: IGalleryCardProps) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const { toast } = useToast()

    const handleShareClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (image.isPublic) {
            toast({
                variant: 'destructive',
                title: '이미 공유된 이미지입니다',
                description: '동일한 이미지는 한 번만 공유할 수 있습니다.'
            })
            return
        }
        onShareClick()
    }

    return (
        <>
            <div className="relative group rounded-lg overflow-hidden bg-gray-800/30 backdrop-blur-sm border border-purple-600/20 transition-all duration-300 hover:bg-gray-800/50">
                <div
                    className="aspect-square relative cursor-pointer"
                    onClick={onImageClick}
                >
                    <Image
                        src={image.imageUrl}
                        alt={image.prompt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                </div>

                {/* 호버 시 나타나는 액션 버튼들 */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={handleShareClick}
                        className={`bg-gray-900/80 border border-purple-600/30 hover:bg-purple-600/20 
                                  ${
                                      image.isPublic
                                          ? 'opacity-50 cursor-not-allowed'
                                          : ''
                                  }`}
                    >
                        <Share className="h-4 w-4 text-gray-200" />
                    </Button>
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={e => {
                            e.stopPropagation()
                            setShowDeleteAlert(true)
                        }}
                        className="bg-red-500/80 hover:bg-red-600/80"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* 이미지 정보 */}
                <div className="p-3 border-t border-purple-600/20">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                            {new Date(image.createdAt).toLocaleDateString()}
                        </span>
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${
                                image.isPublic
                                    ? 'bg-purple-600/20 text-purple-300'
                                    : 'bg-gray-800/50 text-gray-300'
                            }`}
                        >
                            {image.isPublic ? '공개' : '비공개'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 삭제 확인 다이얼로그 */}
            <AlertDialog
                open={showDeleteAlert}
                onOpenChange={setShowDeleteAlert}
            >
                <AlertDialogContent className="bg-gray-900/95 border-purple-600/20 text-gray-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                            이미지를 삭제하시겠습니까?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            이 작업은 되돌릴 수 없습니다. 이미지가 영구적으로
                            삭제됩니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 text-gray-200 border-purple-600/30 hover:bg-gray-700">
                            취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(image.id)
                                setShowDeleteAlert(false)
                            }}
                            className="bg-red-500/80 hover:bg-red-600/80 text-white border-none"
                        >
                            삭제
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
