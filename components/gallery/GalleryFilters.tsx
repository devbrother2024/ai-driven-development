'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-picker'
import { useGalleryStore } from '@/store/gallery'
import { DateRange } from 'react-day-picker'

export function GalleryFilters() {
    const { filters, setFilter, resetFilters } = useGalleryStore()

    const categories = [
        { value: 'all', label: '전체' },
        { value: '판타지', label: '판타지' },
        { value: 'SF', label: 'SF' },
        { value: '자연', label: '자연' },
        { value: '일상', label: '일상' }
    ]

    const sortOptions = [
        { value: 'latest', label: '최신순' },
        { value: 'oldest', label: '오래된순' },
        { value: 'name', label: '이름순' }
    ]

    return (
        <div className="flex flex-wrap gap-4 items-center">
            <Select
                value={filters.category}
                onValueChange={value => setFilter({ category: value })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                            {category.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <DatePickerWithRange
                value={filters.dateRange}
                onChange={(dateRange: DateRange | undefined) =>
                    setFilter({ dateRange })
                }
            />

            <Select
                value={filters.sortBy}
                onValueChange={value => setFilter({ sortBy: value })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                    {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.visibility}
                onValueChange={value => setFilter({ visibility: value })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="공개 설정" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="public">공개</SelectItem>
                    <SelectItem value="private">비공개</SelectItem>
                </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
                필터 초기화
            </Button>
        </div>
    )
}
