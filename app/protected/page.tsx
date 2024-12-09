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
        <div>{data?.map(e=>(
          <div key={e.name}>{e.name}</div>
        ))}</div>
    </div>
  );
}