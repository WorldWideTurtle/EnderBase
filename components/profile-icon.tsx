import { Content, Item, Portal, Root, Trigger } from "@radix-ui/react-dropdown-menu"
import { icons, LucideCircleUserRound } from "lucide-react"
import { Button } from "./ui/button"
import { signOutAction } from "@/app/actions"
import { User } from "@supabase/supabase-js"
import Link from "next/link"

export function ProfileIcon({user} : {user : User}) {
    return (
        <Root>
            <Trigger asChild>
                <Button variant={"ghost"} className="p-1" size={"icon"}>
                    <LucideCircleUserRound className="w-full h-full stroke-[1px]"></LucideCircleUserRound>
                </Button>
            </Trigger>
            <Portal>
                <Content className="rounded-md border-input border p-2 bg-card grid grid-cols-1 grid-flow-row auto-rows-auto">
                    <Button type="submit" variant={"ghost"} className="justify-start p-2">
                        <Link href={`/profile`}>Profile</Link>
                    </Button>
                    <form action={signOutAction}>
                        <Button type="submit" variant={"ghost"} className="justify-start p-2">
                            Sign out
                        </Button>
                    </form>

                </Content>
            </Portal>
        </Root>
    )
}