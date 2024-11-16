## 갤러리 관리 및 커뮤니티 공유 화면 기능명세서

---

### 프론트엔드 기능명세서

#### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `app/gallery/page.tsx`

1. **갤러리 그리드 섹션**
   - **UI 구성**: 
     - 반응형 그리드 레이아웃 (ShadcN의 `Grid` 컴포넌트 사용)
     - 각 이미지는 1:1 비율의 카드 형태로 표시
     - 무한 스크롤 구현 (12개씩 로딩)
   - **이미지 카드 구성**:
     - 썸네일 이미지 (Next.js Image 컴포넌트)
     - 생성 날짜
     - 카테고리 태그
     - 공개/비공개 상태 표시
   - **상호작용**:
     - 카드 호버 시 액션 버튼 표시 (공유, 수정, 삭제)
     - 카드 클릭 시 상세 모달 열기
     - 드래그 앤 드롭으로 이미지 순서 변경 가능

2. **필터 및 정렬 섹션**
   - **파일 위치**: `components/gallery/GalleryFilters.tsx`
   - **UI 구성**:
     - 카테고리 필터 (ShadcN의 `Select` 컴포넌트)
     - 날짜 범위 필터 (ShadcN의 `DateRangePicker` 컴포넌트)
     - 정렬 옵션 (최신순, 오래된순, 이름순)
     - 공개/비공개 필터
   - **상호작용**:
     - 필터 변경 시 실시간으로 갤러리 목록 업데이트
     - 필터 초기화 버튼

3. **이미지 상세 모달**
   - **파일 위치**: `components/gallery/ImageDetailModal.tsx`
   - **UI 구성**:
     - 원본 이미지 표시
     - 프롬프트 정보
     - 스타일 옵션 정보
     - 생성 날짜
     - 카테고리 및 태그 관리
     - 공개/비공개 설정
   - **상호작용**:
     - 이미지 다운로드
     - 카테고리 및 태그 수정
     - 공개 설정 변경
     - 삭제 확인 다이얼로그

4. **커뮤니티 공유 모달**
   - **파일 위치**: `components/gallery/ShareModal.tsx`
   - **UI 구성**:
     - 제목 입력 필드 (ShadcN의 `Input` 컴포넌트)
     - 설명 입력 필드 (ShadcN의 `Textarea` 컴포넌트)
     - 태그 입력 필드 (ShadcN의 `TagInput` 컴포넌트)
     - 공유 버튼
   - **상호작용**:
     - 입력 필드 유효성 검사
     - 태그 자동 완성
     - 공유 완료 시 토스트 메시지

#### 2. 사용자 흐름 및 상호작용

1. **갤러리 관리 프로세스**
   ```
   갤러리 진입 → 필터/정렬 적용 → 이미지 카드 선택 
   → 상세 모달에서 정보 수정 → 변경사항 저장
   ```

2. **커뮤니티 공유 프로세스**
   ```
   이미지 선택 → 공유 버튼 클릭 → 공유 모달 열기 
   → 정보 입력 → 공유하기 → 완료 메시지
   ```

---

### 백엔드 기능명세서

#### 1. 갤러리 이미지 목록 API

- **파일 위치**: `app/api/gallery/route.ts`
- **HTTP 메서드**: `GET`
- **쿼리 파라미터**:
  ```typescript
  interface IGalleryQuery {
    page: number;
    limit: number;
    category?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: 'latest' | 'oldest' | 'name';
    isPublic?: boolean;
  }
  ```
- **응답 데이터**:
  ```typescript
  interface IGalleryResponse {
    images: IGalleryImage[];
    totalCount: number;
    hasMore: boolean;
  }
  ```

#### 2. 이미지 정보 수정 API

- **파일 위치**: `app/api/gallery/[imageId]/route.ts`
- **HTTP 메서드**: `PATCH`
- **요청 데이터**:
  ```typescript
  interface IUpdateImageRequest {
    categories?: string[];
    tags?: string[];
    isPublic?: boolean;
  }
  ```
- **응답 데이터**:
  ```typescript
  interface IUpdateImageResponse {
    success: boolean;
    message: string;
    image?: IGalleryImage;
  }
  ```

#### 3. 커뮤니티 공유 API

- **파일 위치**: `app/api/community/share/route.ts`
- **HTTP 메서드**: `POST`
- **요청 데이터**:
  ```typescript
  interface ISharePostRequest {
    imageId: string;
    title: string;
    description: string;
    tags: string[];
  }
  ```
- **응답 데이터**:
  ```typescript
  interface ISharePostResponse {
    success: boolean;
    postId?: string;
    error?: string;
  }
  ```

#### 4. 데이터베이스 스키마

```typescript
// GalleryImage 테이블
{
  id: string;
  userId: string;
  imageUrl: string;
  prompt: string;
  styleOptions: {
    artStyle: string;
    colorTone: string;
  };
  categories: string[];
  tags: string[];
  isPublic: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Category 테이블
{
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

// Tag 테이블
{
  id: string;
  name: string;
  useCount: number;
  createdAt: string;
}
```

#### 5. 에러 처리

- **에러 코드**:
  - `INVALID_REQUEST`: 잘못된 요청 파라미터
  - `NOT_FOUND`: 이미지를 찾을 수 없음
  - `UNAUTHORIZED`: 권한 없음
  - `UPDATE_FAILED`: 정보 업데이트 실패
  - `SHARE_FAILED`: 커뮤니티 공유 실패

- **에러 응답 형식**:
  ```typescript
  interface IErrorResponse {
    success: false;
    error: {
      code: string;
      message: string;
    }
  }
  ``` 