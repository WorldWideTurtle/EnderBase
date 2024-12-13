import { ReactNode } from "react"
import { ProjectProvider } from "./worlds-context"
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

type LayoutProps = {
    children: ReactNode
}

export default async function layout(props : LayoutProps) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return encodedRedirect("error","/sign-in","Sign in first");
    }

    return (
        <ProjectProvider user={user}>
            {props.children}
        </ProjectProvider>
    )
}