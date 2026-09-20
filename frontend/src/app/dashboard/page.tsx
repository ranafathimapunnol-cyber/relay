"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  FolderKanban,
  Plus,
  Users,
  Zap,
  ArrowUpRight,
  Clock3,
} from "lucide-react";

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
  owner_id: number;
  created_at: string;
  updated_at: string;
};

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  project_id: number;
  created_by: number;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [me, projectData, taskData] = await Promise.all([
        apiFetch<User>("/api/auth/me"),
        apiFetch<Project[]>("/api/projects/"),
        apiFetch<Task[]>("/api/tasks/?page=1&limit=100"),
      ]);

      setUser(me);
      setProjects(projectData);
      setTasks(taskData);
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const completion =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  const progress = (projectId: number) => {
    const projectTasks = tasks.filter(
      (task) => task.project_id === projectId
    );

    if (!projectTasks.length) return 0;

    const completed = projectTasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;

    return Math.round(
      (completed / projectTasks.length) * 100
    );
  };

  const recentActivity = [
    ...projects.map((project) => ({
      date: project.updated_at,
      text: `Project "${project.name}" updated`,
    })),
    ...tasks.map((task) => ({
      date: task.updated_at,
      text: `Task "${task.title}" updated`,
    })),
  ]
    .sort(
      (a, b) =>
        +new Date(b.date) - +new Date(a.date)
    )
    .slice(0, 5);

  if (loading) {
    return (
      <main className="app-bg flex min-h-screen items-center justify-center">
        <div className="card rounded-3xl px-8 py-6 text-sm text-[#3b261b]">
          Loading Relay...
        </div>
      </main>
    );
  }

  return (
    <AppShell>
      <div className="space-y-5">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <section className="card overflow-hidden rounded-[30px] p-7 md:p-9">

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8a573a]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#60402d]">
                  Workspace overview
                </p>
              </div>

              <h1 className="serif text-4xl leading-none tracking-tight text-[#352217] md:text-5xl">
                Welcome back,
                <br />

                <span className="text-[#60402d]">
                  {user?.name}
                </span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-6 text-[#5f4637]">
                Here&apos;s a quick look at your projects,
                tasks, and workspace activity.
              </p>
            </div>

            <button
              onClick={() => router.push("/projects")}
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#60402d] px-5 py-3 text-xs font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#503426]"
            >
              View projects

              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>

          </div>
        </section>

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">

          {[
            {
              icon: FolderKanban,
              label: "Projects",
              value: projects.length,
              note: "Active workspace",
            },
            {
              icon: CircleCheck,
              label: "Tasks",
              value: tasks.length,
              note: "Total tasks",
            },
            {
              icon: Check,
              label: "Completed",
              value: completedTasks,
              note: `${completion}% completion`,
            },
            {
              icon: Users,
              label: "Team",
              value: "—",
              note: "Workspace members",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="card group rounded-[24px] p-5 transition duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/30">
                    <Icon
                      size={18}
                      className="text-[#60402d]"
                    />
                  </div>

                  <ArrowUpRight
                    size={14}
                    className="text-[#60402d] opacity-0 transition group-hover:opacity-100"
                  />
                </div>

                <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-[#60402d]">
                  {stat.label}
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <p className="text-3xl font-semibold tracking-tight text-[#352217]">
                    {stat.value}
                  </p>
                </div>

                <p className="mt-1 text-[10px] font-medium text-[#6a4e3d]">
                  {stat.note}
                </p>
              </div>
            );
          })}

        </section>

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">

          <div className="space-y-5">

            {/* PROJECT PROGRESS */}

            <div className="card rounded-[28px] p-6">

              <div className="mb-7 flex items-center justify-between">

                <div>
                  <h2 className="serif text-2xl text-[#352217]">
                    Project progress
                  </h2>

                  <p className="mt-1 text-xs font-medium text-[#62483a]">
                    Based on completed tasks
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/25 px-3 py-2 text-[10px] font-semibold text-[#60402d]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Live
                  <ChevronDown size={12} />
                </div>

              </div>

              {projects.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                  {projects.slice(0, 4).map((project) => {
                    const value = progress(project.id);

                    return (
                      <button
                        key={project.id}
                        onClick={() =>
                          router.push(
                            `/projects?project=${project.id}`
                          )
                        }
                        className="group text-left"
                      >

                        <div className="relative h-[150px] overflow-hidden rounded-2xl border border-[#795039]/10 bg-[#795039]/5">

                          <div
                            className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-gradient-to-t from-[#6f442f] to-[#c9956d] transition-all duration-700 group-hover:from-[#5e3928]"
                            style={{
                              height: `${value}%`,
                            }}
                          />

                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                            <span className="text-xs font-semibold">
                              {value}%
                            </span>

                            <ArrowUpRight
                              size={14}
                              className="opacity-0 transition group-hover:opacity-100"
                            />
                          </div>

                        </div>

                        <p className="mt-3 truncate text-xs font-semibold text-[#493126]">
                          {project.name}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-[#684b3a]">
                          {tasks.filter(
                            (task) =>
                              task.project_id === project.id
                          ).length}{" "}
                          tasks
                        </p>

                      </button>
                    );
                  })}

                </div>
              ) : (
                <div className="flex h-[190px] items-center justify-center rounded-2xl border border-dashed border-[#795039]/15">
                  <div className="text-center">
                    <FolderKanban
                      size={24}
                      className="mx-auto text-[#60402d]"
                    />

                    <p className="mt-3 text-sm font-semibold text-[#493126]">
                      No projects yet
                    </p>

                    <button
                      onClick={() =>
                        router.push("/projects")
                      }
                      className="mt-2 text-xs font-semibold text-[#60402d]"
                    >
                      Create your first project →
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* MY PROJECTS */}

            <div className="card rounded-[28px] p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h2 className="serif text-2xl text-[#352217]">
                    My projects
                  </h2>

                  <p className="mt-1 text-xs font-medium text-[#62483a]">
                    Your active workspace projects
                  </p>
                </div>

                <button
                  onClick={() =>
                    router.push("/projects")
                  }
                  className="text-xs font-semibold text-[#60402d] transition hover:text-[#3f281c]"
                >
                  View all →
                </button>

              </div>

              <div className="space-y-2">

                {projects.slice(0, 5).map(
                  (project, index) => {
                    const value = progress(project.id);

                    return (
                      <button
                        key={project.id}
                        onClick={() =>
                          router.push(
                            `/projects?project=${project.id}`
                          )
                        }
                        className="group flex w-full items-center gap-4 rounded-2xl p-3 text-left transition hover:bg-white/30"
                      >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#60402d] text-xs font-semibold text-white">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-semibold text-[#493126]">
                            {project.name}
                          </p>

                          <p className="mt-1 text-[10px] font-medium text-[#684b3a]">
                            {
                              tasks.filter(
                                (task) =>
                                  task.project_id ===
                                  project.id
                              ).length
                            }{" "}
                            tasks
                          </p>

                        </div>

                        <div className="hidden w-24 md:block">

                          <div className="h-1.5 overflow-hidden rounded-full bg-[#795039]/10">
                            <span
                              className="block h-full rounded-full bg-[#795039]"
                              style={{
                                width: `${value}%`,
                              }}
                            />
                          </div>

                        </div>

                        <span className="w-9 text-right text-xs font-semibold text-[#60402d]">
                          {value}%
                        </span>

                        <ChevronRight
                          size={15}
                          className="text-[#60402d] transition group-hover:translate-x-0.5"
                        />

                      </button>
                    );
                  }
                )}

                {projects.length === 0 && (
                  <div className="py-10 text-center">
                    <p className="text-sm font-medium text-[#62483a]">
                      No projects yet.
                    </p>

                    <button
                      onClick={() =>
                        router.push("/projects")
                      }
                      className="mt-2 text-xs font-semibold text-[#60402d]"
                    >
                      Create a project →
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* RECENT TASKS */}

            <div className="card rounded-[28px] p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h2 className="serif text-2xl text-[#352217]">
                    Recent tasks
                  </h2>

                  <p className="mt-1 text-xs font-medium text-[#62483a]">
                    Your latest work
                  </p>
                </div>

                <button
                  onClick={() => router.push("/tasks")}
                  className="text-xs font-semibold text-[#60402d] transition hover:text-[#3f281c]"
                >
                  View all →
                </button>

              </div>

              <div className="space-y-1">

                {tasks.slice(0, 6).map((task) => {

                  const completed =
                    task.status === "COMPLETED";

                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 rounded-2xl px-2 py-3 transition hover:bg-white/20"
                    >

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          completed
                            ? "bg-[#654532] text-white"
                            : "border border-[#775540]/20 bg-white/20 text-[#60402d]"
                        }`}
                      >
                        {completed && (
                          <Check size={14} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-[#493126]">
                          {task.title}
                        </p>

                        <p className="mt-0.5 text-[10px] font-medium text-[#684b3a]">
                          {task.status.replace(
                            "_",
                            " "
                          )}
                        </p>
                      </div>

                      <span className="rounded-full bg-orange-100/60 px-2.5 py-1 text-[9px] font-semibold uppercase text-orange-800">
                        {task.priority}
                      </span>

                    </div>
                  );
                })}

                {tasks.length === 0 && (
                  <div className="py-10 text-center">
                    <CircleCheck
                      size={25}
                      className="mx-auto text-[#60402d]"
                    />

                    <p className="mt-3 text-sm font-medium text-[#62483a]">
                      No tasks yet.
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ================================================= */}

          <aside className="space-y-5">

            {/* Workspace card */}

            <div className="relative overflow-hidden rounded-[28px] bg-[#60402d] p-6 text-white shadow-xl">

              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#d6a47c]/20 blur-2xl" />

              <div className="relative">

                <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                  Relay workspace
                </p>

                <h3 className="serif mt-4 text-3xl leading-tight text-white">
                  Stay focused.
                  <br />
                  Keep building.
                </h3>

                <p className="mt-4 text-xs leading-5 text-white/80">
                  Manage your projects and tasks from
                  one focused workspace.
                </p>

              </div>

            </div>

            {/* Quick actions */}

            <div className="card rounded-[26px] p-5">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h3 className="text-sm font-semibold text-[#352217]">
                    Quick actions
                  </h3>

                  <p className="mt-1 text-[10px] font-medium text-[#684b3a]">
                    Jump straight into your work
                  </p>
                </div>

                <Zap
                  size={15}
                  className="text-[#60402d]"
                />

              </div>

              <div className="space-y-2">

                <button
                  onClick={() =>
                    router.push("/projects")
                  }
                  className="group flex w-full items-center gap-3 rounded-2xl bg-white/20 p-3 text-left transition hover:bg-white/35"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#60402d] text-white">
                    <Plus size={17} />
                  </div>

                  <div>
                    <b className="block text-xs font-semibold text-[#493126]">
                      New project
                    </b>

                    <small className="text-[9px] font-medium text-[#684b3a]">
                      Create a project
                    </small>
                  </div>

                  <ArrowUpRight
                    size={14}
                    className="ml-auto text-[#60402d] opacity-0 transition group-hover:opacity-100"
                  />

                </button>

                <button
                  onClick={() =>
                    router.push("/tasks")
                  }
                  className="group flex w-full items-center gap-3 rounded-2xl bg-white/20 p-3 text-left transition hover:bg-white/35"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#60402d] text-white">
                    <CircleCheck size={17} />
                  </div>

                  <div>
                    <b className="block text-xs font-semibold text-[#493126]">
                      New task
                    </b>

                    <small className="text-[9px] font-medium text-[#684b3a]">
                      Add a task
                    </small>
                  </div>

                  <ArrowUpRight
                    size={14}
                    className="ml-auto text-[#60402d] opacity-0 transition group-hover:opacity-100"
                  />

                </button>

              </div>

            </div>

            {/* Activity */}

            <div className="card rounded-[26px] p-5">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h3 className="text-sm font-semibold text-[#352217]">
                    Latest activity
                  </h3>

                  <p className="mt-1 text-[10px] font-medium text-[#684b3a]">
                    Recent workspace updates
                  </p>
                </div>

                <CalendarDays
                  size={15}
                  className="text-[#60402d]"
                />

              </div>

              {recentActivity.length > 0 ? (
                <div className="space-y-4">

                  {recentActivity.map(
                    (activity, index) => (
                      <div
                        key={index}
                        className="flex gap-3"
                      >

                        <div className="relative flex flex-col items-center">

                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#8a573a]" />

                          {index <
                            recentActivity.length -
                              1 && (
                            <span className="absolute top-4 h-full w-px bg-[#795039]/15" />
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] font-medium leading-4 text-[#574136]">
                            {activity.text}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-[9px] font-medium text-[#765b49]">
                            <Clock3 size={9} />

                            {new Date(
                              activity.date
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="py-6 text-center">
                  <CalendarDays
                    size={22}
                    className="mx-auto text-[#60402d]"
                  />

                  <p className="mt-3 text-xs font-medium text-[#62483a]">
                    Activity will appear here.
                  </p>
                </div>
              )}

            </div>

          </aside>

        </section>

      </div>
    </AppShell>
  );
}