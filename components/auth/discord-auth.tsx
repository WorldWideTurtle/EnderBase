'use client'

import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";

export function DiscordAuth() {
    function signIn() {
        createClient().auth.signInWithOAuth({
            provider: 'discord',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
        })
    }
    

    return (
        <Button onClick={signIn}>
            Discord
        </Button>
    )
}