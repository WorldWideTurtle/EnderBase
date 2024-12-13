'use client'

import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";

export function GithubAuth() {
    function signIn() {
        createClient().auth.signInWithOAuth({
            provider: 'github',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
        })
    }
    

    return (
        <Button onClick={signIn}>
            Github
        </Button>
    )
}