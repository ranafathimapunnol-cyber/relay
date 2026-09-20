"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await apiFetch("/api/team/users");
        setUsers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load team"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, []);

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#8b6b52]">
            Collaboration
          </p>

          <h1 className="mt-2 text-4xl font-serif text-[#3f2b20]">
            Team
          </h1>

          <p className="mt-2 text-[#765f50]">
            People working across your Relay workspace.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border border-white/50 bg-white/35 p-8 backdrop-blur-xl">
            Loading team members...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50/70 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-lg backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8b6b52] text-lg font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold text-[#3f2b20]">
                      {user.name}
                    </h2>

                    <p className="truncate text-sm text-[#765f50]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <span className="inline-flex rounded-full bg-white/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#765f50]">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="rounded-3xl border border-white/50 bg-white/40 p-10 text-center backdrop-blur-xl">
            <p className="text-[#765f50]">No team members found.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
