"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Plus,
  Trash2,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import { apiFetch } from "@/lib/api";

type Project = {
  id: number;
  name: string;
};

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  project_id: number;
  assigned_to: number | null;
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("TODO");

  const [error, setError] = useState("");

  // =========================
  // LOAD TASKS + PROJECTS
  // =========================

  async function load() {
    try {
      setError("");

      const [t, p] = await Promise.all([
        apiFetch<Task[]>(
          "/api/tasks/?page=1&limit=100"
        ),
        apiFetch<Project[]>(
          "/api/projects/"
        ),
      ]);

      setTasks(t);
      setProjects(p);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // =========================
  // CREATE TASK
  // =========================

  async function create() {
    if (!title.trim() || !projectId) {
      setError("Title and project are required");
      return;
    }

    try {
      setError("");

      await apiFetch("/api/tasks/", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          project_id: Number(projectId),
        }),
      });

      setTitle("");
      setDescription("");
      setProjectId("");
      setPriority("MEDIUM");
      setStatus("TODO");

      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  // =========================
  // CHANGE TASK STATUS
  // =========================

  async function changeStatus(
    id: number,
    value: string
  ) {
    try {
      setError("");

      await apiFetch(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: value,
        }),
      });

      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  // =========================
  // DELETE TASK
  // =========================

  async function remove(id: number) {
    try {
      setError("");

      await apiFetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  // =========================
  // GET PROJECT NAME
  // =========================

  function getProjectName(projectId: number) {
    return (
      projects.find(
        (p) => p.id === projectId
      )?.name || "Project"
    );
  }

  // =========================
  // STATUS LABEL
  // =========================

  function getStatusLabel(status: string) {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  }

  return (
    <AppShell
      title="Tasks"
      subtitle="Keep work moving from TODO to COMPLETED."
    >
      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">

        {/* ================================================= */}
        {/* CREATE TASK CARD */}
        {/* ================================================= */}

        <section
          className="
            relative
            h-fit
            overflow-hidden
            rounded-[28px]
            border border-white/40
            bg-white/30
            p-6
            shadow-[0_20px_60px_rgba(65,40,25,0.12)]
            backdrop-blur-2xl
          "
        >
          {/* subtle glass highlight */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-px
              bg-white/60
            "
          />

          {/* HEADER */}

          <div className="mb-6 flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-[#60402d]
                text-white
                shadow-[0_8px_20px_rgba(70,43,28,0.20)]
              "
            >
              <Plus size={20} />
            </div>

            <div>
              <h2
                className="
                  text-base
                  font-semibold
                  text-[#3d281d]
                "
              >
                New task
              </h2>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-[#62483a]
                "
              >
                Create and organize your work
              </p>
            </div>
          </div>

          {/* TASK TITLE */}

          <div className="mb-3">
            <label
              className="
                mb-1.5
                block
                text-[11px]
                font-semibold
                text-[#62483a]
              "
            >
              Task title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter task title"
              className="
                w-full
                rounded-2xl
                border border-[#76523b]/20
                bg-white/25
                px-4
                py-3
                text-sm
                font-medium
                text-[#352217]
                placeholder:text-[#765d4d]
                outline-none
                backdrop-blur-xl
                transition-all
                duration-200
                focus:border-[#60402d]/35
                focus:bg-white/40
                focus:ring-4
                focus:ring-[#60402d]/10
              "
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mb-3">
            <label
              className="
                mb-1.5
                block
                text-[11px]
                font-semibold
                text-[#62483a]
              "
            >
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Add a short description..."
              rows={4}
              className="
                w-full
                resize-none
                rounded-2xl
                border border-[#76523b]/20
                bg-white/25
                px-4
                py-3
                text-sm
                font-medium
                text-[#352217]
                placeholder:text-[#765d4d]
                outline-none
                backdrop-blur-xl
                transition-all
                duration-200
                focus:border-[#60402d]/35
                focus:bg-white/40
                focus:ring-4
                focus:ring-[#60402d]/10
              "
            />
          </div>

          {/* PROJECT */}

          <div className="mb-3">
            <label
              className="
                mb-1.5
                block
                text-[11px]
                font-semibold
                text-[#62483a]
              "
            >
              Project
            </label>

            <select
              value={projectId}
              onChange={(e) =>
                setProjectId(e.target.value)
              }
              className="
                w-full
                rounded-2xl
                border border-[#76523b]/20
                bg-white/25
                px-4
                py-3
                text-sm
                font-medium
                text-[#352217]
                outline-none
                backdrop-blur-xl
                transition-all
                duration-200
                focus:border-[#60402d]/35
                focus:bg-white/40
                focus:ring-4
                focus:ring-[#60402d]/10
              "
            >
              <option value="">
                Select a project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRIORITY + STATUS */}

          <div className="grid grid-cols-2 gap-3">

            {/* PRIORITY */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[11px]
                  font-semibold
                  text-[#62483a]
                "
              >
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border border-[#76523b]/20
                  bg-white/25
                  px-3
                  py-3
                  text-sm
                  font-medium
                  text-[#352217]
                  outline-none
                  backdrop-blur-xl
                  transition-all
                  duration-200
                  focus:border-[#60402d]/35
                  focus:bg-white/40
                  focus:ring-4
                  focus:ring-[#60402d]/10
                "
              >
                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>
              </select>
            </div>

            {/* STATUS */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[11px]
                  font-semibold
                  text-[#62483a]
                "
              >
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="
                  w-full
                  rounded-2xl
                  border border-[#76523b]/20
                  bg-white/25
                  px-3
                  py-3
                  text-sm
                  font-medium
                  text-[#352217]
                  outline-none
                  backdrop-blur-xl
                  transition-all
                  duration-200
                  focus:border-[#60402d]/35
                  focus:bg-white/40
                  focus:ring-4
                  focus:ring-[#60402d]/10
                "
              >
                <option value="TODO">
                  TODO
                </option>

                <option value="IN_PROGRESS">
                  IN PROGRESS
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>
              </select>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mt-4
                rounded-2xl
                border border-red-200/50
                bg-red-50/60
                px-4
                py-3
                text-xs
                font-medium
                text-red-800
                backdrop-blur-xl
              "
            >
              {error}
            </div>
          )}

          {/* CREATE BUTTON */}

          <button
            onClick={create}
            className="
              mt-5
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#4b3022]
              py-3
              text-sm
              font-semibold
              text-white
              shadow-[0_8px_20px_rgba(65,40,25,0.18)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#392318]
              hover:shadow-[0_12px_25px_rgba(65,40,25,0.22)]
              active:translate-y-0
            "
          >
            <Plus size={17} />
            Create task
          </button>
        </section>

        {/* ================================================= */}
        {/* TASK LIST CARD */}
        {/* ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border border-white/40
            bg-white/30
            p-5
            shadow-[0_20px_60px_rgba(65,40,25,0.12)]
            backdrop-blur-2xl
            sm:p-6
          "
        >
          {/* subtle glass highlight */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-px
              bg-white/60
            "
          />

          {/* HEADER */}

          <div
            className="
              mb-5
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <h2
                className="
                  font-serif
                  text-2xl
                  font-semibold
                  text-[#3b261b]
                "
              >
                Your tasks
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-[#62483a]
                "
              >
                Manage your current work
              </p>
            </div>

            <span
              className="
                shrink-0
                rounded-full
                border border-white/40
                bg-white/35
                px-3
                py-1.5
                text-xs
                font-semibold
                text-[#4f3628]
                shadow-sm
                backdrop-blur-xl
              "
            >
              {tasks.length}{" "}
              {tasks.length === 1
                ? "task"
                : "tasks"}
            </span>
          </div>

          {/* TASK LIST */}

          <div
            className="
              max-h-[650px]
              space-y-3
              overflow-y-auto
              pr-1
            "
          >
            {tasks.map((task) => (
              <div
                key={task.id}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-[20px]
                  border border-white/40
                  bg-white/35
                  p-3.5
                  shadow-[0_8px_25px_rgba(65,40,25,0.06)]
                  backdrop-blur-xl
                  transition-all
                  duration-200
                  hover:bg-white/45
                  hover:shadow-[0_10px_30px_rgba(65,40,25,0.10)]
                  sm:gap-4
                  sm:p-4
                "
              >
                {/* COMPLETE BUTTON */}

                <button
                  onClick={() =>
                    changeStatus(
                      task.id,
                      task.status === "COMPLETED"
                        ? "TODO"
                        : "COMPLETED"
                    )
                  }
                  title={
                    task.status === "COMPLETED"
                      ? "Mark as incomplete"
                      : "Mark as completed"
                  }
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      task.status === "COMPLETED"
                        ? "bg-[#60402d] text-white shadow-md"
                        : "border border-[#76523b]/25 bg-white/35 text-[#60402d] hover:bg-white/60"
                    }
                  `}
                >
                  {task.status === "COMPLETED" && (
                    <Check size={16} />
                  )}
                </button>

                {/* TASK INFO */}

                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      truncate
                      text-sm
                      font-semibold
                      ${
                        task.status ===
                        "COMPLETED"
                          ? "text-[#806d60] line-through"
                          : "text-[#3b261b]"
                      }
                    `}
                  >
                    {task.title}
                  </p>

                  <div
                    className="
                      mt-1
                      flex
                      flex-wrap
                      items-center
                      gap-1.5
                    "
                  >
                    <span
                      className="
                        max-w-[180px]
                        truncate
                        text-[11px]
                        font-medium
                        text-[#62483a]
                      "
                    >
                      {getProjectName(
                        task.project_id
                      )}
                    </span>

                    <span className="text-[#9a806f]">
                      ·
                    </span>

                    <span
                      className="
                        text-[11px]
                        font-medium
                        text-[#705647]
                      "
                    >
                      {getStatusLabel(
                        task.status
                      )}
                    </span>
                  </div>
                </div>

                {/* PRIORITY */}

                <span
                  className={`
                    hidden
                    shrink-0
                    rounded-full
                    px-3
                    py-1.5
                    text-[10px]
                    font-bold
                    tracking-wide
                    sm:inline-flex
                    ${
                      task.priority === "HIGH"
                        ? "bg-red-100/80 text-red-700"
                        : task.priority ===
                          "MEDIUM"
                        ? "bg-orange-100/80 text-orange-700"
                        : "bg-green-100/80 text-green-700"
                    }
                  `}
                >
                  {task.priority}
                </span>

                {/* DELETE */}

                <button
                  onClick={() =>
                    remove(task.id)
                  }
                  title="Delete task"
                  className="
                    shrink-0
                    rounded-xl
                    p-2
                    text-red-700/70
                    transition-all
                    duration-200
                    hover:bg-red-50/70
                    hover:text-red-700
                    hover:opacity-100
                  "
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            {/* EMPTY STATE */}

            {tasks.length === 0 && (
              <div
                className="
                  flex
                  min-h-64
                  flex-col
                  items-center
                  justify-center
                  rounded-[24px]
                  border
                  border-dashed
                  border-[#76523b]/20
                  bg-white/15
                  px-6
                  text-center
                  backdrop-blur-xl
                "
              >
                <div
                  className="
                    mb-3
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#62402d]/10
                    text-[#62402d]
                  "
                >
                  <Plus size={20} />
                </div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#4f3628]
                  "
                >
                  No tasks yet
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[#80685a]
                  "
                >
                  Create your first task to get
                  started.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}