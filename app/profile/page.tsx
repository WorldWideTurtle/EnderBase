import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { createClient as CC } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { DeleteUser } from "./delete-user";

export default async function Page() {
    const supabase = await CC();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return encodedRedirect("error","/sign-in","Sign in first");
    }

    async function deleteUser() {
        'use server'

        const supabase = await CC();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return

        const supabaseAdmin = await createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!, 
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        supabase.auth.signOut()
        supabaseAdmin.auth.admin.deleteUser(user.id);

        return redirect("/")
    }

    const uName = user.user_metadata.user_name ?? user.user_metadata.name ?? user.user_metadata.full_name ?? ""

    return (
        
        <div className="grid grid-flow-row auto-rows-auto m-auto max-w-[30rem] gap-8">
            <h2 className="text-lg">Hey {uName}</h2>
            <div className="flex flex-col gap-2">
                <DeleteUser callback={deleteUser}></DeleteUser>
            </div>
        </div>
    )
}