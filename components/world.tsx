import Link from "next/link"


type Props = {
    project: {
        project_name: string,
        project_uuid: string
    }
}

export function World({project} : Props ) {
    return (
        <Link className="p-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg cursor-pointer" href={`/worlds/${project.project_uuid}`}>
            {project.project_name}
        </Link>
    )
}