import { createClient } from "@/utils/supabase/server";

export async function GET(req : Request, {params} : {params:Promise<{uuid:string}>}) {
    const [supabase, { uuid }] = await Promise.all([
        createClient(),
        params,
    ]);

    const { data, error } = await supabase.rpc('get_project_data_by_uuid', { input_uuid: uuid});

    if (error) return Response.json({ error: error.message }, {status : 500})
    return Response.json(data, {status : 200});
}

export async function POST(req : Request, {params} : {params:Promise<{uuid:string}>}) {
    const [supabase, { uuid }, {row}] = await Promise.all([
        createClient(),
        params,
        req.json()
    ]);

    const { data, error } = await supabase.rpc('insert_project_data', { 
        input_uuid: uuid, 
        input_number: row.input_number, 
        input_text_value: row.input_text_value, 
        input_is_ender_chest: row.input_is_ender_chest
    });

    if (error) return Response.json({ error: error.message }, {status : 500})
    return Response.json(data, {status : 200});
}

export async function DELETE(req : Request) {
    const [supabase, { rowId }] = await Promise.all([
        createClient(),
        req.json(),
    ]);
    
    // Delete a row
    const { error } = await supabase
        .from('project_data')
        .delete()
        .eq('id', rowId);

    if (error) return Response.json({ error: error.message }, {status : 500})
    return Response.json({success:true});
}