import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    let {data, error} = await supabase.from("projects").select("*")

    if (error) return Response.json({ error: error.message }, {status : 500})
    return Response.json(data, {
        status:200
    });
}