import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { TimeBasedText } from "@/components/time-based-text";
import LogoIcon from "@/Icons/Logo.svg"
import { cookies } from "next/headers";
import { CookieBanner } from "@/components/cookie-banner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "EnderBase",
  description: "The easiest way to keep track of those color combinations.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-dvh flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-2 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"} className="font-bold md:text-xl grid grid-cols-[auto_auto] items-center h-full gap-1"> <LogoIcon className="h-full w-auto"/> <span className="py-2 hidden md:inline">EnderBase</span></Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThemeSwitcher />
                    <HeaderAuth />
                  </div>
                </div>
              </nav>
              <div className="flex-1 flex-col px-4 gap-20 max-w-5xl w-full py-2">
                {children}
              </div>
              <footer className="w-full border-t mx-auto text-center text-xs gap-8 p-4 px-5">
                &copy; <TimeBasedText type="year"></TimeBasedText> WorldWideTurtle. All rights reserverd
              </footer>
            </div>
          </main>
          {!cookieStore.has("sb-agreedToCookies") ? <CookieBanner/> : ""}
        </ThemeProvider>
      </body>
    </html>
  );
}
