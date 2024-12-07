## 메인페이지 기능명세서

---

### 프론트엔드 기능명세서

#### 1. 화면 레이아웃 및 디자인 명세

- **파일 위치**: `app/page.tsx` ✅ 구현됨

1. **프롬프트 입력 섹션** ✅ 구현됨
   - **UI 구성**: 화면 상단 중앙에 배치된 텍스트 입력 필드로, ShadCN의 `Input` 컴포넌트를 사용해 간결한 회색 배경으로 설정합니다.
   - **상호작용**: 사용자가 프롬프트 입력 필드에 텍스트를 입력합니다.
   - **오류 처리**: 프롬프트 필드가 비어 있을 경우 "프롬프트를 입력해 주세요"라는 오류 메시지를 표시합니다.
   - **추가 사항**: 사용자가 프롬프트를 입력하지 않으면 이미지 생성 버튼이 비활성화됩니다.

2. **이미지 생성 버튼** ✅ 구현됨
   - **UI 구성**: 프롬프트 입력 필드 하단에 배치되며, ShadCN의 `Button` 컴포넌트를 사용해 직사각형 버튼으로 표시됩니다.
   - **상호작용**: 프롬프트 입력 후 사용자가 버튼을 클릭하면 `/generate` 페이지로 이동합니다.
   - **오류 처리**: 프롬프트 입력이 없는 상태에서 버튼 클릭 시 오류 메시지를 표시하며, 버튼이 비활성화됩니다.

3. **커뮤니티 피드 섹션** ✅ 구현됨
   - **UI 구성**: 메인 화면 하단에 카드형 그리드 레이아웃으로 표시되며, 반응형으로 구현됩니다.
   - **상호작용**: 
     - 각 카드에는 썸네일 이미지, 사용자명, 좋아요, 댓글 수가 표시됩니다.
     - 좋아요 버튼 클릭 시 상태가 토글되며 카운트가 업데이트됩니다.
     - 댓글 아이콘 클릭 시 댓글 모달이 열립니다.
     - 카드 클릭 시 상세 페이지(`/post/[postId]`)로 이동합니다.
   - **카드 호버 효과**: 마우스 호버 시 자연스러운 그림자와 스케일 효과를 적용합니다.

4. **댓글 모달** ✅ 구현됨
   - **파일 위치**: `components/CommentsModal.tsx`
   - **UI 구성**:
     - 모달 상단: 제목 표시
     - 댓글 입력 필드와 작성 버튼
     - 댓글 목록: 스크롤 가능한 영역에 댓글들을 시간 순으로 표시
   - **상호작용**:
     - 댓글 작성: 입력 필드에 텍스트 입력 후 작성 버튼 클릭 또는 Enter 키로 작성
     - 모달 닫기: 외부 영역 클릭 또는 ESC 키로 닫기 가능

5. **피드 상세 화면** ✅ 구현됨
   - **파일 위치**: `app/post/[postId]/page.tsx`
   - **UI 구성**:
     - 좌측: 생성된 이미지를 큰 크기로 표시
     - 우측: 작성자 정보, 프롬프트, 상호작용 버튼, 댓글 섹션
   - **상호작용**:
     - 좋아요 버튼 클릭 시 상태 토글
     - 댓글 작성 및 목록 표시
     - 공유 기능
     - 메인 페이지로 돌아가기

#### 2. 사용자 흐름 및 상호작용

1. **프롬프트 입력 → 이미지 생성 페이지 이동** ✅ 구현됨
   - 사용자가 프롬프트 입력 후 이미지 생성 버튼을 클릭하면 `/generate` 페이지로 이동합니다.
   
2. **커뮤니티 피드 상호작용** ✅ 구현됨
   - 좋아요 버튼 클릭: 좋아요 상태 토글 및 카운트 업데이트
   - 댓글 아이콘 클릭: 댓글 모달 열기
   - 카드 클릭: 상세 페이지로 이동

3. **댓글 작성 및 관리** ✅ 구현됨
   - 모달 또는 상세 페이지에서 댓글 작성 가능
   - 댓글 목록 실시간 업데이트
   - 스크롤을 통한 댓글 목록 탐색

---

### 백엔드 기능명세서

#### 1. 프롬프트를 통한 이미지 생성 API ✅ 구현됨

- **파일 위치**: `app/api/generate/route.ts`
- **HTTP 메서드**: `POST`
- **요청 데이터**: 
  ```typescript
  interface IGenerateRequest {
    prompt: string;
    styleOptions: {
      artStyle: string;  // 디지털아트, 수채화, 유화, 펜화, 연필화, 로고_미니멀, 로고_3D, 로고_그라디언트, 로고_빈티지, 로고_모던
      colorTone: string; // 밝은, 어두운, 파스텔, 흑백, 컬러풀, 모노톤, 메탈릭
    };
  }
  ```
- **응답 데이터**: 
  ```typescript
  // 성공 응답
  interface IGenerateResponse {
    success: true;
    imageUrl: string;
  }
  
  // 실패 응답
  interface IErrorResponse {
    success: false;
    error: {
      code: string;    // UNAUTHORIZED | INVALID_PROMPT | GENERATION_FAILED
      message: string;
    };
  }
  ```

#### 2. 커뮤니티 피드 API ✅ 구현됨

- **파일 위치**: `app/api/community/feed/route.ts`
- **설명**: 각 사용자들이 자신의 갤러리에서 공개(isPublic: true)로 설정한 모든 이미지들을 조회하는 API입니다. 페이지네이션과 정렬 기능을 제공하여 효율적인 피드 탐색이 가능합니다.
- **HTTP 메서드**: `GET`
- **요청 데이터**: 
  ```typescript
  {
    page?: number;
    limit?: number;
    sortBy?: 'latest' | 'oldest';
  }
  ```
- **응답 데이터**: 
  ```typescript
  {
    posts: Array<{
      postId: string;
      imageURL: string;
      userName: string;
      likes: number;
      comments: number;
      isLiked?: boolean;
      prompt?: string;
      createdAt?: string;
      userProfile?: string;
    }>;
    totalCount: number;
    hasMore: boolean;
  }
  ```

#### 3. 게시물 상세 정보 API ✅ 구현됨

- **파일 위치**: `app/api/post/[postId]/route.ts`
- **HTTP 메서드**: `GET`
- **응답 데이터**: 
  ```typescript
  {
    post: {
      postId: string;
      imageURL: string;
      userName: string;
      likes: number;
      comments: number;
      isLiked: boolean;
      prompt: string;
      createdAt: string;
      userProfile: string;
    };
  }
  ```

#### 4. 좋아요 관리 API ✅ 구현됨

- **파일 위치**: `app/api/post/[postId]/like/route.ts`
- **HTTP 메서드**: 
  - `POST`: 좋아요 토글 (추가/취소)
  - `GET`: 좋아요 상태 조회

**POST 메서드 (좋아요 토글)**
- **요청 데이터**: 없음 (postId는 URL 파라미터로 전달)
- **응답 데이터**: 
  ```typescript
  {
    success: boolean;
    likes: number;      // 전체 좋아요 수
    isLiked: boolean;   // 토글 후 좋아요 상태
    error?: {
      code: string;     // UNAUTHORIZED | POST_NOT_FOUND | INTERNAL_SERVER_ERROR
      message: string;
    };
  }
  ```

**GET 메서드 (좋아요 상태 조회)**
- **요청 데이터**: 없음 (postId는 URL 파라미터로 전달)
- **응답 데이터**: 
  ```typescript
  {
    success: boolean;
    likes: number;      // 전체 좋아요 수
    isLiked: boolean;   // 현재 사용자의 좋아요 상태
    error?: {
      code: string;     // UNAUTHORIZED | INTERNAL_SERVER_ERROR
      message: string;
    };
  }
  ```

#### 5. 댓글 관리 API ✅ 구현됨

- **파일 위치**: `app/api/post/[postId]/comments/route.ts`
- **HTTP 메서드**: 
  - `GET`: 댓글 목록 조회
  - `POST`: 새 댓글 작성
- **요청 데이터 (POST)**:
  ```typescript
  {
    content: string;
  }
  ```
- **응답 데이터**: 
  ```typescript
  // GET 응답
  {
    comments: Array<{
      id: string;
      postId: string;
      userName: string;
      content: string;
      createdAt: string;
      userProfile?: string;
    }>;
  }

  // POST 응답
  {
    success: boolean;
    comment?: {
      id: string;
      postId: string;
      userName: string;
      content: string;
      createdAt: string;
      userProfile?: string;
    };
    error?: {
      code: string;
      message: string;
    };
  }
  ```

#### 6. 데이터베이스 스키마 ✅ 구현됨

- **파일 위치**: `db/schema.ts`