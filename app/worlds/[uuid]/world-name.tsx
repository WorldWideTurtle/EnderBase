'use client'

import { useContext, useEffect } from "react";
import { ProjectContext } from "../worlds-context";
import { usePathname } from "next/navigation";

export function WorldName() {
    const projectContext = useContext(ProjectContext)
    const path = usePathname().split("/")[2]

    useEffect(()=>{
        projectContext?.setWorldID(path)
    }, [path])

    return projectContext?.isSwitching ? <Loading /> : <span>{projectContext?.projectName}</span>
}

function Loading() {
    return (
        <span className="text-transparent bg-input animate-pulse">EmptyName</span>
    )
}
