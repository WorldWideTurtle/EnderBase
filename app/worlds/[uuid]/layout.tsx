import { ReactNode } from "react"
import { WorldName } from "./world-name"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

type LayoutProps = {
    params: Promise<{uuid:string}>
    children: ReactNode
}

export default async function layout({children, params} : LayoutProps) {
    const [supabase, {uuid}] = await Promise.all([
        createClient(),
        params
    ])
    const {data} = await supabase.rpc("get_user_role_in_project",{p_uuid:uuid})

    async function LeaveWorld() {
        'use server'

        let supabase = await createClient();
        const {error }= await supabase.rpc("delete_user_from_project",{p_uuid:uuid})
        if (error) {
            console.log(error)
        } else {
            redirect("/worlds")
        }
    }

    return (
        <>
            <div className="flex flex-row-reverse justify-between gap-2 items-center">
                {(data === 1) ? <div className="flex">
                    <Button variant={"outline"} className="p-1 h-fit"><Link href={`/worlds/${uuid}/settings`}>Settings</Link></Button>
                </div> : <form action={LeaveWorld}><Button variant={"destructive"} className="p-1 h-fit" type="submit">Leave world</Button></form>}
                <WorldName />
            </div>
            
            <div className="mt-8"></div>
            {children}
        </>
        
    )
}