"use client";

import {
  ArrowRight,
  FolderKanban,
  ListTodo,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Project = {
  id: number;
  name: string;
  description: string | null;
};

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  project_id: number;
};

export default function SearchPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const q = params.get("q") || "";

    setQuery(q);

    async function load() {
      try {
        const me = await apiFetch<User>(
          "/api/auth/me"
        );

        const [projectData, taskData] =
          await Promise.all([
            apiFetch<Project[]>(
              me.role === "ADMIN"
                ? "/api/admin/projects"
                : "/api/projects/"
            ),
            apiFetch<Task[]>(
              me.role === "ADMIN"
                ? "/api/admin/tasks"
                : "/api/tasks/?page=1&limit=100"
            ),
          ]);

        setProjects(projectData);
        setTasks(taskData);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  const term = query.trim().toLowerCase();

  const matchingProjects = projects.filter(
    (project) =>
      !term ||
      project.name.toLowerCase().includes(term) ||
      project.description
        ?.toLowerCase()
        .includes(term)
  );

  const matchingTasks = tasks.filter(
    (task) =>
      !term ||
      task.title.toLowerCase().includes(term) ||
      task.description
        ?.toLowerCase()
        .includes(term) ||
      task.status.toLowerCase().includes(term) ||
      task.priority.toLowerCase().includes(term)
  );

  return (
    <AppShell
      title="Search"
      subtitle="Find projects and tasks in your workspace"
    >
      {loading ? (
        <div className="card rounded-[28px] p-8 text-sm text-[#806d60]">
          Searching your workspace...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card rounded-[28px] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#60402d] text-white">
                <Search size={19} />
              </div>

              <div>
                <p className="text-xs text-[#806d60]">
                  Search results for
                </p>

                <h2 className="serif text-2xl text-[#503426]">
                  “{query}”
                </h2>
              </div>
            </div>
          </div>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="serif text-2xl text-[#503426]">
                Projects
              </h2>

              <span className="text-xs text-[#806d60]">
                {matchingProjects.length} result
                {matchingProjects.length === 1
                  ? ""
                  : "s"}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {matchingProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() =>
                    router.push(
                      `/projects?project=${project.id}`
                    )
                  }
                  className="card flex items-center gap-4 rounded-[24px] p-5 text-left transition hover:-translate-y-1"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#60402d] text-white">
                    <FolderKanban size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {project.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#806d60]">
                      {project.description ||
                        "No description"}
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-[#806d60]"
                  />
                </button>
              ))}

              {matchingProjects.length === 0 && (
                <div className="card rounded-[24px] p-6 text-sm text-[#806d60]">
                  No matching projects.
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="serif text-2xl text-[#503426]">
                Tasks
              </h2>

              <span className="text-xs text-[#806d60]">
                {matchingTasks.length} result
                {matchingTasks.length === 1
                  ? ""
                  : "s"}
              </span>
            </div>

            <div className="space-y-3">
              {matchingTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() =>
                    router.push("/tasks")
                  }
                  className="card flex w-full items-center gap-4 rounded-[24px] p-4 text-left transition hover:-translate-y-0.5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/50">
                    <ListTodo size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {task.title}
                    </p>

                    <p className="mt-1 text-[10px] text-[#806d60]">
                      {task.status.replace(
                        "_",
                        " "
                      )}{" "}
                      · {task.priority}
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-[#806d60]"
                  />
                </button>
              ))}

              {matchingTasks.length === 0 && (
                <div className="card rounded-[24px] p-6 text-sm text-[#806d60]">
                  No matching tasks.
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
