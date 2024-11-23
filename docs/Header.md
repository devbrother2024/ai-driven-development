## 헤더 컴포넌트 기능명세서

---

### 프론트엔드 기능명세서

#### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `components/layout/header.tsx`

1. **로고 섹션**
   - **UI 구성**: 
     - 좌측에 로고 이미지 배치
     - Next.js의 Image 컴포넌트 사용
     - 크기: 높이 32px, 너비는 비율에 맞게 자동 조정
   - **상호작용**:
     - 클릭 시 메인 페이지('/')로 이동
     - hover 시 커서 포인터로 변경

2. **네비게이션 메뉴**
   - **UI 구성**:
     - 우측에 메뉴 아이템 배치
     - 메뉴 순서: '이미지 생성', '내 갤러리'
     - 폰트: 16px, Semi-Bold
     - 메뉴 간격: 32px
   - **상호작용**:
     - hover 시 하단에 2px 두께의 메인 색상(#4A90E2) 언더라인 표시
     - 현재 페이지 메뉴는 활성화 상태로 표시 (메인 색상으로 강조)

3. **전체 레이아웃**
   - **UI 구성**:
     - 높이: 64px
     - 배경색: 흰색(#FFFFFF)
     - 하단 보더: 1px solid #E5E7EB
     - 최대 너비: 1200px
     - 좌우 패딩: 24px
     - position: fixed (스크롤 시에도 상단에 고정)
     - z-index: 50 (다른 요소들 위에 표시)

#### 2. 컴포넌트 구현

```typescript:components/layout/header.tsx
interface IHeaderProps {
  currentPath: string;
}

export const Header = ({ currentPath }: IHeaderProps) => {
  const navigation = [
    { name: '이미지 생성', href: '/generate' },
    { name: '내 갤러리', href: '/gallery' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Artify"
            width={0}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
        
        <nav className="flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-base font-semibold hover:text-primary transition-colors relative",
                currentPath === item.href
                  ? "text-primary after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : "text-gray-600"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
```

#### 3. 상태 관리

1. **현재 페이지 상태**
   - `usePathname` 훅을 사용하여 현재 경로 추적
   - 현재 페이지에 해당하는 메뉴 아이템 활성화 상태로 표시

2. **반응형 처리**
   - 모바일 뷰에서는 메뉴를 햄버거 메뉴로 변경 (추후 구현)
   - 브레이크포인트: 768px

#### 4. 접근성

1. **키보드 내비게이션**
   - 모든 메뉴 아이템에 대해 키보드 포커스 가능
   - Tab 키로 순차적 이동 가능
   - Enter 키로 메뉴 선택 가능

2. **스크린 리더 지원**
   - 로고 이미지에 적절한 alt 텍스트 제공
   - ARIA 레이블 적용으로 메뉴 구조 명확히 전달

3. **색상 대비**
   - 텍스트와 배경색의 대비율 WCAG 기준 준수
   - 활성화된 메뉴 아이템은 색상으로만 구분하지 않고 언더라인 함께 사용

#### 3. 인증 기능

1. **인증 버튼 섹션**
   - **위치**: 네비게이션 메뉴 우측에 배치
   - **비로그인 상태**:
     - '로그인' 버튼 표시
     - 클릭 시 Clerk 모달 로그인 폼 표시
   - **로그인 상태**:
     - UserButton 컴포넌트 표시
     - 사용자 프로필 이미지 표시
     - 클릭 시 프로필 관리 드롭다운 메뉴 표시
   - **스타일링**:
     - 버튼 크기: 40px x 40px
     - 로그인 버튼: 프라이머리 컬러 사용
     - UserButton: 기본 Clerk 스타일 적용

2. **인증 상태 관리**
   - `SignedIn`, `SignedOut` 컴포넌트로 조건부 렌더링
   - `UserButton`의 로그아웃 후 메인 페이지로 리다이렉션
   - 모달 방식의 로그인 폼 사용