'use client'

import { Button } from "./ui/button";
import { AgreeCookies, DeclineCookies } from "@/app/actions";

export function CookieBanner() {
    return (
        <div className="fixed bottom-4 w-full max-w-96 left-[50%] translate-x-[-50%]">
            <div className="bg-input p-4">
                <h2 className="text-center text-xl">This site uses cookies</h2>
                <p className="opacity-60 text-sm">This site uses cookies to store your <strong>Login sessions</strong>. By clicking <strong>"Agree"</strong> you agree that <strong>permanent cookies</strong> are used to remember you after signing in.</p>
                <form className="flex gap-1 mt-2 justify-center">
                    <Button formAction={AgreeCookies}>Agree</Button>
                    <Button formAction={DeclineCookies}>Decline</Button>
                </form>
            </div>
        </div>
    )
}