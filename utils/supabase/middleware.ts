import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>{
              response.cookies.set(name, value, options);
            });
          },
        }
      },
    );
    

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    if (request.cookies.get("sb-agreedToCookies")?.value != "1") {
      request.cookies.getAll().forEach(e => {
        if (!e.name.startsWith("sb")) return;

        response.cookies.delete(e.name)
        response.cookies.set(e.name,e.value,{
          path: "/",
          sameSite: "lax",
          expires: undefined,
          maxAge: undefined
        })
      })
    }


  const urlPaths = request.nextUrl.pathname.split("/")
  if (urlPaths[1] === "worlds") {
    const {data} = await supabase.rpc("get_user_role_in_project",{p_uuid:urlPaths[2]})

    if (urlPaths.length > 2 && data === null) {
      request.nextUrl.pathname = "/worlds"
      return NextResponse.redirect(request.nextUrl)
    }

    if (urlPaths.length > 3 && data !== 1) {
      request.nextUrl.pathname = "/worlds/" + urlPaths[2]
      return NextResponse.redirect(request.nextUrl)
    }
  }

    // protected routes
    if (request.nextUrl.pathname.startsWith("/worlds") && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/" && !user.error) {
      return NextResponse.redirect(new URL("/worlds", request.url));
    }

    return response;
};
