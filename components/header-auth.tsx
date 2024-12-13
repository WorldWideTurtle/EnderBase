import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ProfileIcon } from "./profile-icon";

type userData = {
  user_name: string
}

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <ProfileIcon user={user}/>
  ) : (
    <Button aria-label="Sign in" asChild size="sm" variant={"outline"}>
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
}
