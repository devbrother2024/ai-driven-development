import { create } from 'zustand'
import { mockGalleryImages } from '@/utils/mockData'
import { IGalleryImage } from '@/types'
import { DateRange } from 'react-day-picker'

interface FilterOptions {
    category: string
    dateRange?: DateRange
    sortBy: string
    visibility: string
}

interface GalleryStore {
    images: IGalleryImage[]
    filters: FilterOptions
    filteredImages: IGalleryImage[]
    deleteImage: (imageId: string) => void
    resetImages: () => void
    setFilter: (filter: Partial<FilterOptions>) => void
    resetFilters: () => void
}

const defaultFilters: FilterOptions = {
    category: 'all',
    dateRange: undefined,
    sortBy: 'latest',
    visibility: 'all'
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
    images: mockGalleryImages,
    filters: defaultFilters,
    filteredImages: mockGalleryImages,

    deleteImage: (imageId: string) =>
        set(state => {
            const updatedImages = state.images.filter(img => img.id !== imageId)
            return {
                images: updatedImages,
                filteredImages: applyFilters(updatedImages, state.filters)
            }
        }),

    resetImages: () =>
        set(state => ({
            images: mockGalleryImages,
            filteredImages: applyFilters(mockGalleryImages, state.filters)
        })),

    setFilter: (filter: Partial<FilterOptions>) =>
        set(state => {
            const newFilters = { ...state.filters, ...filter }
            return {
                filters: newFilters,
                filteredImages: applyFilters(state.images, newFilters)
            }
        }),

    resetFilters: () =>
        set(state => ({
            filters: defaultFilters,
            filteredImages: applyFilters(state.images, defaultFilters)
        }))
}))

function applyFilters(
    images: IGalleryImage[],
    filters: FilterOptions
): IGalleryImage[] {
    let filtered = [...images]

    // 카테고리 필터
    if (filters.category !== 'all') {
        filtered = filtered.filter(img =>
            img.categories.includes(filters.category)
        )
    }

    // 날짜 범위 필터
    if (filters.dateRange?.from) {
        filtered = filtered.filter(img => {
            const imgDate = new Date(img.createdAt)
            const from = filters.dateRange?.from as Date
            const to = filters.dateRange?.to || from
            return imgDate >= from && imgDate <= to
        })
    }

    // 공개 설정 필터
    if (filters.visibility !== 'all') {
        filtered = filtered.filter(img =>
            filters.visibility === 'public' ? img.isPublic : !img.isPublic
        )
    }

    // 정렬
    filtered.sort((a, b) => {
        switch (filters.sortBy) {
            case 'oldest':
                return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
            case 'name':
                return a.prompt.localeCompare(b.prompt)
            case 'latest':
            default:
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
        }
    })

    return filtered
}
