'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { INavigationItem } from '@/types'

const navigation: INavigationItem[] = [
    { name: '이미지 생성', href: '/generate' },
    { name: '내 갤러리', href: '/gallery' }
]

export function Header() {
    const pathname = usePathname()

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
            <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
                {/* 로고 섹션 */}
                <Link
                    href="/"
                    className="flex items-center hover:opacity-80 transition-opacity"
                >
                    <Image
                        src="/logo.webp"
                        alt="Artify 로고"
                        layout="fixed"
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full"
                        priority
                    />
                </Link>

                {/* 네비게이션 메뉴 */}
                <nav
                    className="flex items-center gap-8"
                    role="navigation"
                    aria-label="메인 메뉴"
                >
                    {navigation.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'relative text-base font-semibold transition-colors',
                                'hover:text-primary focus-visible:text-primary',
                                'outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                                'py-1', // 키보드 포커스 영역 확보
                                pathname === item.href
                                    ? 'text-primary after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                                    : 'text-gray-600'
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}
