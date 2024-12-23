import { createServerClient } from "@supabase/ssr";
import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";
import { JWT_KEY } from "./jwt-utils";

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
    const session = await supabase.auth.getSession();
    const access_token = session.data.session?.access_token as string
    const { payload } = access_token === undefined ? {payload:null} : await jwtVerify(access_token,JWT_KEY); 
    let loggedIn = false;

    if (payload === null) {
      const {data} = await supabase.auth.getUser();

      if (data.user) {
        loggedIn = true;
      }
    } else {
      loggedIn = true;
    }

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

    // protected routes
    if (request.nextUrl.pathname.startsWith("/worlds") && !loggedIn) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/" && loggedIn) {
      return NextResponse.redirect(new URL("/worlds", request.url));
    }

    return response;
};
