import { GithubAuth } from "@/components/auth/github-auth";
import { GoogleAuth } from "@/components/auth/google-auth";
import { FormMessage, Message } from "@/components/form-message";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64 mx-auto">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        No need to make an account, <br /> use an existing one instead
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <GithubAuth />
        <GoogleAuth />
        <FormMessage message={searchParams} />
      </div>
      
    </form>
  );
}
