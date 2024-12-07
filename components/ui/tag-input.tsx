'use client'

import { useState, KeyboardEvent } from 'react'
import { Input } from './input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    className?: string
}

export function TagInput({
    value,
    onChange,
    placeholder,
    className
}: TagInputProps) {
    const [input, setInput] = useState('')

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault()
            if (!value.includes(input.trim())) {
                onChange([...value, input.trim()])
            }
            setInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove))
    }

    return (
        <div className={cn('relative', className)}>
            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {value.map(tag => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="px-2 py-1"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}
