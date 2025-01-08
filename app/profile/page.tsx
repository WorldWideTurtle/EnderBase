import { encodedRedirect } from "@/utils/utils";
import { DeleteUser } from "./delete-user";
import { createClient } from "@/utils/supabase/server";
import { deleteUser } from "../actions";

export default async function Page() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return encodedRedirect("error","/sign-in","Sign in first");
    }

    

    const uName = user.user_metadata.user_name ?? user.user_metadata.name ?? user.user_metadata.full_name ?? ""

    return (
        
        <div className="grid grid-flow-row auto-rows-auto m-auto max-w-[30rem] gap-8">
            <h2 className="text-lg">Hey {uName}</h2>
            <hr />
            <div className="flex flex-col gap-2">
                <DeleteUser callback={deleteUser}></DeleteUser>
            </div>
        </div>
    )
}