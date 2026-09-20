"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  FolderKanban,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";

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
  status: string;
  priority: string;
  project_id: number;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [p, t] = await Promise.all([
        apiFetch<Project[]>("/api/projects/"),
        apiFetch<Task[]>("/api/tasks/?page=1&limit=100"),
      ]);

      setProjects(p);
      setTasks(t);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!name.trim()) return;

    try {
      if (editing) {
        await apiFetch(`/api/projects/${editing}`, {
          method: "PATCH",
          body: JSON.stringify({
            name,
            description,
          }),
        });
      } else {
        await apiFetch("/api/projects/", {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
          }),
        });
      }

      setName("");
      setDescription("");
      setEditing(null);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function remove(id: number) {
    if (
      !confirm(
        "Delete this project? Its tasks will also be deleted."
      )
    )
      return;

    try {
      await apiFetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <AppShell
      title="Projects"
      subtitle="Create, organize and track your work."
    >
      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">

        {/* CREATE / EDIT PROJECT */}
        <div className="card h-fit rounded-[28px] p-6">

          <div className="mb-5 flex items-center gap-3">
            <div className="brand-mark">
              <Plus size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-[#3d281d]">
                {editing ? "Edit project" : "New project"}
              </h2>

              <p className="text-xs text-[#62483a]">
                Saved directly to PostgreSQL
              </p>
            </div>
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="
              glass mb-3 w-full rounded-2xl px-4 py-3
              text-sm text-[#3d281d]
              placeholder:text-[#80685a]
              outline-none
              focus:border-[#79533c]
            "
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={5}
            className="
              glass w-full resize-none rounded-2xl px-4 py-3
              text-sm text-[#3d281d]
              placeholder:text-[#80685a]
              outline-none
              focus:border-[#79533c]
            "
          />

          {error && (
            <p className="mt-3 text-xs font-medium text-red-800">
              {error}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={save}
              className="
                flex-1 rounded-2xl
                bg-[#4b3022]
                py-3
                text-sm font-semibold
                text-white
                shadow-md
                transition
                hover:bg-[#392318]
              "
            >
              {editing ? "Update" : "Create"}
            </button>

            {editing && (
              <button
                onClick={() => {
                  setEditing(null);
                  setName("");
                  setDescription("");
                }}
                className="
                  rounded-2xl
                  bg-white/45
                  px-4
                  text-sm font-medium
                  text-[#4b3022]
                  transition
                  hover:bg-white/65
                "
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* PROJECTS */}
        <div className="grid gap-4 md:grid-cols-2">

          {projects.map((p) => {
            const ts = tasks.filter(
              (t) => t.project_id === p.id
            );

            const done = ts.filter(
              (t) => t.status === "COMPLETED"
            ).length;

            const percent = ts.length
              ? Math.round((done / ts.length) * 100)
              : 0;

            return (
              <div
                key={p.id}
                className="
                  card rounded-[26px] p-5
                  text-[#3d281d]
                  transition duration-200
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >

                {/* TOP */}
                <div className="flex items-start justify-between">

                  <div
                    className="
                      flex h-11 w-11
                      items-center justify-center
                      rounded-xl
                      bg-[#62402d]
                      text-white
                      shadow-sm
                    "
                  >
                    <FolderKanban size={18} />
                  </div>

                  <div className="flex gap-1">

                    <button
                      onClick={() => {
                        setEditing(p.id);
                        setName(p.name);
                        setDescription(p.description || "");
                      }}
                      className="
                        rounded-xl p-2
                        text-[#4f3628]
                        transition
                        hover:bg-white/50
                      "
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      onClick={() => remove(p.id)}
                      className="
                        rounded-xl p-2
                        text-red-800
                        transition
                        hover:bg-white/50
                      "
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>
                </div>

                {/* PROJECT INFO */}
                <h3 className="mt-5 text-lg font-bold text-[#3b261b]">
                  {p.name}
                </h3>

                <p
                  className="
                    mt-1 min-h-10
                    text-xs leading-5
                    text-[#62483a]
                  "
                >
                  {p.description || "No description"}
                </p>

                {/* PROGRESS INFO */}
                <div
                  className="
                    mt-5 flex justify-between
                    text-[11px] font-semibold
                    text-[#4f3628]
                  "
                >
                  <span>
                    {ts.length} {ts.length === 1 ? "task" : "tasks"}
                  </span>

                  <span className="text-[#60402d]">
                    {percent}% complete
                  </span>
                </div>

                {/* PROGRESS BAR */}
                <div
                  className="
                    mt-2 h-2
                    overflow-hidden
                    rounded-full
                    bg-[#cbb8a2]/45
                  "
                >
                  <span
                    className="
                      block h-full
                      rounded-full
                      bg-[#60402d]
                      transition-all duration-500
                    "
                    style={{
                      width: `${percent}%`,
                    }}
                  />
                </div>

              </div>
            );
          })}

          {/* EMPTY STATE */}
          {projects.length === 0 && (
            <div
              className="
                card col-span-full
                flex min-h-72
                items-center justify-center
                rounded-[28px]
                text-sm
                font-medium
                text-[#62483a]
              "
            >
              No projects yet. Create one.
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}