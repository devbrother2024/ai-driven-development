# Replicate Flux 모델 사용 가이드

이 가이드는 Next.js 프로젝트에서 Replicate의 Flux 이미지 생성 모델을 설정하고 사용하는 방법을 설명합니다.

## 목차

-   [사전 준비](#사전-준비)
-   [프로젝트 설정](#프로젝트-설정)
-   [API 구현](#api-구현)
-   [프론트엔드 구현](#프론트엔드-구현)
-   [환경 변수 설정](#환경-변수-설정)

## 사전 준비

1. Replicate 계정 생성

-   [Replicate](https://replicate.com) 웹사이트에서 계정을 생성합니다.
-   API 토큰을 발급받습니다.

2. 필요한 패키지 설치

```bash
npm install replicate
```

## 프로젝트 설정

1. Next.js 설정
   `next.config.ts` 파일에 이미지 도메인을 추가합니다:

```typescript
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'replicate.com'
            },
            {
                protocol: 'https',
                hostname: 'replicate.delivery'
            }
        ]
    }
}
```

2. 타입 정의
   `types/flux.ts` 파일을 생성하여 Flux 모델의 입력 타입을 정의합니다:

```typescript
export interface FluxModelInput {
    prompt: string
    seed?: number
    go_fast?: boolean
    megapixels?: '1' | '0.25'
    num_outputs?: number
    aspect_ratio?:
        | '1:1'
        | '16:9'
        | '21:9'
        | '3:2'
        | '2:3'
        | '4:5'
        | '5:4'
        | '3:4'
        | '4:3'
        | '9:16'
        | '9:21'
    output_format?: 'webp' | 'jpg' | 'png'
    output_quality?: number
    num_inference_steps?: number
    disable_safety_checker?: boolean
}
```

## API 구현

1. 이미지 생성 API
   `app/api/predictions/route.ts` 파일을 생성합니다:

```typescript
import { NextResponse } from 'next/server'
import Replicate from 'replicate'
import { FluxModelInput } from '@/types/flux'

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
})

export async function POST(request: Request) {
    if (!process.env.REPLICATE_API_TOKEN) {
        return NextResponse.json(
            { error: 'REPLICATE_API_TOKEN is not set' },
            { status: 500 }
        )
    }

    try {
        const { prompt } = await request.json()
        const prediction = await replicate.predictions.create({
            model: 'black-forest-labs/flux-schnell',
            input: { prompt, aspect_ratio: '16:9' } as FluxModelInput
        })

        return NextResponse.json(prediction, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create prediction' },
            { status: 500 }
        )
    }
}
```

2. 상태 확인 API
   `app/api/predictions/[id]/route.ts` 파일을 생성합니다:

```typescript
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const prediction = await replicate.predictions.get(params.id)
        return NextResponse.json(prediction)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to get prediction' },
            { status: 500 }
        )
    }
}
```

## 프론트엔드 구현

프론트엔드에서는 다음과 같은 기능을 구현해야 합니다:

1. 프롬프트 입력 폼
2. 이미지 생성 요청
3. 생성 상태 폴링
4. 결과 이미지 표시

예시 구현:

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const promptInput = form.prompt as HTMLInputElement

    try {
        const response = await fetch('/api/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: promptInput.value
            })
        })

        let prediction = await response.json()

        // 이미지 생성 상태 폴링
        while (
            prediction.status !== 'succeeded' &&
            prediction.status !== 'failed'
        ) {
            await sleep(1000)
            const response = await fetch('/api/predictions/' + prediction.id)
            prediction = await response.json()
        }
    } catch (error) {
        console.error(error)
    }
}
```

## 환경 변수 설정

1. 프로젝트 루트에 `.env.local` 파일을 생성합니다:

```plaintext
REPLICATE_API_TOKEN=your_api_token_here
```

2. `.gitignore`에 환경 변수 파일이 포함되어 있는지 확인합니다:

```plaintext
.env*
```

## 주요 Flux 모델 파라미터

-   `prompt`: 생성하고 싶은 이미지에 대한 설명 (필수)
-   `aspect_ratio`: 이미지 비율 (기본값: '1:1')
-   `num_outputs`: 생성할 이미지 수 (기본값: 1)
-   `output_format`: 출력 이미지 형식 (webp/jpg/png)
-   `output_quality`: 출력 이미지 품질 (1-100)

## 참고 사항

-   이미지 생성에는 일정 시간이 소요되므로, 적절한 로딩 상태 처리가 필요합니다.
-   API 요청 횟수에 따라 과금될 수 있으므로 사용량을 모니터링하세요.
-   생성된 이미지의 저작권 및 사용 제한 사항을 확인하세요.