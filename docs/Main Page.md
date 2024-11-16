### 메인페이지 기능명세서

---

#### **프론트엔드 기능명세서**

**1. 화면 레이아웃 및 디자인 명세**

-   **페이지 구조**:

    -   **파일 경로**: `app/page.tsx`
    -   **구성 요소**:
        1. **프롬프트 입력 섹션**:
            - 상단 중앙에 위치.
            - 사용자가 텍스트를 입력하여 이미지를 생성할 수 있는 필드.
            - 하단에 '이미지 생성' 버튼 배치.
        2. **커뮤니티 피드 섹션**:
            - 하단에 최신 및 인기 게시물을 카드 레이아웃으로 표시.
            - 각 카드 클릭 시 상세 페이지로 이동.

-   **컴포넌트 세부 명세**:

    -   **PromptInput.tsx** (ShadCN 컴포넌트):
        -   경로: `components/ui/PromptInput.tsx`
        -   역할: 프롬프트 텍스트 입력.
        -   스타일: ShadCN `Input` 컴포넌트 사용.
    -   **Button.tsx** (ShadCN 컴포넌트):
        -   경로: `components/ui/Button.tsx`
        -   역할: '이미지 생성' 버튼.
        -   스타일: ShadCN `Button` 컴포넌트 사용, 클릭 애니메이션 추가.
    -   **CommunityFeed.tsx**:
        -   경로: `app/CommunityFeed.tsx`
        -   역할: 커뮤니티 피드 섹션을 카드 레이아웃으로 구현.

-   **UI 상호작용**:
    -   **'이미지 생성' 버튼**:
        -   클릭 시 로딩 애니메이션 활성화 및 이미지 생성 요청 전송.
        -   버튼 상태: 활성/비활성화(프롬프트 입력 유무에 따라).
    -   **커뮤니티 피드 카드**:
        -   호버 시 확대 효과와 그림자 표시.
        -   클릭 시 상세 페이지로 이동.

---

**2. 사용자 흐름 및 상호작용**

-   **프롬프트 입력 및 이미지 생성**:

    1. 사용자가 프롬프트 입력 필드에 텍스트 입력.
    2. '이미지 생성' 버튼 클릭.
    3. API 호출을 통해 이미지 생성 요청.
    4. 이미지 생성 후 성공 메시지 표시 및 갤러리에 저장.

-   **커뮤니티 피드 상호작용**:
    1. 카드 클릭 시 해당 게시물의 상세 페이지로 라우팅 (`/posts/[postId]`).
    2. 상세 페이지에서 좋아요, 댓글, 공유 등의 추가 상호작용 제공.

---

**3. API 연동**

-   **이미지 생성 API**:

    -   **URL**: `/api/generate-image`
    -   **HTTP 메서드**: `POST`
    -   **요청 데이터**:
        ```json
        {
            "prompt": "사용자가 입력한 텍스트"
        }
        ```
    -   **응답 데이터**:
        -   성공:
            ```json
            {
                "imageUrl": "생성된 이미지 URL",
                "status": "success"
            }
            ```
        -   실패:
            ```json
            {
                "error": "에러 메시지",
                "status": "error"
            }
            ```

-   **커뮤니티 피드 데이터 API**:
    -   **URL**: `/api/community-feed`
    -   **HTTP 메서드**: `GET`
    -   **응답 데이터**:
        ```json
        [
            {
                "id": "게시물 ID",
                "imageUrl": "이미지 URL",
                "user": "작성자 이름",
                "likes": 10,
                "comments": 5
            }
        ]
        ```

---

**4. 테스트 항목**

-   **프론트엔드**:

    -   프롬프트 입력 필드의 입력 동작 확인.
    -   '이미지 생성' 버튼의 상태 변경 확인 (활성/비활성화).
    -   API 호출 시 로딩 애니메이션 표시 여부 확인.
    -   커뮤니티 피드 카드 클릭 시 상세 페이지 이동 여부.

-   **백엔드**:
    -   이미지 생성 API 요청 및 응답 정상 작동 여부.
    -   커뮤니티 피드 데이터 API에서 데이터 반환 여부.
    -   에러 발생 시 적절한 오류 메시지 반환 여부.

---

#### **백엔드 기능명세서**

**1. API 정의**

-   **이미지 생성 API**:

    -   **파일 경로**: `app/api/generate-image/route.ts`
    -   **HTTP 메서드**: POST
    -   **요청 데이터 구조**: `{ prompt: string }`
    -   **응답 데이터 구조**:
        -   성공: `{ imageUrl: string, status: "success" }`
        -   실패: `{ error: string, status: "error" }`

-   **커뮤니티 피드 데이터 API**:
    -   **파일 경로**: `app/api/community-feed/route.ts`
    -   **HTTP 메서드**: GET
    -   **응답 데이터 구조**:
        -   성공: `[ { id: string, imageUrl: string, user: string, likes: number, comments: number } ]`
        -   실패: `{ error: string, status: "error" }`

---

**2. 데이터베이스 설계 및 연동**

-   **이미지 데이터 모델**:

    -   **테이블 이름**: `images`
    -   **컬럼**:
        -   `id`: string (Primary Key)
        -   `prompt`: string
        -   `imageUrl`: string
        -   `createdAt`: timestamp

-   **커뮤니티 피드 데이터 모델**:
    -   **테이블 이름**: `posts`
    -   **컬럼**:
        -   `id`: string (Primary Key)
        -   `userId`: string (Foreign Key)
        -   `imageUrl`: string
        -   `likes`: number
        -   `comments`: number

---

**3. 테스트 항목**

-   API 요청/응답의 데이터 구조 일치 여부.
-   잘못된 요청에 대한 적절한 오류 처리 여부.
-   데이터베이스에서 이미지와 게시물 데이터의 CRUD 작업 확인.
