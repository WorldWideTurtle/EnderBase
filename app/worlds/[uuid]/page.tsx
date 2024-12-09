import { createClient } from "@/utils/supabase/server"

export default async function Page({params} : {params : Promise<{uuid:string}>}) {
    const uuid = (await params).uuid

    const supabase = await createClient();
    const { data, error } = await supabase
    .from('project_data')
    .select(`*, projects!inner(project_uuid)`)
    .eq('projects.project_uuid', uuid);

    if (error) return (
        <div>This world either does not exist, or you have no permission to view it.</div>
    )

    return (
        <div>
            {data.map(e=>(
                <div key={e.text_value}>{e.number} {e.text_value}</div>
            ))}
        </div>
    )
}