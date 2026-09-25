import type { FC } from "react";
import { useAuth } from "../hooks/useAuth";
import { LogOut, User as UserIcon, Share2 } from "lucide-react";

export const FeedPage: FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Share2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Relaymesh
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-900/80 text-indigo-300">
                <UserIcon className="h-4 w-4" />
              </div>
              <span className="font-semibold text-white">
                {user?.fullName || user?.username}
              </span>
              <span className="text-slate-500">@{user?.username}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-red-950 hover:border-red-800 hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            Welcome to the Distributed Social Feed,{" "}
            {user?.fullName || user?.username}!
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Authentication successfully established with Quarkus 3.x, Neo4j &
            SmallRye JWT.
          </p>
        </div>
      </main>
    </div>
  );
};
