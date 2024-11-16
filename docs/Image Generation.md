## 이미지 생성 화면 기능명세서

---

### 프론트엔드 기능명세서

#### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `app/generate/page.tsx`

1. **프롬프트 섹션**
   - **UI 구성**: 화면 상단에 배치된 프롬프트 입력 필드와 스타일 옵션 선택 영역
   - **프롬프트 입력 필드**:
     - ShadcN의 `Textarea` 컴포넌트 사용
     - 메인 페이지에서 전달받은 프롬프트가 기본값으로 표시
     - 여러 줄 입력이 가능한 텍스트 영역으로 구현
     - 최대 500자 제한
   - **오류 처리**: 
     - 빈 프롬프트 입력 시 "프롬프트를 입력해 주세요" 메시지 표시
     - 글자 수 초과 시 "500자 이내로 입력해 주세요" 메시지 표시

2. **스타일 옵션 섹션**
   - **파일 위치**: `components/StyleOptions.tsx`
   - **UI 구성**:
     - 스타일 카테고리별 드롭다운 메뉴 (ShadcN의 `Select` 컴포넌트 사용)
     - 각 옵션에 대한 ���라이더 컨트롤 (ShadcN의 `Slider` 컴포넌트 사용)
   - **스타일 옵션 항목**:
     ```typescript
     interface IStyleOptions {
       artStyle: string;      // 예술 스타일 (수채화, 유화, 디지털아트 등)
       colorTone: string;     // 색조 (밝은, 어두운, 파스텔 등)
       mood: string;          // 분위기 (따뜻한, 차가운, 몽환적인 등)
       detailLevel: number;   // 디테일 수준 (1-10)
       contrast: number;      // 대비 (1-10)
       brightness: number;    // 밝기 (1-10)
     }
     ```
   - **상호작용**:
     - 각 옵션 변경 시 실시간으로 상태 업데이트
     - 옵션 변경에 따른 시각적 피드백 제공
     - 기본값 제공 및 초기화 버튼 구현

3. **이미지 생성 섹션**
   - **파일 위치**: `components/ImageGeneration.tsx`
   - **UI 구성**:
     - 이미지 생성 버튼 (ShadcN의 `Button` 컴포넌트 사용)
     - 로딩 상태 표시 영역
     - 생성된 이미지 프리뷰 영역
   - **상호작용**:
     - 생성 버튼 클릭 시 API 호출 및 로딩 상태 표시
     - 이미지 생성 완료 시 프리뷰 표시
     - 재생성 버튼으로 같은 프롬프트로 다시 생성 가능
   - **오류 처리**:
     - API 오류 발생 시 오류 메시지 표시
     - 재시도 버튼 제공

4. **생성된 이미지 관리 섹션**
   - **파일 위치**: `components/GeneratedImageActions.tsx`
   - **UI 구성**:
     - 이미지 저장 버튼
     - 커뮤니티 공유 버튼
     - 다운로드 버튼
   - **상호작용**:
     - 저장: 개인 갤러리에 저장
     - 공유: 커뮤니티 게시물 작성 페이지로 이동
     - 다운로드: 로컬 저장소에 이미지 다운로드

#### 2. 사용자 흐름 및 상호작용

1. **이미지 생성 프로세스**
   ```
   프롬프트 입력/수정 → 스타일 옵션 설정 → 이미지 생성 버튼 클릭 
   → 로딩 표시 → 이미지 생성 완료 → 결과 이미지 표시
   ```

2. **이미지 관리 프로세스**
   ```
   이미지 생성 완료 → 저장/공유/다운로드 선택 
   → 선택한 작업 수행 → 완료 메시지 표시
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
    styleOptions: IStyleOptions;
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
    styleOptions: IStyleOptions;
    userId: string;
  }
  ```
- **응답 데이터**:
  ```typescript
  interface ISaveImageResponse {
    success: boolean;
    savedImageId: string;
    error?: string;
  }
  ```

#### 3. 데이터베이스 스키마

```typescript
// GeneratedImage 테이블
{
  id: string;
  userId: string;
  imageUrl: string;
  prompt: string;
  styleOptions: IStyleOptions;
  createdAt: string;
  isPublic: boolean;
}
```

#### 4. 에러 처리

- **생성 실패 시 에러 코드**:
  - `INVALID_PROMPT`: 유효하지 않은 프롬프트
  - `GENERATION_FAILED`: 이미지 생성 실패
  - `SAVE_FAILED`: 저장 실패
  - `QUOTA_EXCEEDED`: 사용량 초과

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