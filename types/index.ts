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

// StyleOptions props interface
export interface IStyleOptionsProps {
    options: IStyleOptions
    onChange: (options: IStyleOptions) => void
}

// ImageGeneration props interface
export interface IImageGenerationProps {
    onGenerate: () => void
    isGenerating: boolean
    generatedImageUrl: string
}

// GeneratedImageActions props interface
export interface IGeneratedImageActionsProps {
    imageUrl: string
    prompt: string
    styleOptions: IStyleOptions
}

export interface IStyleOptions {
    artStyle: string
    colorTone: string
}
