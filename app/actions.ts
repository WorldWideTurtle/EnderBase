"use server";

import { createClient } from "@/utils/supabase/server";
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
}

export async function DeclineCookies() {
  const store = await cookies()
  store.set("sb-agreedToCookies","0",{
    path:"/",
  })
}