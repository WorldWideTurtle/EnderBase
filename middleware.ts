import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  const urlPaths = request.nextUrl.pathname.split("/")
  if (urlPaths[1] === "worlds") {
    const supabase = await createClient()
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
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
