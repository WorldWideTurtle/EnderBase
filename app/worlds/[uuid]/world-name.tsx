'use client'

import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../worlds-context";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function WorldName() {
    const [pathData, setPathData] = useState<string[]>([])
    const projectContext = useContext(ProjectContext)
    const path = usePathname()

    useEffect(()=>{
        setPathData([projectContext?.projectName ?? "ERR",...path.split("/").slice(3)])
    }, [path, projectContext?.projectName])

    return ( 
        projectContext?.isSwitching ? 
        <Loading /> :
        pathData.map((route,index) => {
            if (route === pathData.at(-1) && index > 0) {
                return <span key={index}>/{route}</span>
            } else if (index > 0) {
                return <Link key={index} href={`/worlds/${projectContext?.worldID}/${route}`}>/{route}</Link>
            } else if (pathData.length > 1) {
                return <Link key={index} href={`/worlds/${projectContext?.worldID}`}>{route}</Link>
            } else {
                return <span key={index}>{route}</span>
            }
        })
    )
}

function Loading() {
    return <span className="text-transparent bg-input animate-pulse">InvisibleLoadingText</span>
    
}