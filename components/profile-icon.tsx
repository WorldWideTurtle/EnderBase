import { Content, Item, Portal, Root, Trigger } from "@radix-ui/react-dropdown-menu"
import { LucideCircleUserRound } from "lucide-react"
import { Button } from "./ui/button"
import { signOutAction } from "@/app/actions"

export function ProfileIcon({userName} : {userName : string}) {
    return (
        <Root>
            <Trigger asChild>
                <Button variant={"outline"}>
                    <LucideCircleUserRound></LucideCircleUserRound>
                </Button>
            </Trigger>
            <Portal>
                <Content className="rounded-md border-input border p-4 bg-card">

                    <h2>Hello there, <br /> {userName}</h2>


                    <Button type="submit" variant={"outline"}>
                        
                    </Button>


                    <form action={signOutAction}>
                        <Button type="submit" variant={"outline"}>
                            Sign out
                        </Button>
                    </form>

                </Content>
            </Portal>
        </Root>
    )
}