import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

// Supabase 클라이언트 생성 함수
export const createSupabaseClient = async () => {
    const clerkAuth = await auth()
    const clerkToken = await clerkAuth.getToken({
        template: 'supabase'
    })

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${clerkToken}`
                }
            }
        }
    )
}
