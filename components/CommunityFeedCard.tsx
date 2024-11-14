import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { IPost } from '@/types'

export default function CommunityFeedCard({
    postId,
    imageURL,
    userName,
    likes,
    comments
}: IPost) {
    return (
        <Link href={`/post/${postId}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0 relative aspect-square">
                    <Image
                        src={imageURL}
                        alt={`${userName}의 생성 이미지`}
                        fill
                        className="object-cover"
                    />
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center">
                    <span className="font-medium">{userName}</span>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{comments}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
