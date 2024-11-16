## 갤러리 관리 및 커뮤니티 공유 화면 기능명세서

---

### 프론트엔드 기능명세서

#### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `app/gallery/page.tsx`

1. **갤러리 그리드 섹션**
   - **UI 구성**: 
     - 반응형 그리드 레이아웃 (1/2/3/4열 자동 조정)
     - 각 이미지는 1:1 비율의 카드 형태로 표시
     - 무한 스크롤 구현 예정 (현재는 정적 목록)
   - **이미지 카드 구성**:
     - 썸네일 이미지 (Next.js Image 컴포넌트)
     - 생성 날짜
     - 카테고리 태그
     - 공개/비공개 상태 표시
   - **상호작용**:
     - 카드 호버 시 액션 버튼 표시 (공유, 삭제)
     - 카드 클릭 시 상세 모달 열기
     - 삭제 시 확인 다이얼로그 표시

2. **필터 및 정렬 섹션**
   - **파일 위치**: `components/gallery/GalleryFilters.tsx`
   - **UI 구성**:
     - 카테고리 필터 (Select 컴포넌트)
     - 날짜 범위 필터 (DatePickerWithRange 컴포넌트)
     - 정렬 옵션 (최신순, 오래된순, 이름순)
     - 공개/비공개 필터
   - **상호작용**:
     - 필터 변경 시 실시간으로 갤러리 목록 업데이트
     - 필터 초기화 버튼으로 모든 필터 초기화

3. **이미지 상세 모달**
   - **파일 위치**: `components/gallery/ImageDetailModal.tsx`
   - **UI 구성**:
     - 원본 이미지 표시
     - 프롬프트 정보
     - 스타일 옵션 정보
     - 생성 날짜
     - 태그 관리
     - 공개/비공개 설정
   - **상호작용**:
     - 태그 추가/삭제
     - 공개 설정 변경
     - 모달 닫기

4. **커뮤니티 공유 모달**
   - **파일 위치**: `components/gallery/ShareModal.tsx`
   - **UI 구성**:
     - 제목 입력 필드
     - 설명 입력 필드
     - 태그 입력 및 관리
     - 공유 버튼
   - **상호작용**:
     - 태그 추가/삭제
     - 입력 필드 유효성 검사
     - 공유 완료 시 토스트 메시지 (예정)

#### 2. 상태 관리

- **파일 위치**: `store/gallery.ts`
- **주요 기능**:
  1. **이미지 목록 관리**
     - 전체 이미지 목록 저장
     - 필터링된 이미지 목록 관리
     - 이미지 삭제 기능
  
  2. **필터 상태 관리**
     - 카테고리, 날짜 범위, 정렬 기준, 공개 설정 상태 관리
     - 필터 초기화 기능
     - 실시간 필터링 적용

#### 3. 사용자 흐름

1. **갤러리 관리 프로세스**
   ```
   갤러리 진입 → 필터/정렬 적용 → 이미지 카드 선택 
   → 상세 모달에서 정보 확인/수정 → 변경사항 저장
   ```

2. **이미지 삭제 프로세스**
   ```
   삭제 버튼 클릭 → 확인 다이얼로그 표시 → 확인 시 삭제 
   → 토스트 메시지 표시 → 목록 업데이트
   ```

3. **커뮤니티 공유 프로세스**
   ```
   공유 버튼 클릭 → 공유 모달 열기 → 정보 입력 
   → 공유하기 → 완료 메시지
   ```

---

### 백엔드 기능명세서

#### 1. 갤러리 이미지 관리 API

- **파일 위치**: `app/api/gallery/route.ts`
- **엔드포인트**:
  1. **이미지 목록 조회**
     - **HTTP 메서드**: `GET`
     - **쿼리 파라미터**:
       ```typescript
       interface IGalleryQuery {
           page: number
           limit: number
           category?: string
           startDate?: string
           endDate?: string
           sortBy?: 'latest' | 'oldest' | 'name'
           isPublic?: boolean
       }
       ```
     - **응답 데이터**:
       ```typescript
       interface IGalleryResponse {
           images: IGalleryImage[]
           totalCount: number
           hasMore: boolean
       }
       ```

  2. **이미지 삭제**
     - **HTTP 메서드**: `DELETE`
     - **경로**: `/api/gallery/[imageId]`
     - **응답 데이터**:
       ```typescript
       interface IDeleteResponse {
           success: boolean
           message: string
       }
       ```

  3. **이미지 정보 수정**
     - **HTTP 메서드**: `PATCH`
     - **경로**: `/api/gallery/[imageId]`
     - **요청 데이터**:
       ```typescript
       interface IUpdateImageRequest {
           tags?: string[]
           isPublic?: boolean
       }
       ```
     - **응답 데이터**:
       ```typescript
       interface IUpdateImageResponse {
           success: boolean
           image?: IGalleryImage
       }
       ```

#### 2. 커뮤니티 공유 API

- **파일 위치**: `app/api/community/share/route.ts`
- **HTTP 메서드**: `POST`
- **요청 데이터**:
  ```typescript
  interface ISharePostRequest {
      imageId: string
      title: string
      description: string
      tags: string[]
  }
  ```
- **응답 데이터**:
  ```typescript
  interface ISharePostResponse {
      success: boolean
      postId?: string
      error?: string
  }
  ```

#### 3. 데이터베이스 스키마

```typescript
// GalleryImage 테이블
{
  id: string
  userId: string
  imageUrl: string
  prompt: string
  styleOptions: {
    artStyle: string
    colorTone: string
  }
  categories: string[]
  tags: string[]
  isPublic: boolean
  order: number
  createdAt: string
  updatedAt: string
}

// Category 테이블
{
  id: string
  userId: string
  name: string
  createdAt: string
}

// Tag 테이블
{
  id: string
  name: string
  useCount: number
  createdAt: string
}
```

#### 4. 에러 처리

- **에러 코드**:
  - `INVALID_REQUEST`: 잘못된 요청 파라미터
  - `NOT_FOUND`: 이미지를 찾을 수 없음
  - `UNAUTHORIZED`: 권한 없음
  - `UPDATE_FAILED`: 정보 업데이트 실패
  - `SHARE_FAILED`: 커뮤니티 공유 실패

- **에러 응답 형식**:
  ```typescript
  interface IErrorResponse {
    success: false
    error: {
      code: string
      message: string
    }
  }
  ``` 