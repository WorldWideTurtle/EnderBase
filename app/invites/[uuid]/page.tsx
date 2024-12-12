import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function Page({params} : {params : Promise<{uuid:string}>}) {
    const [supabase, {uuid}] = await Promise.all([
        createClient(),
        params
    ]);

    async function DeleteOldEntries() {
        const { data, error } : {data : {invite_id:string}[] | null, error : PostgrestError |null} = await supabase.rpc("delete_old_invite_links")
        

        if (data && data.find(e=>e.invite_id === uuid)) {return <h1 className="mx-auto w-full">This invite either doesn't exist, or has expired</h1>};
    }
    
    await DeleteOldEntries()

    const [{data : { user }},{error}, {data}] = await Promise.all([
        supabase.auth.getUser(),
        supabase.rpc("add_user_to_project",{invite_uuid:uuid}),
        supabase.from("invite_links").select().eq("uuid",uuid).single()
    ])

    if (!data) {
        return <h1 className="mx-auto w-full">This invite either doesn't exist, or has expired</h1>
    } 

    if (!user) {
        return <h1 className="mx-auto w-full">Log in or make an account, then try again.</h1>
    }

    return redirect("/worlds")
}