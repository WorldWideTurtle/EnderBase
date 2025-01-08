"use server";

import { createAdminClient, createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};


export async function AgreeCookies() {
  const store = await cookies()
  store.set("sb-agreedToCookies","1",{
    path:"/",
    expires: 99999999999,
    maxAge: 99999999999
  })

  let allCookies = store.getAll();
  allCookies.forEach(e=>{
    if (!e.name.startsWith("sb")) return;

    store.delete(e.name)
    store.set(e.name,e.value,{
        path: "/",
        sameSite: "lax",
        expires: 99999999999,
        maxAge: 99999999999
      })
  })
}

export async function DeclineCookies() {
  const store = await cookies()
  store.set("sb-agreedToCookies","0",{
    path:"/",
  })
}

export async function deleteUser() {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return

        const supabaseAdmin = await createAdminClient();

        await supabase.auth.signOut();
        await supabaseAdmin.auth.admin.deleteUser(user.id);

        return redirect("/")
    }