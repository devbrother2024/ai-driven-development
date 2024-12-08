import { IPost, IComment, IGalleryImage } from '@/types'

export const mockPosts: IPost[] = [
    {
        postId: '1',
        imageURL: 'https://picsum.photos/400/400?random=1',
        userName: '창작의신',
        likes: 150,
        comments: 23
    },
    {
        postId: '2',
        imageURL: 'https://picsum.photos/400/400?random=2',
        userName: 'AI아티스트',
        likes: 89,
        comments: 12
    },
    {
        postId: '3',
        imageURL: 'https://picsum.photos/400/400?random=3',
        userName: '그림쟁이',
        likes: 234,
        comments: 45
    },
    {
        postId: '4',
        imageURL: 'https://picsum.photos/400/400?random=4',
        userName: '상상마법사',
        likes: 67,
        comments: 8
    },
    {
        postId: '5',
        imageURL: 'https://picsum.photos/400/400?random=5',
        userName: '픽셀아트',
        likes: 445,
        comments: 56
    },
    {
        postId: '6',
        imageURL: 'https://picsum.photos/400/400?random=6',
        userName: '디자인고수',
        likes: 178,
        comments: 34
    },
    {
        postId: '7',
        imageURL: 'https://picsum.photos/400/400?random=7',
        userName: '이미지메이커',
        likes: 92,
        comments: 15
    },
    {
        postId: '8',
        imageURL: 'https://picsum.photos/400/400?random=8',
        userName: '아트디렉터',
        likes: 267,
        comments: 41
    },
    {
        postId: '9',
        imageURL: 'https://picsum.photos/400/400?random=9',
        userName: '컬러마스터',
        likes: 156,
        comments: 28
    },
    {
        postId: '10',
        imageURL: 'https://picsum.photos/400/400?random=10',
        userName: '드림메이커',
        likes: 324,
        comments: 47
    }
]

export const getMockPostDetail = (postId: string): IPost => {
    const basePost = mockPosts.find(post => post.postId === postId)
    if (!basePost) throw new Error('Post not found')

    return {
        ...basePost,
        prompt: '우주를 여행하는 고양이가 우주선 창 밖을 바라보며 지구를 보고 있는 모습, 디테일한 일러스트레이션',
        createdAt: '2024-03-20 15:30',
        userProfile: `https://picsum.photos/50/50?random=${postId}`
    }
}

export const mockComments: IComment[] = [
    {
        id: '1',
        postId: '1',
        userName: '댓글러1',
        content: '정말 멋진 작품이네요! 프롬프트가 너무 독특해요.',
        createdAt: '2024-03-20 10:00',
        userProfile: 'https://picsum.photos/50/50?random=101'
    },
    {
        id: '2',
        postId: '1',
        userName: '댓글러2',
        content: '고양이의 표정이 정말 인상적이에요!',
        createdAt: '2024-03-20 11:30',
        userProfile: 'https://picsum.photos/50/50?random=102'
    }
]

// export const mockGalleryImages: IGalleryImage[] = [
//     {
//         id: '1',
//         userId: 'user1',
//         imageUrl: 'https://picsum.photos/400/400?random=21',
//         prompt: '우주를 나는 고래',
//         styleOptions: {
//             artStyle: '디지털아트',
//             colorTone: '밝은'
//         },
//         categories: ['판타지'],
//         tags: ['우주', '고래', '환상적'],
//         isPublic: true,
//         order: 1,
//         createdAt: '2024-03-20T00:00:00Z',
//         updatedAt: '2024-03-20T00:00:00Z'
//     },
//     {
//         id: '2',
//         userId: 'user1',
//         imageUrl: 'https://picsum.photos/400/400?random=22',
//         prompt: '신비로운 숲속의 요정',
//         styleOptions: {
//             artStyle: '수채화',
//             colorTone: '파스텔'
//         },
//         categories: ['판타지', '자연'],
//         tags: ['요정', '숲', '마법'],
//         isPublic: true,
//         order: 2,
//         createdAt: '2024-03-19T00:00:00Z',
//         updatedAt: '2024-03-19T00:00:00Z'
//     },
//     {
//         id: '3',
//         userId: 'user1',
//         imageUrl: 'https://picsum.photos/400/400?random=23',
//         prompt: '미래도시의 일상',
//         styleOptions: {
//             artStyle: '디지털아트',
//             colorTone: '네온'
//         },
//         categories: ['SF'],
//         tags: ['미래', '도시', '사이버펑크'],
//         isPublic: false,
//         order: 3,
//         createdAt: '2024-03-18T00:00:00Z',
//         updatedAt: '2024-03-18T00:00:00Z'
//     },
//     {
//         id: '4',
//         userId: 'user1',
//         imageUrl: 'https://picsum.photos/400/400?random=24',
//         prompt: '고양이와 책이 있는 아늑한 방',
//         styleOptions: {
//             artStyle: '유화',
//             colorTone: '따뜻한'
//         },
//         categories: ['일상'],
//         tags: ['고양이', '인테리어', '아늑함'],
//         isPublic: true,
//         order: 4,
//         createdAt: '2024-03-17T00:00:00Z',
//         updatedAt: '2024-03-17T00:00:00Z'
//     }
// ]
