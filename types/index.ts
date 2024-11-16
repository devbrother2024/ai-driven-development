export interface IPost {
    postId: string
    imageURL: string
    userName: string
    likes: number
    comments: number
    isLiked?: boolean
    prompt?: string
    createdAt?: string
    userProfile?: string
}

export interface IComment {
    id: string
    postId: string
    userName: string
    content: string
    createdAt: string
    userProfile?: string
}

export interface IGenerateImageResponse {
    success: boolean
    imageURL: string
}

// CommentsModal props interface
export interface ICommentsModalProps {
    postId: string
    isOpen: boolean
    onClose: () => void
}

// CommunityFeedCard props interface
export interface ICommunityFeedCardProps {
    post: IPost
}
