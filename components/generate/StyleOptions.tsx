import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { IStyleOptions } from '@/types'

interface StyleOptionsProps {
    options: IStyleOptions
    onChange: (options: IStyleOptions) => void
}

export function StyleOptions({ options, onChange }: StyleOptionsProps) {
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
                            <SelectItem value="디지털아트">
                                디지털아트
                            </SelectItem>
                            <SelectItem value="수채화">수채화</SelectItem>
                            <SelectItem value="유화">유화</SelectItem>
                            <SelectItem value="펜화">펜화</SelectItem>
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
                            <SelectItem value="밝은">밝은</SelectItem>
                            <SelectItem value="어두운">어두운</SelectItem>
                            <SelectItem value="파스텔">파스텔</SelectItem>
                            <SelectItem value="흑백">흑백</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
