import Link from "next/link"
import { WorldIcon } from "./world-icon"
import { project } from "@/db/schemes"


type Props = {
    project: project
    loaded: boolean
}

export function World({project,loaded} : Props ) {
    return (
        <Link title={project.project_name} className={`p-2 border border-input bg-background overflow-hidden hover:bg-accent hover:text-accent-foreground rounded-lg cursor-pointer ${loaded ? "" : "pointer-events-none opacity-40"}`} href={`/worlds/${project.project_uuid}`}>
            <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                <WorldIcon iconIndex={project.icon_id}></WorldIcon>
                <span className="text-ellipsis overflow-hidden text-lg">
                {project.project_name}
                </span>
                
            </div>
        </Link>
    )
}