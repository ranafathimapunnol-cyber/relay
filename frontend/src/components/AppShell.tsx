"use client";

import {
  ArrowUpRight,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { LucideIcon } from "lucide-react";

import { apiFetch } from "@/lib/api";


// ======================================================
// TYPES
// ======================================================

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type AppShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};


// ======================================================
// USER NAVIGATION
// ======================================================

const userNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    label: "Team",
    href: "/team",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];


// ======================================================
// ADMIN NAVIGATION
// ======================================================

const adminNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: ShieldCheck,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    label: "Team",
    href: "/team",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];


// ======================================================
// APP SHELL
// ======================================================

export default function AppShell({
  children,
  title,
  subtitle,
}: AppShellProps) {

  const pathname = usePathname();
  const router = useRouter();


  // ====================================================
  // STATE
  // ====================================================

  const [user, setUser] =
    useState<User | null>(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  // ====================================================
  // AUTHENTICATION CHECK
  // ====================================================

  async function checkAuthentication() {

    const token =
      localStorage.getItem("access_token");

    /*
     * No JWT means the user is not authenticated.
     */
    if (!token) {

      setUser(null);
      setLoading(false);

      window.location.replace("/login");

      return;
    }


    try {

      /*
       * Ask backend whether the token is still valid.
       */
      const currentUser =
        await apiFetch<User>(
          "/api/auth/me"
        );


      setUser(currentUser);


      // ----------------------------------------------
      // ADMIN
      // ----------------------------------------------

      if (
        currentUser.role === "ADMIN" &&
        pathname === "/dashboard"
      ) {

        router.replace("/admin");

        return;
      }


      // ----------------------------------------------
      // NORMAL USER
      // ----------------------------------------------

      if (
        currentUser.role !== "ADMIN" &&
        pathname.startsWith("/admin")
      ) {

        router.replace("/dashboard");

        return;
      }

    } catch {

      /*
       * Token is invalid or expired.
       */
      localStorage.removeItem(
        "access_token"
      );

      setUser(null);

      window.location.replace("/login");

      return;

    } finally {

      setLoading(false);

    }
  }


  // ====================================================
  // INITIAL AUTH CHECK
  // ====================================================

  useEffect(() => {

    let mounted = true;


    async function authenticate() {

      if (!mounted) return;

      await checkAuthentication();

    }


    authenticate();


    return () => {

      mounted = false;

    };

  }, [pathname]);


  // ====================================================
  // BROWSER BACK / FORWARD PROTECTION
  // ====================================================

  useEffect(() => {

    /*
     * Browser Back / Forward
     */
    function handlePopState() {

      const token =
        localStorage.getItem(
          "access_token"
        );

      /*
       * If user is no longer authenticated,
       * don't allow protected page to remain visible.
       */
      if (!token) {

        window.location.replace(
          "/login"
        );

        return;
      }


      /*
       * Token exists, verify it again.
       */
      checkAuthentication();

    }


    /*
     * Browser may restore a page from its
     * Back/Forward cache (bfcache).
     *
     * pageshow catches that situation.
     */
    function handlePageShow() {

      checkAuthentication();

    }


    window.addEventListener(
      "popstate",
      handlePopState
    );

    window.addEventListener(
      "pageshow",
      handlePageShow
    );


    return () => {

      window.removeEventListener(
        "popstate",
        handlePopState
      );

      window.removeEventListener(
        "pageshow",
        handlePageShow
      );

    };

  }, [pathname]);


  // ====================================================
  // CLOSE MOBILE SIDEBAR WHEN ROUTE CHANGES
  // ====================================================

  useEffect(() => {

    setMobileOpen(false);

  }, [pathname]);


  // ====================================================
  // SEARCH
  // ====================================================

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    const query =
      search.trim();

    if (!query) return;

    router.push(
      `/search?q=${encodeURIComponent(query)}`
    );

  }


  // ====================================================
  // LOGOUT
  // ====================================================

  function handleLogout() {

    /*
     * Remove authentication first.
     */
    localStorage.removeItem(
      "access_token"
    );


    /*
     * Clear current user.
     */
    setUser(null);


    /*
     * Replace instead of push.
     *
     * This prevents /logout or the current
     * protected page from becoming a new
     * login history entry.
     */
    window.location.replace(
      "/login"
    );

  }


  // ====================================================
  // ACTIVE NAVIGATION
  // ====================================================

  function isActive(
    href: string
  ) {

    if (href === "/dashboard") {

      return pathname === "/dashboard";

    }


    if (href === "/admin") {

      return pathname === "/admin";

    }


    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );

  }


  // ====================================================
  // NAVIGATION BASED ON ROLE
  // ====================================================

  const navigation =
    user?.role === "ADMIN"
      ? adminNavigation
      : userNavigation;


  // ====================================================
  // SIDEBAR
  // ====================================================

  function Sidebar({
    mobile = false,
  }: {
    mobile?: boolean;
  }) {

    return (
      <aside
        className={
          mobile
            ? `
              relative
              flex
              h-full
              w-[280px]
              flex-col
              overflow-hidden
              border-r
              border-white/40
              bg-white/30
              shadow-[0_20px_60px_rgba(65,40,25,0.12)]
              backdrop-blur-sm
            `
            : `
              fixed
              left-4
              top-4
              z-40
              hidden
              h-[calc(100vh-32px)]
              w-[258px]
              flex-col
              overflow-hidden
              rounded-[28px]
              border
              border-white/40
              bg-white/30
              shadow-[0_20px_60px_rgba(65,40,25,0.12)]
              backdrop-blur-2xl
              lg:flex
            `
        }
      >

        {/* SUBTLE GLASS LIGHT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
          "
        >

          <div
            className="
              absolute
              -left-20
              -top-20
              h-48
              w-48
              rounded-full
              bg-white/[0.12]
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-20
              -right-20
              h-52
              w-52
              rounded-full
              bg-[#9b6c4b]/[0.07]
              blur-3xl
            "
          />

        </div>


        {/* SIDEBAR CONTENT */}

        <div
          className="
            relative
            flex
            min-h-0
            flex-1
            flex-col
          "
        >

          {/* BRAND */}

          <div
            className="
              flex
              items-center
              justify-between
              px-5
              pb-5
              pt-6
            "
          >

            <Link
              href={
                user?.role === "ADMIN"
                  ? "/admin"
                  : "/dashboard"
              }
              className="
                group
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  serif
                  text-[25px]
                  font-semibold
                  tracking-tight
                  text-[#352217]
                "
              >
                Relay
              </span>

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#60402d]
                  transition
                  duration-300
                  group-hover:scale-125
                "
              />

            </Link>


            {mobile && (
              <button
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/40
                  bg-white/25
                  text-[#352217]
                  transition
                  hover:bg-white/35
                "
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            )}

          </div>


          {/* USER PROFILE */}

          <div
            className="
              mx-4
              mb-5
              rounded-[22px]
              border
              border-white/40
              bg-white/25
              p-3.5
              shadow-[0_12px_35px_rgba(65,40,25,0.08)]
              backdrop-blur-2xl
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#60402d]
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                "
              >
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>


              <div className="min-w-0">

                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-[#352217]
                  "
                >
                  {user?.name || "User"}
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[11px]
                    font-medium
                    text-[#62483a]
                  "
                >
                  {user?.role === "ADMIN"
                    ? "Administrator"
                    : "Workspace member"}
                </p>

              </div>

            </div>

          </div>


          {/* WORKSPACE LABEL */}

          <div className="px-5 pb-2">

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#62483a]
              "
            >
              Workspace
            </p>

          </div>


          {/* NAVIGATION */}

          <nav
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-3
            "
          >

            <div className="space-y-1">

              {navigation.map(
                (item) => {

                  const Icon =
                    item.icon;

                  const active =
                    isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        group
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        transition-all
                        duration-200

                        ${
                          active
                            ? `
                              bg-[#60402d]
                              text-white
                              shadow-[0_8px_24px_rgba(75,48,34,0.22)]
                            `
                            : `
                              text-[#352217]
                              hover:bg-white/25
                              hover:text-[#352217]
                            `
                        }
                      `}
                    >

                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          transition-all
                          duration-200

                          ${
                            active
                              ? `
                                bg-white/10
                                text-white
                              `
                              : `
                                bg-white/25
                                text-[#352217]
                                group-hover:bg-white/35
                              `
                          }
                        `}
                      >
                        <Icon size={17} />
                      </span>

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {active && (
                        <ArrowUpRight
                          size={15}
                          className="
                            text-white/75
                            transition-transform
                            duration-200
                            group-hover:translate-x-0.5
                            group-hover:-translate-y-0.5
                          "
                        />
                      )}

                    </Link>
                  );

                }
              )}

            </div>

          </nav>


          {/* SIDEBAR BOTTOM */}

          <div
            className="
              mt-auto
              px-3
              pb-4
              pt-4
            "
          >

            <div
              className="
                mb-3
                h-px
                bg-[#60402d]/10
              "
            />

            <button
              type="button"
              onClick={handleLogout}
              className="
                group
                flex
                w-full
                items-center
                gap-3
                rounded-2xl
                px-3
                py-2.5
                text-sm
                font-medium
                text-[#352217]
                transition-all
                duration-200
                hover:bg-white/25
              "
            >

              <span
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/25
                  text-[#352217]
                  transition
                  group-hover:bg-white/35
                "
              >
                <LogOut size={17} />
              </span>

              <span>
                Sign out
              </span>

            </button>

          </div>

        </div>

      </aside>
    );
  }


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (
      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[#ead7c2]
          bg-cover
          bg-center
        "
        style={{
          backgroundImage:
            "url('/desert-bg.png')",
          backgroundAttachment: "fixed",
        }}
      >

        <div
          className="
            absolute
            inset-0
            bg-[#ead7c2]/[0.06]
          "
        />

        <div
          className="
            relative
            z-10
            flex
            min-h-screen
            items-center
            justify-center
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              text-[#60402d]
            "
          >

            <div
              className="
                h-5
                w-5
                animate-spin
                rounded-full
                border-2
                border-[#60402d]/20
                border-t-[#60402d]
              "
            />

            <span
              className="
                text-sm
                font-semibold
                text-[#352217]
              "
            >
              Loading workspace...
            </span>

          </div>

        </div>

      </main>
    );
  }


  // ====================================================
  // MAIN APP
  // ====================================================

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-[#ead7c2]
        bg-cover
        bg-center
      "
      style={{
        backgroundImage:
          "url('/desert-bg.png')",
        backgroundAttachment: "fixed",
      }}
    >

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          bg-[#ead7c2]/[0.05]
        "
      />


      {/* DESKTOP SIDEBAR */}

      <div className="relative z-10">
        <Sidebar />
      </div>


      {/* MOBILE SIDEBAR */}

      {mobileOpen && (
        <>

          <div
            className="
              fixed
              inset-0
              z-40
              bg-black/25
              backdrop-blur-[2px]
              lg:hidden
            "
            onClick={() =>
              setMobileOpen(false)
            }
          />

          <div
            className="
              fixed
              inset-y-0
              left-0
              z-50
              lg:hidden
            "
          >
            <Sidebar mobile />
          </div>

        </>
      )}


      {/* MAIN CONTENT */}

      <div
        className="
          relative
          z-10
          lg:ml-[282px]
        "
      >

        {/* TOP HEADER */}

        <header
          className="
            sticky
            top-0
            z-30
            px-4
            pt-4
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              relative
              flex
              min-h-[68px]
              items-center
              gap-3
              overflow-hidden
              rounded-[28px]
              border
              border-white/40
              bg-white/30
              px-3
              py-2
              shadow-[0_20px_60px_rgba(65,40,25,0.12)]
              backdrop-blur-2xl
              sm:px-4
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                overflow-hidden
              "
            >

              <div
                className="
                  absolute
                  -left-16
                  -top-16
                  h-40
                  w-40
                  rounded-full
                  bg-white/[0.10]
                  blur-3xl
                "
              />

              <div
                className="
                  absolute
                  -bottom-16
                  -right-16
                  h-44
                  w-44
                  rounded-full
                  bg-[#9b6c4b]/[0.05]
                  blur-3xl
                "
              />

            </div>


            <div
              className="
                relative
                flex
                min-w-0
                flex-1
                items-center
                gap-3
              "
            >

              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(true)
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/40
                  bg-white/25
                  text-[#352217]
                  transition
                  hover:bg-white/35
                  lg:hidden
                "
                aria-label="Open menu"
              >
                <Menu size={19} />
              </button>


              {/* PAGE TITLE */}

              <div
                className="
                  hidden
                  min-w-0
                  shrink-0
                  sm:block
                "
              >

                {title && (
                  <h1
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-[#352217]
                    "
                  >
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p
                    className="
                      mt-0.5
                      max-w-[260px]
                      truncate
                      text-[11px]
                      font-medium
                      text-[#62483a]
                    "
                  >
                    {subtitle}
                  </p>
                )}

              </div>


              {/* SEARCH */}

              <form
                onSubmit={handleSearch}
                className="
                  min-w-0
                  flex-1
                "
              >

                <div
                  className="
                    relative
                    ml-auto
                    max-w-[520px]
                  "
                >

                  <Search
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-[#62483a]
                    "
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search workspace..."
                    className="
                      h-11
                      w-full
                      rounded-2xl
                      border
                      border-white/40
                      bg-white/25
                      pl-10
                      pr-4
                      text-sm
                      font-medium
                      text-[#352217]
                      outline-none
                      placeholder:text-[#765d4d]
                      backdrop-blur-xl
                      transition-all
                      duration-200
                      focus:border-[#60402d]/30
                      focus:bg-white/35
                      focus:ring-4
                      focus:ring-[#60402d]/10
                    "
                  />

                </div>

              </form>


              {/* SETTINGS */}

              <Link
                href="/settings"
                className="
                  hidden
                  h-10
                  shrink-0
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/40
                  bg-white/25
                  px-3
                  text-sm
                  font-medium
                  text-[#352217]
                  backdrop-blur-xl
                  transition-all
                  duration-200
                  hover:bg-white/35
                  sm:flex
                "
              >

                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#60402d]
                    text-[10px]
                    font-semibold
                    text-white
                  "
                >
                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </span>

                <span
                  className="
                    max-w-[120px]
                    truncate
                    text-[#352217]
                  "
                >
                  {user?.name || "Account"}
                </span>

              </Link>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <main
          className="
            px-4
            pb-8
            pt-6
            sm:px-6
            lg:px-8
          "
        >

          {children}

        </main>

      </div>

    </div>
  );
}