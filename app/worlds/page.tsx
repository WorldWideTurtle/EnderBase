import { World } from "@/components/world";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Data } from "./data";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  //let {data, error} = await supabase.from("projects").select("*")

  return (
    <div>
        <Data />
    </div>
  );
}