'use client'

import { useGalleryStore } from '@/store/gallery'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-picker'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { DateRange } from 'react-day-picker'

// 스타일 옵션 상수 정의
const ART_STYLES = [
    '전체',
    '디지털아트',
    '수채화',
    '유화',
    '펜화',
    '연필화',
    '로고_미니멀',
    '로고_3D',
    '로고_그라디언트',
    '로고_빈티지',
    '로고_모던'
] as const

const COLOR_TONES = [
    '전체',
    '밝은',
    '어두운',
    '파스텔',
    '흑백',
    '컬러풀',
    '모노톤',
    '메탈릭'
] as const

export default function GalleryFilters() {
    const { filters, setFilter, resetFilters } = useGalleryStore()

    const handleStyleChange = (value: string) => {
        setFilter({ artStyle: value === '전체' ? undefined : value })
    }

    const handleColorToneChange = (value: string) => {
        setFilter({ colorTone: value === '전체' ? undefined : value })
    }

    const handleSortChange = (value: string) => {
        setFilter({ sortBy: value as 'latest' | 'oldest' })
    }

    return (
        <div className="space-y-4 p-4 bg-gray-800/30 backdrop-blur-sm border border-purple-600/20 rounded-lg">
            <div className="flex flex-wrap gap-4">
                {/* 아트 스타일 필터 */}
                <div className="flex-1 min-w-[200px]">
                    <Select
                        value={filters.artStyle || '전체'}
                        onValueChange={handleStyleChange}
                    >
                        <SelectTrigger className="bg-gray-900/50 border-purple-600/30 text-gray-200">
                            <SelectValue placeholder="아트 스타일" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900/95 border-purple-600/30">
                            {ART_STYLES.map(style => (
                                <SelectItem
                                    key={style}
                                    value={style}
                                    className="text-gray-200"
                                >
                                    {style}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 색상 톤 필터 */}
                <div className="flex-1 min-w-[200px]">
                    <Select
                        value={filters.colorTone || '전체'}
                        onValueChange={handleColorToneChange}
                    >
                        <SelectTrigger className="bg-gray-900/50 border-purple-600/30 text-gray-200">
                            <SelectValue placeholder="색상 톤" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900/95 border-purple-600/30">
                            {COLOR_TONES.map(tone => (
                                <SelectItem
                                    key={tone}
                                    value={tone}
                                    className="text-gray-200"
                                >
                                    {tone}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 정렬 옵션 */}
                <div className="flex-1 min-w-[150px]">
                    <Select
                        value={filters.sortBy}
                        onValueChange={handleSortChange}
                    >
                        <SelectTrigger className="bg-gray-900/50 border-purple-600/30 text-gray-200">
                            <SelectValue placeholder="정렬" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900/95 border-purple-600/30">
                            <SelectItem
                                value="latest"
                                className="text-gray-200"
                            >
                                최신순
                            </SelectItem>
                            <SelectItem
                                value="oldest"
                                className="text-gray-200"
                            >
                                오래된순
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 날짜 범위 필터 */}
                <div className="flex-1 min-w-[300px]">
                    <DatePickerWithRange
                        value={filters.dateRange}
                        onChange={(date: DateRange | undefined) =>
                            setFilter({ dateRange: date })
                        }
                        className="bg-gray-900/50 border-purple-600/30 text-gray-200"
                    />
                </div>

                {/* 공개 여부 필터 */}
                <div className="flex items-center space-x-2">
                    <Switch
                        id="public-filter"
                        checked={filters.isPublic ?? false}
                        onCheckedChange={checked => {
                            setFilter({ isPublic: checked })
                        }}
                        className="data-[state=checked]:bg-purple-600"
                    />
                    <Label htmlFor="public-filter" className="text-gray-200">
                        공개된 이미지만 보기
                    </Label>
                </div>
            </div>

            {/* 필터 초기화 버튼 */}
            <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="mt-2 border-purple-600/30 text-black-300 hover:text-gray-200 hover:bg-purple-600/20"
            >
                필터 초기화
            </Button>
        </div>
    )
}
