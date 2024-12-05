import { create } from 'zustand'
import { IGalleryImage } from '@/types'
import { DateRange } from 'react-day-picker'

interface FilterOptions {
    artStyle?: string
    colorTone?: string
    dateRange?: DateRange
    sortBy: 'latest' | 'oldest'
    isPublic?: boolean
}

interface GalleryStore {
    images: IGalleryImage[]
    filters: FilterOptions
    filteredImages: IGalleryImage[]
    totalCount: number
    hasMore: boolean
    currentPage: number
    isLoading: boolean
    error: string | null

    // Actions
    fetchImages: () => Promise<void>
    loadMoreImages: () => Promise<void>
    deleteImage: (imageId: string) => Promise<void>
    updateImage: (
        imageId: string,
        tags: string[],
        isPublic: boolean
    ) => Promise<void>
    setFilter: (filter: Partial<FilterOptions>) => void
    resetFilters: () => void
}

const defaultFilters: FilterOptions = {
    sortBy: 'latest',
    isPublic: undefined
}

const ITEMS_PER_PAGE = 12

export const useGalleryStore = create<GalleryStore>((set, get) => ({
    images: [],
    filters: defaultFilters,
    filteredImages: [],
    totalCount: 0,
    hasMore: false,
    currentPage: 1,
    isLoading: false,
    error: null,

    fetchImages: async () => {
        try {
            set({ isLoading: true, error: null, currentPage: 1 })
            const filters = get().filters

            const queryParams = new URLSearchParams({
                page: '1',
                limit: ITEMS_PER_PAGE.toString(),
                sortBy: filters.sortBy
            })

            if (filters.artStyle)
                queryParams.append('artStyle', filters.artStyle)
            if (filters.colorTone)
                queryParams.append('colorTone', filters.colorTone)
            if (filters.dateRange?.from) {
                queryParams.append(
                    'startDate',
                    filters.dateRange.from.toISOString()
                )
                if (filters.dateRange.to) {
                    queryParams.append(
                        'endDate',
                        filters.dateRange.to.toISOString()
                    )
                }
            }
            if (filters.isPublic !== undefined) {
                queryParams.append('isPublic', filters.isPublic.toString())
            }

            const response = await fetch(`/api/gallery?${queryParams}`)
            if (!response.ok) {
                throw new Error('이미지 목록을 불러오는데 실패했습니다.')
            }

            const data = await response.json()
            set({
                images: data.images,
                filteredImages: data.images,
                totalCount: data.totalCount,
                hasMore: data.hasMore
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : '알 수 없는 오류가 발생했습니다.'
            })
        } finally {
            set({ isLoading: false })
        }
    },

    loadMoreImages: async () => {
        try {
            const { currentPage, filters, isLoading, hasMore, filteredImages } =
                get()
            if (isLoading || !hasMore) return

            set({ isLoading: true, error: null })
            const nextPage = currentPage + 1

            const queryParams = new URLSearchParams({
                page: nextPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                sortBy: filters.sortBy
            })

            if (filters.artStyle)
                queryParams.append('artStyle', filters.artStyle)
            if (filters.colorTone)
                queryParams.append('colorTone', filters.colorTone)
            if (filters.dateRange?.from) {
                queryParams.append(
                    'startDate',
                    filters.dateRange.from.toISOString()
                )
                if (filters.dateRange.to) {
                    queryParams.append(
                        'endDate',
                        filters.dateRange.to.toISOString()
                    )
                }
            }
            if (filters.isPublic !== undefined) {
                queryParams.append('isPublic', filters.isPublic.toString())
            }

            const response = await fetch(`/api/gallery?${queryParams}`)
            if (!response.ok) {
                throw new Error('추가 이미지를 불러오는데 실패했습니다.')
            }

            const data = await response.json()
            set({
                currentPage: nextPage,
                images: [...filteredImages, ...data.images],
                filteredImages: [...filteredImages, ...data.images],
                hasMore: data.hasMore
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : '알 수 없는 오류가 발생했습니다.'
            })
        } finally {
            set({ isLoading: false })
        }
    },

    deleteImage: async (imageId: string) => {
        try {
            set({ isLoading: true, error: null })

            const response = await fetch(`/api/gallery/${imageId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('이미지 삭제에 실패했습니다.')
            }

            // 성공적으로 삭제된 경우 로컬 상태 업데이트
            const { images, filteredImages } = get()
            set({
                images: images.filter(img => img.id !== imageId),
                filteredImages: filteredImages.filter(img => img.id !== imageId)
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : '알 수 없는 오류가 발생했습니다.'
            })
        } finally {
            set({ isLoading: false })
        }
    },

    updateImage: async (imageId: string, tags: string[], isPublic: boolean) => {
        try {
            set({ isLoading: true, error: null })

            const response = await fetch(`/api/gallery/${imageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tags, isPublic })
            })

            if (!response.ok) {
                throw new Error('이미지 정보 업데이트에 실패했습니다.')
            }

            const { image } = await response.json()

            // 성공적으로 업데이트된 경우 로컬 상태 즉시 업데이트
            const { images, filteredImages } = get()
            const updateImages = (imgs: IGalleryImage[]) =>
                imgs.map(img => (img.id === imageId ? { ...img, tags, isPublic } : img))

            set({
                images: updateImages(images),
                filteredImages: updateImages(filteredImages)
            })

            return image
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : '알 수 없는 오류가 발생했습니다.'
            })
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    setFilter: (filter: Partial<FilterOptions>) => {
        set(state => ({
            filters: { ...state.filters, ...filter }
        }))
        get().fetchImages() // 필터 변경 시 새로운 데이터 fetch
    },

    resetFilters: () => {
        set({ filters: defaultFilters })
        get().fetchImages() // 필터 초기화 시 새로운 데이터 fetch
    }
}))
