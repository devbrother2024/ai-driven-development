'use client'

import { IGalleryImage, IGalleryCardProps } from '@/types'
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

export function GalleryCard({
    image,
    onImageClick,
    onShareClick,
    onDelete
}: IGalleryCardProps) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)

    return (
        <>
            <div className="relative group rounded-lg overflow-hidden bg-white shadow-md">
                <div
                    className="aspect-square relative cursor-pointer"
                    onClick={onImageClick}
                >
                    <Image
                        src={image.imageUrl}
                        alt={image.prompt}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />
                </div>

                {/* 호버 시 나타나는 액션 버튼들 */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={e => {
                            e.stopPropagation()
                            onShareClick()
                        }}
                    >
                        <Share className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={e => {
                            e.stopPropagation()
                            setShowDeleteAlert(true)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* 이미지 정보 */}
                <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">
                            {new Date(image.createdAt).toLocaleDateString()}
                        </span>
                        <span
                            className={`text-xs px-2 py-1 rounded ${
                                image.isPublic
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {image.isPublic ? '공개' : '비공개'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {image.categories.map(category => (
                            <span
                                key={category}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 삭제 확인 다이얼로그 */}
            <AlertDialog
                open={showDeleteAlert}
                onOpenChange={setShowDeleteAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            이미지를 삭제하시겠습니까?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            이 작업은 되돌릴 수 없습니다. 이미지가 영구적으로
                            삭제됩니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(image.id)
                                setShowDeleteAlert(false)
                            }}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            삭제
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
