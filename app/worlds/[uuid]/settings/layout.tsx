import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({children, params} : {children:ReactNode, params: Promise<{uuid:string}>}) {
    const {uuid} = await params;
    const supabase = await createClient()
    const {data} = await supabase.rpc("get_user_role_in_project",{p_uuid:uuid})
    if (data !== 1) {
        return redirect("/worlds/" + uuid)
    }
    
    return children
}