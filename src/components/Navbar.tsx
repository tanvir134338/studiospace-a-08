"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Aperture,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  UserRound,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
];

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const user = session?.user;

  // Theme Toggle
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Logout
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
          onClick={() => setMobileMenuOpen(false)}
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
              className="whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
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

          {!isPending &&
            (user ? (
              <>
                <div className="flex max-w-[180px] items-center gap-2">
                  {renderUserAvatar()}

                  <span className="truncate text-sm font-semibold">
                    {user.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:bg-secondary"
                >
                  Logout
                </button>
              </>
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent"
              >
                {link.name}
              </Link>
            ))}

            {!isPending && (
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-4">
                {user ? (
                  <>
                    <div className="col-span-2 flex items-center justify-center gap-3 px-3 py-2">
                      {renderUserAvatar("small")}

                      <span className="max-w-[180px] truncate text-sm font-semibold">
                        {user.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="col-span-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg border border-border px-4 py-3 text-center text-sm font-semibold transition-colors hover:bg-secondary"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
