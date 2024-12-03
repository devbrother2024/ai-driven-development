import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { IGenerateRequest, IGenerateResponse, IErrorResponse } from '@/types'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { auth, getAuth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { images } from '@/db/schema'

// Replicate 클라이언트 초기화
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
})

// Supabase 클라이언트 초기화
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        global: {
            // Get the custom Supabase token from Clerk
            fetch: async (url, options = {}) => {
                const clerkAuth = await auth()
                const clerkToken = await clerkAuth.getToken({
                    template: 'supabase'
                })

                // Insert the Clerk Supabase token into the headers
                const headers = new Headers(options?.headers)
                headers.set('Authorization', `Bearer ${clerkToken}`)

                // Now call the default fetch
                return fetch(url, {
                    ...options,
                    headers
                })
            }
        }
    }
)

export async function POST(request: NextRequest) {
    try {
        // 사용자 인증 확인
        const { userId } = getAuth(request)
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: '인증되지 않은 사용자입니다.'
                    }
                } as IErrorResponse,
                { status: 401 }
            )
        }

        // 요청 데이터 파싱
        const { prompt, styleOptions }: IGenerateRequest = await request.json()

        // 입력값 검증
        if (!prompt || prompt.length > 500) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_PROMPT',
                        message:
                            '프롬프트가 누락되었거나 길이가 초과되었습니다.'
                    }
                } as IErrorResponse,
                { status: 400 }
            )
        }

        // 스타일 옵션을 더 구체적으로 프롬프트에 반영
        const styleMapping = {
            artStyle: {
                디지털아트: 'digital art, highly detailed',
                수채화: 'watercolor painting, soft brushstrokes',
                유화: 'oil painting, textured',
                펜화: 'pen and ink drawing, line art',
                연필화: 'pencil sketch, detailed shading',
                로고_미니멀:
                    'minimal logo design, clean lines, simple shapes, professional, vector style',
                로고_3D:
                    '3D logo design, depth, glossy surface, professional branding, modern',
                로고_그라디언트:
                    'gradient logo design, smooth color transitions, modern branding, professional',
                로고_빈티지:
                    'vintage logo design, retro style, classic branding, timeless',
                로고_모던:
                    'modern logo design, contemporary style, sleek, professional branding'
            },
            colorTone: {
                밝은: 'bright colors, vibrant, high key lighting',
                어두운: 'dark tones, moody, low key lighting',
                파스텔: 'pastel colors, soft tones',
                흑백: 'black and white, monochrome',
                컬러풀: 'colorful, saturated colors',
                모노톤: 'monochromatic color scheme, professional, clean',
                메탈릭: 'metallic finish, silver and gold tones, premium look'
            }
        }

        // 스타일 매핑에서 해당하는 스타일 설명 가져오기
        const artStyleDesc =
            styleMapping.artStyle[
                styleOptions.artStyle as keyof typeof styleMapping.artStyle
            ] || styleOptions.artStyle
        const colorToneDesc =
            styleMapping.colorTone[
                styleOptions.colorTone as keyof typeof styleMapping.colorTone
            ] || styleOptions.colorTone

        // 프롬프트와 스타일을 조합하여 향상된 프롬프트 생성
        const enhancedPrompt = `${prompt}, ${artStyleDesc}, ${colorToneDesc}, high quality, masterpiece, professional logo design, branding, commercial use`

        // Replicate API 호출 시 추가 매개변수 설정
        const prediction = await replicate.predictions.create({
            model: 'black-forest-labs/flux-schnell',
            input: {
                prompt: enhancedPrompt,
                aspect_ratio: '1:1',
                num_outputs: 1,
                go_fast: true,
                megapixels: '1',
                output_format: 'webp',
                output_quality: 90,
                negative_prompt: 'blurry, low quality, distorted, deformed' // 품질 향상을 위한 네거티브 프롬프트 추가
            }
        })

        // 이미지 생성 상태 확인을 위한 폴링
        let finalPrediction = prediction
        let retryCount = 0
        const maxRetries = 30 // 최대 30초 대기

        while (
            finalPrediction.status !== 'succeeded' &&
            finalPrediction.status !== 'failed' &&
            retryCount < maxRetries
        ) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            finalPrediction = await replicate.predictions.get(prediction.id)
            retryCount++
        }

        // 타임아웃 또는 생성 실패 시
        if (retryCount >= maxRetries || finalPrediction.status === 'failed') {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'GENERATION_FAILED',
                        message:
                            retryCount >= maxRetries
                                ? '이미지 생성 시간이 초과되었습니다.'
                                : '이미지 생성에 실패했습니다.'
                    }
                } as IErrorResponse,
                { status: 500 }
            )
        }

        // 이미지 생성이 완료되면 Supabase에 저장
        if (finalPrediction.status === 'succeeded') {
            const imageUrl = finalPrediction.output[0]

            // 이미지 다운로드
            const imageResponse = await fetch(imageUrl)
            const imageBlob = await imageResponse.blob()

            // 파일 경로 생성
            const fileUuid = uuidv4()
            const filePath = `${userId}/${fileUuid}.webp`

            // Supabase Storage에 이미지 업로드
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, imageBlob, {
                    contentType: 'image/webp',
                    cacheControl: '3600'
                })

            if (uploadError) {
                throw new Error('이미지 업로드 실패: ' + uploadError.message)
            }

            // 데이터베이스에 메타데이터 저장
            await db.insert(images).values({
                userId,
                filePath,
                prompt,
                artStyle: styleOptions.artStyle,
                colorTone: styleOptions.colorTone,
                tags: [],
                isPublic: false
            })

            // Supabase 스토리지 URL 생성
            const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filePath}`

            // 성공 응답
            return NextResponse.json({
                success: true,
                imageUrl: storageUrl
            } as IGenerateResponse)
        }

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'GENERATION_FAILED',
                    message: '이미지 생성에 실패했습니다.'
                }
            } as IErrorResponse,
            { status: 500 }
        )
    } catch (error) {
        console.error('Image generation error:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'GENERATION_FAILED',
                    message: '서버 오류가 발생했습니다.'
                }
            } as IErrorResponse,
            { status: 500 }
        )
    }
}
