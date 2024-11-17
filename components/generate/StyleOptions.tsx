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
        <div className="space-y-4">
            <h3 className="text-lg font-medium">스타일 옵션</h3>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">예술 스타일</label>
                    <Select
                        value={options.artStyle}
                        onValueChange={value => handleChange('artStyle', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>일반 스타일</SelectLabel>
                                <SelectItem value="디지털아트">
                                    디지털아트
                                </SelectItem>
                                <SelectItem value="수채화">수채화</SelectItem>
                                <SelectItem value="유화">유화</SelectItem>
                                <SelectItem value="펜화">펜화</SelectItem>
                                <SelectItem value="연필화">연필화</SelectItem>
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                                <SelectLabel>로고 스타일</SelectLabel>
                                <SelectItem value="로고_미니멀">
                                    미니멀 로고
                                </SelectItem>
                                <SelectItem value="로고_3D">3D 로고</SelectItem>
                                <SelectItem value="로고_그라디언트">
                                    그라디언트 로고
                                </SelectItem>
                                <SelectItem value="로고_빈티지">
                                    빈티지 로고
                                </SelectItem>
                                <SelectItem value="로고_모던">
                                    모던 로고
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">색조</label>
                    <Select
                        value={options.colorTone}
                        onValueChange={value =>
                            handleChange('colorTone', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>일반 색조</SelectLabel>
                                <SelectItem value="밝은">밝은</SelectItem>
                                <SelectItem value="어두운">어두운</SelectItem>
                                <SelectItem value="파스텔">파스텔</SelectItem>
                                <SelectItem value="흑백">흑백</SelectItem>
                                <SelectItem value="컬러풀">컬러풀</SelectItem>
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                                <SelectLabel>로고 색조</SelectLabel>
                                <SelectItem value="모노톤">모노톤</SelectItem>
                                <SelectItem value="메탈릭">메탈릭</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
