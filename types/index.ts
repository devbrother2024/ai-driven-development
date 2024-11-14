export interface IPost {
    postId: string
    imageURL: string
    userName: string
    likes: number
    comments: number
    isLiked?: boolean
}

export interface IComment {
    id: string
    postId: string
    userName: string
    content: string
    createdAt: string
}
