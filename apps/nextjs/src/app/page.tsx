import { api, HydrateClient } from "~/trpc/server";
import { AuthButton } from "./_components/AuthButton";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  void api.post.all.prefetch();

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            JV Recipes
          </h1>
          <AuthButton />
        </div>
      </main>
    </HydrateClient>
  );
}
