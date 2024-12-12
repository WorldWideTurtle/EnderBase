import { ReactNode } from "react"
import { WorldName } from "./world-name"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type LayoutProps = {
    params: Promise<{uuid:string}>
    children: ReactNode
}

export default async function layout({children, params} : LayoutProps) {
    const uuid = (await params).uuid

    return (
        <>
            <div className="flex flex-row-reverse justify-between gap-2 items-center">
                <div className="flex">
                    <Button variant={"outline"} className="p-1 h-fit"><Link href={`/worlds/${uuid}/settings`}>Settings</Link></Button>
                </div>
                <WorldName />
            </div>
            
            <div className="mt-8"></div>
            {children}
        </>
        
    )
}