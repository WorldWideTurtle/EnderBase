'use client'

import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";

export function GoogleAuth() {
    async function signIn() {
        const {data, error} = await createClient().auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
        })

        console.log(error,data)
    }
    

    return (
        <Button onClick={signIn}>
            Google
        </Button>
    )
}