'use client'
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export function GithubAuth() {

    async function signInWithGithub() {
        const { data, error } = await createClient().auth.signInWithOAuth({
            provider: 'github',
        })
    }

    return (
        <Button onClick={signInWithGithub}>
            Github
        </Button>
    )
}