import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
    SelectSeparator
} from '@/components/ui/select'
import { IStyleOptions, IStyleOptionsProps } from '@/types'

export function StyleOptions({ options, onChange }: IStyleOptionsProps) {
    const handleChange = (key: keyof IStyleOptions, value: string) => {
        onChange({ ...options, [key]: value })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="block text-base font-medium text-gray-200">
                    아트 스타일
                </label>
                <Select
                    value={options.artStyle}
                    onValueChange={value => handleChange('artStyle', value)}
                >
                    <SelectTrigger className="bg-gray-900/50 border-purple-600/30 text-gray-200">
                        <SelectValue placeholder="스타일을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 border-purple-600/30">
                        <SelectGroup>
                            <SelectLabel className="text-gray-400">
                                일반 스타일
                            </SelectLabel>
                            <SelectItem
                                value="디지털아트"
                                className="text-gray-200"
                            >
                                디지털아트
                            </SelectItem>
                            <SelectItem
                                value="수채화"
                                className="text-gray-200"
                            >
                                수채화
                            </SelectItem>
                            <SelectItem value="유화" className="text-gray-200">
                                유화
                            </SelectItem>
                            <SelectItem value="펜화" className="text-gray-200">
                                펜화
                            </SelectItem>
                            <SelectItem
                                value="연필화"
                                className="text-gray-200"
                            >
                                연필화
                            </SelectItem>
                        </SelectGroup>
                        <SelectSeparator className="bg-purple-600/20" />
                        <SelectGroup>
                            <SelectLabel className="text-gray-400">
                                로고 스타일
                            </SelectLabel>
                            <SelectItem
                                value="로고_미니멀"
                                className="text-gray-200"
                            >
                                미니멀 로고
                            </SelectItem>
                            <SelectItem
                                value="로고_3D"
                                className="text-gray-200"
                            >
                                3D 로고
                            </SelectItem>
                            <SelectItem
                                value="로고_그라디언트"
                                className="text-gray-200"
                            >
                                그라디언트 로고
                            </SelectItem>
                            <SelectItem
                                value="로고_빈티지"
                                className="text-gray-200"
                            >
                                빈티지 로고
                            </SelectItem>
                            <SelectItem
                                value="로고_모던"
                                className="text-gray-200"
                            >
                                모던 로고
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <label className="block text-base font-medium text-gray-200">
                    색감
                </label>
                <Select
                    value={options.colorTone}
                    onValueChange={value => handleChange('colorTone', value)}
                >
                    <SelectTrigger className="bg-gray-900/50 border-purple-600/30 text-gray-200">
                        <SelectValue placeholder="색감을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 border-purple-600/30">
                        <SelectGroup>
                            <SelectLabel className="text-gray-400">
                                일반 색감
                            </SelectLabel>
                            <SelectItem value="밝은" className="text-gray-200">
                                밝은
                            </SelectItem>
                            <SelectItem
                                value="어두운"
                                className="text-gray-200"
                            >
                                어두운
                            </SelectItem>
                            <SelectItem
                                value="파스텔"
                                className="text-gray-200"
                            >
                                파스텔
                            </SelectItem>
                            <SelectItem value="흑백" className="text-gray-200">
                                흑백
                            </SelectItem>
                            <SelectItem
                                value="컬러풀"
                                className="text-gray-200"
                            >
                                컬러풀
                            </SelectItem>
                        </SelectGroup>
                        <SelectSeparator className="bg-purple-600/20" />
                        <SelectGroup>
                            <SelectLabel className="text-gray-400">
                                로고 색감
                            </SelectLabel>
                            <SelectItem
                                value="모노톤"
                                className="text-gray-200"
                            >
                                모노톤
                            </SelectItem>
                            <SelectItem
                                value="메탈릭"
                                className="text-gray-200"
                            >
                                메탈릭
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
