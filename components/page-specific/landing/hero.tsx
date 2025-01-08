import Link from "next/link";
import { Button } from "../../ui/button";
import { HeroBG } from "./hero-bg";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center h-full">
      <HeroBG></HeroBG>
      <div className="mt-8 text-center">
        <h2 className="md:text-5xl text-4xl font-bold">The Enderchest</h2>
        <h2 className="text-2xl -mt-2 text-violet-700">For your Enderchests</h2>
      </div>
      <div>
        <span>Start by </span>
        <Button aria-label="Sign in" asChild size="sm" variant={"default"}>
          <Link href="/sign-in">Signing in</Link>
        </Button>
      </div>
    </div>
  );
}
