'use client'

import { AuthProvider } from "@/components/auth/auth-provider";
import { FormMessage, Message } from "@/components/form-message";
import GithubIcon from "@/Icons/github-logo.svg"
import GoogleIcon from "@/Icons/google-logo.svg"
import DiscordIcon from "@/Icons/discord-logo.svg"
import { useState } from "react";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  let [isSigningIn, setSigningIn] = useState(false);

  let toggle = () => setSigningIn(true)
  
  return (
    <form className="flex-1 flex flex-col min-w-64 mx-auto">
      <h1 className="text-3xl font-medium text-center">Sign in</h1>
      <p className="text-base text-foreground text-center">
        No need to make an account, <br /> use an existing one instead.
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8 *:text-lg">
        <AuthProvider onClick={toggle} disabled={isSigningIn} provider="github" icon={<GithubIcon className="fill-[#f3eded] dark:fill-[#161614]"/>} />
        <AuthProvider onClick={toggle} disabled={isSigningIn} provider="discord" icon={<DiscordIcon />} />
        <AuthProvider onClick={toggle} disabled={isSigningIn} provider="google" icon={<GoogleIcon />} />
        <FormMessage message={searchParams} />
      </div>
      
    </form>
  );
}
