import { World } from "@/components/world";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  let {data, error} = await supabase.from("projects").select("*")

  return (
    <div>
      <h3 className="text-xl">Your worlds</h3>
      <div className="grid grid-cols-3 grid-flow-row auto-rows-fr gap-2 mt-2">
          {data?.map(e=>(
            <World key={e.project_name} project={e}/>
          ))}
      </div>
    </div>
  );
}