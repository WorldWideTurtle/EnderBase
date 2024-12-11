import { ReactNode } from "react"
import { ProjectProvider } from "./worlds-context"

type LayoutProps = {
    children: ReactNode
}

export default function layout(props : LayoutProps) {
    return (
        <ProjectProvider>
            {props.children}
        </ProjectProvider>
    )
}