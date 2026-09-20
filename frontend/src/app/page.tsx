"use client";

import {
  ArrowDown,
  ArrowRight,
  FolderKanban,
  ListTodo,
  Users,
  LayoutDashboard,
  ShieldCheck,
  Bell,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: FolderKanban,
    title: "Projects",
    description:
      "Create focused project spaces and keep everything organized in one place.",
  },
  {
    icon: ListTodo,
    title: "Tasks",
    description:
      "Break work into clear tasks, track progress, and stay on top of priorities.",
  },
  {
    icon: Users,
    title: "Team collaboration",
    description:
      "Bring your team together and keep everyone working from the same workspace.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description:
      "Get a clear view of your projects, tasks, and overall workspace activity.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description:
      "Give people the right access while keeping your workspace structured.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Stay informed about important updates without losing focus.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#17110d] text-white">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/desert-bg.png')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#17110d]" />

        {/* Navbar */}
        <header className="fixed inset-x-0 top-0 z-50">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-10">

            <Link
              href="/"
              className="group flex items-center gap-2"
            >
              <span className="serif text-2xl font-semibold tracking-tight">
                Relay
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-[#e7c49f]" />
            </Link>

            <nav className="flex items-center gap-2">

              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-[#f4e6d7] px-5 py-2.5 text-sm font-semibold text-[#4d3326] shadow-xl transition hover:-translate-y-0.5 hover:bg-white"
              >
                Get started
              </Link>

            </nav>
          </div>
        </header>

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] items-center px-6 pt-20 lg:px-10">

          <div className="max-w-xl">

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#e8c7a5]" />

              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/75">
                Project management
              </span>
            </div>

            <h1 className="serif text-5xl leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.7rem]">
              Bring your work
              <br />

              <span className="italic text-[#efd0ae]">
                together.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
              Plan projects, manage tasks, and collaborate with your
              team from one simple and focused workspace.
            </p>

            <div className="mt-8 flex items-center gap-5">

              <Link
                href="/register"
                className="group inline-flex items-center gap-3 rounded-full bg-[#f4e6d7] px-5 py-3 text-sm font-semibold text-[#4d3326] shadow-xl transition hover:-translate-y-0.5 hover:bg-white"
              >
                Get started

                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="#features"
                className="text-sm text-white/65 transition hover:text-white"
              >
                Explore features
              </Link>

            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#features"
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50 transition hover:text-white"
        >
          <span className="text-[10px] uppercase tracking-[0.25em]">
            Scroll
          </span>

          <ArrowDown
            size={15}
            className="animate-bounce"
          />
        </a>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="relative overflow-hidden bg-[#17110d] py-28 sm:py-36"
      >

        {/* Background glow */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#8b6246]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-10">

          {/* Section heading */}
          <div className="mx-auto max-w-2xl text-center">

            <p className="text-[11px] uppercase tracking-[0.3em] text-[#cda984]">
              Everything in one place
            </p>

            <h2 className="serif mt-4 text-4xl tracking-[-0.025em] sm:text-5xl">
              Built to keep work clear.
            </h2>

            <p className="mt-5 text-sm leading-6 text-white/50 sm:text-base">
              Everything you need to organize projects, manage tasks,
              and keep your team connected.
            </p>

          </div>


          {/* Glass cards */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-white/10 bg-white/[0.055] p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:bg-white/[0.09] hover:border-white/20"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
                    <Icon
                      size={19}
                      className="text-[#e2bd98]"
                    />
                  </div>

                  <h3 className="mt-6 text-lg font-medium">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/50">
                    {feature.description}
                  </p>

                  <div className="mt-6 h-px w-8 bg-[#cda984]/60 transition-all duration-300 group-hover:w-14" />

                </div>
              );
            })}

          </div>

        </div>
      </section>


      {/* ================= FINAL CTA ================= */}
      <section className="relative px-6 py-28">

        <div className="mx-auto max-w-[1000px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] px-8 py-16 text-center backdrop-blur-xl sm:px-12">

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#cda984]">
            Start with Relay
          </p>

          <h2 className="serif mt-4 text-4xl sm:text-5xl">
            Keep your work moving.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/50">
            A focused workspace for projects, tasks, and teams.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f4e6d7] px-6 py-3 text-sm font-semibold text-[#4d3326] transition hover:bg-white"
          >
            Get started
            <ArrowRight size={15} />
          </Link>

        </div>

      </section>

    </main>
  );
}