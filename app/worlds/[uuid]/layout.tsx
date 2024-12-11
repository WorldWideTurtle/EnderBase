import { ReactNode } from "react"
import { WorldName } from "./world-name"

type LayoutProps = {
    children: ReactNode
}

export default function layout(props : LayoutProps) {
    return (
        <>
            <WorldName />
            <div className="mt-8"></div>
            {props.children}
        </>
        
    )
}