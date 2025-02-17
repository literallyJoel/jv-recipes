import { api, HydrateClient } from "~/trpc/server";
import { AuthButton } from "./_components/AuthButton";
import InputComponent from "./_components/InputComponent";

export default function HomePage() {
  const get = async (key: string) => {
    "use server";
    return await api.cache.get({ key });
  };

  const set = async (key: string, value: string) => {
    "use server";
    return await api.cache.set({ key, value });
  };

  const compute = async (key: string, value: string) => {
    "use server";
    return await api.cache.compute({ key, value });
  };

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            JV Recipes
          </h1>
          <AuthButton />

          <InputComponent get={get} set={set} compute={compute} />
        </div>
      </main>
    </HydrateClient>
  );
}
