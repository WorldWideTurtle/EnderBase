import { createClient } from "@/utils/supabase/server";

export async function GET(req : Request, {params} : {params:Promise<{uuid:string}>}) {
    const supabase = await createClient();
    const { uuid } = (await params);

    const {data,error} = await supabase.rpc("manage_invite_link",{in_project_uuid: uuid});

    console.log(data)
    console.log(error)

    if (error) return Response.json({ error: error.message }, {status : 500})
    return Response.json(data, {
        status:200
    });
}