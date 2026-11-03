"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Building2,
  CalendarDays,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  AlertCircle,
  ClipboardList,
  Store,
} from "lucide-react";

import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";

type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

interface Booking {
  _id: string;
  studioId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice?: number;
  status: BookingStatus;
  createdAt: string;
}

interface Studio {
  _id: string;
  name: string;
  location: string;
  image: string;
  pricePerHour: number;
  createdAt: string;
}

interface DashboardData {
  studios: Studio[];
  bookings: Booking[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  studios?: T[];
  bookings?: T[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(path: string) {
  if (!API_URL) {
    throw new Error("API URL is not configured. Check your .env.local file.");
  }

  return `${API_URL.replace(/\/$/, "")}${path}`;
}

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Confirmed: "bg-green-500/10 text-green-600 border-green-500/20",
  Completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

function formatDate(date: string) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Safely format prices, even when API data is missing.
function formatPrice(amount: number | null | undefined) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return "৳—";
  }

  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function DashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData>({
    studios: [],
    bookings: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [studiosResponse, bookingsResponse] = await Promise.all([
          fetch(getApiUrl("/api/studios/my-listings"), {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch(getApiUrl("/api/bookings/my-bookings"), {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        if (ignore) return;

        if (studiosResponse.status === 401 || bookingsResponse.status === 401) {
          toast.error("Please login to access your dashboard.");
          router.push("/login");
          return;
        }

        const [studiosResult, bookingsResult] = await Promise.all([
          studiosResponse.json() as Promise<ApiResponse<Studio>>,
          bookingsResponse.json() as Promise<ApiResponse<Booking>>,
        ]);

        if (!studiosResponse.ok || !studiosResult.success) {
          throw new Error(
            studiosResult.message || "Unable to load your studios.",
          );
        }

        if (!bookingsResponse.ok || !bookingsResult.success) {
          throw new Error(
            bookingsResult.message || "Unable to load your bookings.",
          );
        }

        if (!ignore) {
          setData({
            studios: Array.isArray(studiosResult.studios)
              ? studiosResult.studios
              : [],
            bookings: Array.isArray(bookingsResult.bookings)
              ? bookingsResult.bookings
              : [],
          });
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void fetchDashboardData();

    return () => {
      ignore = true;
    };
  }, [router, retryKey]);

  const { studios, bookings } = data;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed",
  ).length;

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const recentBookings = sortedBookings.slice(0, 5);

  const stats = [
    {
      title: "Total Studios",
      value: studios.length,
      icon: Building2,
      description: "Your listed creative spaces",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarDays,
      description: "All your reservations",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Clock,
      description: "Waiting for confirmation",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings,
      icon: CheckCircle2,
      description: "Successfully confirmed",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-sm font-medium text-muted">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 rounded-2xl bg-red-500/10 p-5 text-red-500">
          <AlertCircle size={40} />
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          Unable to Load Dashboard
        </h1>

        <p className="mt-3 max-w-md text-sm leading-7 text-muted">{error}</p>

        <button
          type="button"
          onClick={() => setRetryKey((previous) => previous + 1)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                <LayoutDashboard size={18} />
                Dashboard Overview
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Welcome Back!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-muted sm:text-base">
                Manage your creative spaces and keep track of your studio
                reservations from one place.
              </p>
            </div>

            <Link
              href="/add-studio"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              <Plus size={18} />
              Add New Studio
            </Link>
          </div>

          {/* Statistics */}
          <section>
            <h2 className="mb-5 text-xl font-bold text-foreground">Overview</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted">
                          {stat.title}
                        </p>

                        <p className="mt-3 text-3xl font-extrabold text-foreground">
                          {stat.value}
                        </p>
                      </div>

                      <div className="rounded-xl bg-primary/10 p-3 text-primary">
                        <Icon size={24} />
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-muted">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mt-12">
            <h2 className="mb-5 text-xl font-bold text-foreground">
              Quick Actions
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/add-studio"
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Plus size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground">
                      Add New Studio
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      List your creative space
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={19}
                  className="text-muted transition group-hover:translate-x-1 group-hover:text-primary"
                />
              </Link>

              <Link
                href="/my-listings"
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Store size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground">
                      My Studio Listings
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      Manage your studios
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={19}
                  className="text-muted transition group-hover:translate-x-1 group-hover:text-primary"
                />
              </Link>

              <Link
                href="/my-bookings"
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <ClipboardList size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground">My Bookings</h3>
                    <p className="mt-1 text-xs text-muted">
                      View your reservations
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={19}
                  className="text-muted transition group-hover:translate-x-1 group-hover:text-primary"
                />
              </Link>
            </div>
          </section>

          {/* Recent Bookings */}
          <section className="mt-12">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Your latest studio reservations.
                </p>
              </div>

              <Link
                href="/my-bookings"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-75"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-5 py-14 text-center">
                <div className="mb-5 rounded-2xl bg-primary/10 p-5 text-primary">
                  <CalendarDays size={38} />
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  No Bookings Yet
                </h3>

                <p className="mt-3 max-w-md text-sm leading-7 text-muted">
                  You haven&apos;t made any studio reservations yet. Explore
                  available spaces and book your next creative session.
                </p>

                <Link
                  href="/studios"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Explore Studios
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="divide-y divide-border">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/studios/${booking.studioId}`}
                          className="font-bold text-foreground transition hover:text-primary"
                        >
                          Studio Reservation
                        </Link>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted sm:text-sm">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {formatDate(booking.date)}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            statusStyles[booking.status] || statusStyles.Pending
                          }`}
                        >
                          {booking.status}
                        </span>

                        <span className="text-base font-extrabold text-primary">
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* My Studios */}
          <section className="mt-12">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  My Studios
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Your recently listed creative spaces.
                </p>
              </div>

              <Link
                href="/my-listings"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-75"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            {studios.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-12 text-center">
                <Building2 size={35} className="mx-auto text-primary" />

                <h3 className="mt-4 font-bold text-foreground">
                  No Studios Listed
                </h3>

                <p className="mt-2 text-sm text-muted">
                  Start hosting by adding your first creative space.
                </p>

                <Link
                  href="/add-studio"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  <Plus size={17} />
                  Add Studio
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {studios.slice(0, 3).map((studio) => (
                  <Link
                    key={studio._id}
                    href={`/studios/${studio._id}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary"
                  >
                    <div className="relative h-48 overflow-hidden bg-secondary">
                      {studio.image ? (
                        <Image
                          src={studio.image}
                          alt={studio.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted">
                          <Building2 size={40} />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-foreground">
                        {studio.name}
                      </h3>

                      <p className="mt-2 text-sm text-muted">
                        {studio.location}
                      </p>

                      <p className="mt-4 font-extrabold text-primary">
                        {formatPrice(studio.pricePerHour)}
                        <span className="text-xs font-medium text-muted">
                          {" "}
                          / hour
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
