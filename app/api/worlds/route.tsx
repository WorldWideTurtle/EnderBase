import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    let {data, error} = await supabase.from("projects").select("project_uuid,project_name")

    if (error) return Response.json({ error: error.message }, {status : 500})
    return Response.json(data, {
        status:200
    });
}

export async function POST(req : Request) {
    const supabase = await createClient();

    const { name }  = await req.json();
    let {data, error} = await supabase.from("projects").insert({project_name:name}).select().single()

    if (error) return Response.json({ error: error.message }, {status : 500})
    return Response.json(data, {
        status:200
    });
}

export async function DELETE(req : Request) {
    const supabase = await createClient();

    const { id }  = await req.json();
    let {error} = await supabase.from('projects')
        .delete()
        .eq('project_uuid', id);


    if (error) return Response.json({ error: error.message }, {status : 500})
    return Response.json({success:true}, {
        status:200
    });
}