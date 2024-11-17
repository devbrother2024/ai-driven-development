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
     - URL 파라미터로 전달된 프롬프트 자동 입력 기능
   - **오류 처리**: 
     - 빈 프롬프트 입력 시 "프롬프트를 입력해 주세요" 메시지 표시
     - 글자 수 초과 시 "500자 이내로 입력해 주세요" 메시지 표시
     - 오류 발생 시 toast로 알림 표시

2. **스타일 옵션 섹션**
   - **파일 위치**: `components/generate/StyleOptions.tsx`
   - **UI 구성**:
     - 스타일 카테고리별 드롭다운 메뉴 (ShadcN의 `Select` 컴포넌트 사용)
   - **스타일 옵션 항목**:
     ```typescript
     interface IStyleOptions {
       artStyle: '디지털아트' | '수채화' | '유화' | '펜화' | '연필화';
       colorTone: '밝은' | '어두운' | '파스텔' | '흑백' | '컬러풀';
     }
     ```
   - **상호작용**:
     - 각 옵션 변경 시 실시간으로 상태 업데이트
     - 기본값: { artStyle: '디지털아트', colorTone: '밝은' }

3. **이미지 생성 섹션**
   - **파일 위치**: `components/generate/ImageGeneration.tsx`
   - **UI 구성**:
     - 이미지 생성 버튼 (ShadcN의 `Button` 컴포넌트 사용)
     - 로딩 상태 표시 (isGenerating 상태에 따른 UI 변경)
     - 생성된 이미지 프리뷰 영역
   - **상호작용**:
     - 생성 버튼 클릭 시 로딩 상태 표시
     - 이미지 생성 완료 시 프리뷰 표시 및 toast 알림
     - 생성 중에는 입력 필드와 버튼 비활성화

4. **생성된 이미지 관리 섹션**
   - **파일 위치**: `components/generate/GeneratedImageActions.tsx`
   - **UI 구성**: 이미지 생성 완료 시에만 표시
   - **기능**: 이미지 URL, 프롬프트, 스타일 옵션 정보 포함

---

### 백엔드 기능명세서

#### 1. 이미지 생성 API

- **파일 위치**: `app/api/generate/route.ts`
- **HTTP 메서드**: `POST`
- **스타일 매핑 시스템**:
  ```typescript
  const styleMapping = {
    artStyle: {
      '디지털아트': 'digital art, highly detailed',
      '수채화': 'watercolor painting, soft brushstrokes',
      '유화': 'oil painting, textured',
      '펜화': 'pen and ink drawing, line art',
      '연필화': 'pencil sketch, detailed shading'
    },
    colorTone: {
      '밝은': 'bright colors, vibrant, high key lighting',
      '어두운': 'dark tones, moody, low key lighting',
      '파스텔': 'pastel colors, soft tones',
      '흑백': 'black and white, monochrome',
      '컬러풀': 'colorful, saturated colors'
    }
  }
  ```
- **Replicate API 설정**:
  ```typescript
  {
    model: "black-forest-labs/flux-schnell",
    input: {
      prompt: enhancedPrompt,
      aspect_ratio: "16:9",
      num_outputs: 1,
      go_fast: true,
      megapixels: "1",
      output_format: "webp",
      output_quality: 90,
      negative_prompt: "blurry, low quality, distorted, deformed"
    }
  }
  ```
- **폴링 시스템**:
  - 최대 대기 시간: 30초
  - 폴링 간격: 1초
  - 상태 확인: succeeded, failed 상태 모니터링

#### 2. 에러 처리

- **에러 코드 및 메시지**:
  ```typescript
  interface IErrorResponse {
    success: false;
    error: {
      code: 'INVALID_PROMPT' | 'GENERATION_FAILED';
      message: string;
    }
  }
  ```
- **처리되는 에러 상황**:
  - 프롬프트 누락 또는 길이 초과
  - 이미지 생성 시간 초과 (30초)
  - 생성 실패
  - 서버 오류

#### 3. 응답 형식

- **성공 응답**:
  ```typescript
  interface IGenerateResponse {
    success: true;
    imageUrl: string;
  }
  ``` 