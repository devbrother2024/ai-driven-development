## 이미지 생성 화면 기능명세서

---

### 프론트엔드 기능명세서

#### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `app/generate/page.tsx`

1. **프롬프트 섹션**
   - **UI 구성**: 화면 상단에 배치된 프롬프트 입력 필드
   - **프롬프트 입력 필드**:
     - ShadcN의 `Textarea` 컴포넌트 사용
     - 여러 줄 입력이 가능한 텍스트 영역으로 구현
     - 최대 500자 제한
     - placeholder: "생성하고 싶은 이미지를 자세히 설명해주세요..."
   - **오류 처리**: 
     - 빈 프롬프트 입력 시 "프롬프트를 입력해 주세요" 메시지 표시
     - 글자 수 초과 시 "500자 이내로 입력해 주세요" 메시지 표시

2. **스타일 옵션 섹션**
   - **파일 위치**: `components/generate/StyleOptions.tsx`
   - **UI 구성**:
     - 스타일 카테고리별 드롭다운 메뉴 (ShadcN의 `Select` 컴포넌트 사용)
   - **스타일 옵션 항목**:
     ```typescript
     interface IStyleOptions {
       artStyle: string;      // 예술 스타일 (수채화, 유화, 디지털아트, 펜화)
       colorTone: string;     // 색조 (밝은, 어두운, 파스텔, 흑백)
     }
     ```
   - **상호작용**:
     - 각 옵션 변경 시 실시간으로 상태 업데이트
     - 기본값: { artStyle: '디지털아트', colorTone: '밝은' }

3. **이미지 생성 섹션**
   - **파일 위치**: `components/generate/ImageGeneration.tsx`
   - **UI 구성**:
     - 이미지 생성 버튼 (ShadcN의 `Button` 컴포넌트 사용)
     - 로딩 상태 표시 (Loader2 아이콘 애니메이션)
     - 생성된 이미지 프리뷰 영역 (Next.js Image 컴포넌트)
   - **상호작용**:
     - 생성 버튼 클릭 시 로딩 상태 표시
     - 이미지 생성 완료 시 프리뷰 표시
     - 생성 중에는 버튼 비활성화

4. **생성된 이미지 관리 섹션**
   - **파일 위치**: `components/generate/GeneratedImageActions.tsx`
   - **UI 구성**:
     - 갤러리에 저장하기 버튼
     - 공유하기 버튼
     - 다운로드 버튼
   - **상호작용**:
     - 저장: 갤러리 저장 시 토스트 메시지 표시
     - 공유: 준비 중 메시지 표시
     - 다운로드: 
       - 이미지를 Blob으로 변환하여 로컬 저장
       - 파일명: generated-image-{timestamp}.jpg
       - 다운로드 완료/실패 시 토스트 메시지 표시

#### 2. 사용자 흐름 및 상호작용

1. **이미지 생성 프로세스**
   ```
   프롬프트 입력 → 스타일 옵션 선택 → 이미지 생성 버튼 클릭 
   → 로딩 표시(2초) → 이미지 생성 완료 → 결과 이미지 표시
   ```

2. **이미지 관리 프로세스**
   ```
   이미지 생성 완료 → 저장/공유/다운로드 선택 
   → 작업 수행 → 토스트 메시지로 결과 표시
   ```

---

### 백엔드 기능명세서

#### 1. 이미지 생성 API

- **파일 위치**: `app/api/generate/route.ts`
- **HTTP 메서드**: `POST`
- **요청 데이터**:
  ```typescript
  interface IGenerateRequest {
    prompt: string;
    styleOptions: {
      artStyle: string;
      colorTone: string;
    }
  }
  ```
- **응답 데이터**:
  ```typescript
  interface IGenerateResponse {
    success: boolean;
    imageUrl: string;
    error?: string;
  }
  ```

#### 2. 이미지 저장 API

- **파일 위치**: `app/api/images/save/route.ts`
- **HTTP 메서드**: `POST`
- **요청 데이터**:
  ```typescript
  interface ISaveImageRequest {
    imageUrl: string;
    prompt: string;
    styleOptions: {
      artStyle: string;
      colorTone: string;
    }
  }
  ```
- **응답 데이터**:
  ```typescript
  interface ISaveImageResponse {
    success: boolean;
    message: string;
  }
  ```

#### 3. 데이터베이스 스키마

```typescript
// GeneratedImage 테이블
{
  id: string;
  imageUrl: string;
  prompt: string;
  styleOptions: {
    artStyle: string;
    colorTone: string;
  };
  createdAt: string;
  isPublic: boolean;
}
```

#### 4. 에러 처리

- **생성 실패 시 에러 코드**:
  - `INVALID_PROMPT`: 프롬프트 누락 또는 길이 초과
  - `GENERATION_FAILED`: 이미지 생성 실패
  - `SAVE_FAILED`: 갤러리 저장 실패
  - `DOWNLOAD_FAILED`: 다운로드 실패

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