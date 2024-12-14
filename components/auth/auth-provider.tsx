'use client'

import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { ReactNode, useState } from "react";
import LoadingSpinnerIcon from "@/Icons/loading-spinner.svg"

type Props = {
    provider : "discord" | "github" | "google"
    icon: ReactNode
}

export function AuthProvider(props : Props) {
    const [pending, setPending] = useState<boolean>(false)
    async function signIn() {
        await createClient().auth.signInWithOAuth({
            provider: props.provider,
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
        })
        setPending(true)
    }
    
    return (
        <div className="w-full relative">
            <Button onClick={signIn} className="w-full flex *:h-full *:w-auto gap-2 items-center justify-start">
                {props.icon}
                {props.provider.replace(/^./,(text) => text.toUpperCase())}
            </Button>
            {pending ? <LoadingSpinnerIcon className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] fill-white dark:fill-black"/> : ""}
        </div>
    )
}