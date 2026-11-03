"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useState,
  useSyncExternalStore,
  useEffect,
  useRef,
  useId,
} from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";

import {
  Aperture,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  UserRound,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  CalendarDays,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

const profileLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Add New Studio",
    href: "/add-studio",
    icon: PlusCircle,
  },
  {
    name: "My Studio Listings",
    href: "/my-listings",
    icon: FolderKanban,
  },
  {
    name: "My Bookings",
    href: "/my-bookings",
    icon: CalendarDays,
  },
];

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Profile Dropdown References
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuId = useId();

  const user = session?.user;

  // Theme Toggle
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Home Navigation and Scroll to Top
  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    closeMenus();

    if (pathname === "/") {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Close Profile Dropdown on Outside Click and Escape
  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileMenuOpen]);

  // Logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL;

      if (!apiURL) {
        throw new Error("API URL is not configured.");
      }

      // First, clear the HTTPOnly JWT cookie
      const response = await fetch(`${apiURL}/api/session/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to clear JWT cookie.");
      }

      // Then, sign out from Better Auth
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message || "Logout failed.");
      }

      setMobileMenuOpen(false);
      setProfileMenuOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Close Menus
  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  // Render User Avatar
  const renderUserAvatar = (size: "normal" | "small" = "normal") => {
    const dimension = size === "small" ? "h-9 w-9" : "h-10 w-10";
    const imageSize = size === "small" ? 36 : 40;

    return (
      <div
        className={`flex ${dimension} shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary text-sm font-bold text-primary-foreground`}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={`${user.name}'s profile`}
            width={imageSize}
            height={imageSize}
            unoptimized
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : user?.name ? (
          user.name.charAt(0).toUpperCase()
        ) : (
          <UserRound size={19} />
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between rounded-2xl border border-border/80 bg-background/90 px-4 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleHomeClick}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:rounded-2xl">
            <div className="absolute inset-0 translate-y-full bg-accent transition-transform duration-300 group-hover:translate-y-0" />

            <Aperture
              size={26}
              strokeWidth={1.8}
              className="relative z-10 transition-transform duration-500 group-hover:rotate-90"
            />

            <Sparkles
              size={12}
              className="absolute right-1 top-1 z-10 opacity-0 transition-all duration-300 group-hover:opacity-100"
            />
          </div>

          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-foreground transition-colors duration-300 group-hover:text-accent">
              Studio
            </span>
            <span className="text-accent transition-colors duration-300 group-hover:text-primary">
              Space
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={link.href === "/" ? handleHomeClick : undefined}
              className="whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 hover:rotate-12 hover:border-accent hover:bg-secondary"
          >
            {!mounted ? (
              <span className="h-[19px] w-[19px]" aria-hidden="true" />
            ) : theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* User Profile */}
          {!isPending &&
            (user ? (
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((previous) => !previous)}
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="menu"
                  aria-controls={profileMenuId}
                  aria-label="Open profile menu"
                  className="flex max-w-[210px] items-center gap-2 rounded-xl border border-border px-3 py-2 transition-colors hover:bg-secondary"
                >
                  {renderUserAvatar()}

                  <span className="max-w-[115px] truncate text-sm font-semibold">
                    {user.name}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform ${
                      profileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div
                    id={profileMenuId}
                    role="menu"
                    aria-label="User profile menu"
                    className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-border bg-background p-2 shadow-xl"
                  >
                    <div className="border-b border-border px-3 py-3">
                      <p className="truncate text-sm font-bold text-foreground">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-muted">
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-1 py-2">
                      {profileLinks.map((link) => {
                        const Icon = link.icon;

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            role="menuitem"
                            onClick={closeMenus}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                          >
                            <Icon size={18} />
                            {link.name}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="border-t border-border pt-2">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLoggingOut ? (
                          <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                        ) : (
                          <LogOut size={18} />
                        )}
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary hover:text-accent"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="whitespace-nowrap rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Actions */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
          >
            {!mounted ? (
              <span className="h-[19px] w-[19px]" aria-hidden="true" />
            ) : theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-secondary"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-[1440px] rounded-2xl border border-border bg-background/95 px-4 py-5 shadow-lg backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {/* Main Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={link.href === "/" ? handleHomeClick : closeMenus}
                className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent"
              >
                {link.name}
              </Link>
            ))}

            {/* Authenticated User Menu */}
            {!isPending && (
              <div className="mt-3 border-t border-border pt-4">
                {user ? (
                  <>
                    {/* User Information */}
                    <div className="mb-3 flex items-center gap-3 px-3 py-2">
                      {renderUserAvatar("small")}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-muted">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Profile Links */}
                    <div className="space-y-1">
                      {profileLinks.map((link) => {
                        const Icon = link.icon;

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenus}
                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary"
                          >
                            <Icon size={18} />
                            {link.name}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="mt-3 flex w-full items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoggingOut ? (
                        <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      ) : (
                        <LogOut size={18} />
                      )}
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={closeMenus}
                      className="rounded-lg border border-border px-4 py-3 text-center text-sm font-semibold transition-colors hover:bg-secondary"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenus}
                      className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
