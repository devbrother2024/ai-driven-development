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
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

export function GalleryFilters() {
    const [category, setCategory] = useState<string>('all')
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const [sortBy, setSortBy] = useState<string>('latest')
    const [visibility, setVisibility] = useState<string>('all')

    const categories = [
        { value: 'all', label: '전체' },
        { value: 'landscape', label: '풍경' },
        { value: 'portrait', label: '인물' },
        { value: 'abstract', label: '추상' }
    ]

    const sortOptions = [
        { value: 'latest', label: '최신순' },
        { value: 'oldest', label: '오래된순' },
        { value: 'name', label: '이름순' }
    ]

    const resetFilters = () => {
        setCategory('all')
        setDateRange(undefined)
        setSortBy('latest')
        setVisibility('all')
    }

    return (
        <div className="flex flex-wrap gap-4 items-center">
            <Select value={category} onValueChange={setCategory}>
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

            <DatePickerWithRange value={dateRange} onChange={setDateRange} />

            <Select value={sortBy} onValueChange={setSortBy}>
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

            <Select value={visibility} onValueChange={setVisibility}>
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
