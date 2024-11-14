export interface IUser {
    id: string
    name: string
    profileImage: string
}

export interface IPost {
    postId: string
    imageURL: string
    userName: string
    likes: number
    comments: number
    isLiked?: boolean
}

export interface IPostDetail extends IPost {
    author: IUser
    prompt: string
    styleOptions: {
        style: string
        mood: string
        lighting: string
    }
    createdAt: string
    scraps: number
    isScrapped: boolean
}

export interface IComment {
    id: string
    postId: string
    author: IUser
    content: string
    createdAt: string
    parentId?: string
    isEditing?: boolean
}

export interface ICommunityFeedCardComment {
    id: string
    postId: string
    userName: string
    content: string
    createdAt: string
}
