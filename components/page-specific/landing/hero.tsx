import Link from "next/link";
import { Button } from "../../ui/button";
import { HeroBG } from "./hero-bg";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center h-full dark">
      <HeroBG></HeroBG>
      <div className="mt-8 text-center">
        <h2 className="md:text-6xl text-4xl font-bold text-foreground">The Enderchest</h2>
        <h2 className="md:text-4xl text-2xl md:-mt-2 -mt-[10px] dark:text-violet-400 font-medium">For your Enderchests</h2>
      </div>
      <div className="text-xl *:text-xl">
        <span className="text-foreground">Start by </span>
        <Button aria-label="Sign in" asChild size="sm" variant={"default"}>
          <Link href="/sign-in">Signing in</Link>
        </Button>
      </div>
    </div>
  );
}
