"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  CalendarDays,
  Clock,
  MapPin,
  Building2,
  Loader2,
  RefreshCw,
  XCircle,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

import { toast } from "sonner";

type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

interface Booking {
  _id: string;
  studioId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

interface Studio {
  _id: string;
  name: string;
  location: string;
  image: string;
  pricePerHour: number;
  securityDeposit: number;
}

interface BookingWithStudio extends Booking {
  studio?: Studio;
}

interface BookingsResponse {
  success: boolean;
  message?: string;
  bookings?: Booking[];
}

interface StudioResponse {
  success: boolean;
  studio?: Studio;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(path: string) {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
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
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function calculateDuration(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  return (end - start) / 60;
}

function formatPrice(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function MyBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<BookingWithStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Fetch bookings and studio information
  useEffect(() => {
    let ignore = false;

    async function fetchBookings() {
      try {
        const response = await fetch(getApiUrl("/api/bookings/my-bookings"), {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (ignore) return;

        if (response.status === 401) {
          toast.error("Please login to view your bookings.");

          router.push(
            `/login?callbackURL=${encodeURIComponent("/my-bookings")}`,
          );

          return;
        }

        const result: BookingsResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load bookings.");
        }

        const bookingList = result.bookings || [];

        // Fetch studio information for every booking
        const bookingsWithStudios = await Promise.all(
          bookingList.map(async (booking) => {
            try {
              const studioResponse = await fetch(
                getApiUrl(`/api/studios/${booking.studioId}`),
                {
                  method: "GET",
                  cache: "no-store",
                },
              );

              if (!studioResponse.ok) {
                return { ...booking, studio: undefined };
              }

              const studioResult: StudioResponse = await studioResponse.json();

              return {
                ...booking,
                studio: studioResult.success ? studioResult.studio : undefined,
              };
            } catch {
              return { ...booking, studio: undefined };
            }
          }),
        );

        if (!ignore) {
          setBookings(bookingsWithStudios);
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

    void fetchBookings();

    return () => {
      ignore = true;
    };
  }, [router, retryKey]);

  // Cancel a pending booking
  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);

      const response = await fetch(
        getApiUrl(`/api/bookings/${bookingId}/cancel`),
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      if (response.status === 401) {
        toast.error("Please login to cancel your booking.");

        router.push(`/login?callbackURL=${encodeURIComponent("/my-bookings")}`);

        return;
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to cancel booking.");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled" }
            : booking,
        ),
      );

      toast.success("Booking cancelled successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCancellingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="animate-spin text-primary" size={40} />

        <p className="text-sm font-medium text-muted">
          Loading your bookings...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 rounded-2xl bg-primary/10 p-5 text-primary">
          <XCircle size={40} />
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          Unable to Load Bookings
        </h1>

        <p className="mt-3 max-w-md text-sm leading-7 text-muted">{error}</p>

        <button
          type="button"
          onClick={() => {
            setError("");
            setLoading(true);
            setRetryKey((previous) => previous + 1);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <ClipboardList size={18} />
            Booking Management
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Manage your studio reservations and keep track of your booking
            status.
          </p>
        </div>

        {/* Booking Summary */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              "Pending",
              "Confirmed",
              "Completed",
              "Cancelled",
            ] as BookingStatus[]
          ).map((status) => (
            <div
              key={status}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5"
            >
              <p className="text-xs font-medium text-muted sm:text-sm">
                {status}
              </p>

              <p className="mt-2 text-2xl font-extrabold text-foreground">
                {bookings.filter((booking) => booking.status === status).length}
              </p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <div className="mb-5 rounded-2xl bg-primary/10 p-5 text-primary">
              <CalendarDays size={42} />
            </div>

            <h2 className="text-xl font-bold text-foreground">
              No Bookings Yet
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-muted">
              You haven&apos;t booked any creative spaces yet. Explore our
              studios and find the perfect space for your next project.
            </p>

            <Link
              href="/studios"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Explore Studios
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          /* Booking List */
          <div className="space-y-5">
            {bookings.map((booking) => {
              const duration = calculateDuration(
                booking.startTime,
                booking.endTime,
              );

              const rentalPrice = booking.totalPrice;
              const securityDeposit = booking.studio?.securityDeposit;

              const totalAmount =
                securityDeposit !== undefined
                  ? rentalPrice + securityDeposit
                  : undefined;

              return (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="grid md:grid-cols-[220px_1fr]">
                    {/* Studio Image */}
                    <div className="relative min-h-[190px] bg-secondary md:min-h-full">
                      {booking.studio?.image ? (
                        <Image
                          src={booking.studio.image}
                          alt={booking.studio.name || "Studio"}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 220px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-[190px] items-center justify-center text-muted">
                          <Building2 size={45} />
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="min-w-0 p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-xl font-bold text-foreground">
                            {booking.studio?.name || "Studio Unavailable"}
                          </h2>

                          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                            <MapPin
                              size={15}
                              className="shrink-0 text-primary"
                            />
                            {booking.studio?.location || "Location unavailable"}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            statusStyles[booking.status] || statusStyles.Pending
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      {/* Booking Information */}
                      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                            <CalendarDays size={19} />
                          </div>

                          <div>
                            <p className="text-xs text-muted">Booking Date</p>

                            <p className="mt-1 text-sm font-semibold text-foreground">
                              {formatDate(booking.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                            <Clock size={19} />
                          </div>

                          <div>
                            <p className="text-xs text-muted">Booking Time</p>

                            <p className="mt-1 text-sm font-semibold text-foreground">
                              {formatTime(booking.startTime)} -{" "}
                              {formatTime(booking.endTime)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="mt-6 flex flex-col justify-between gap-5 border-t border-border pt-5 sm:flex-row sm:items-end">
                        <div className="w-full sm:max-w-xs">
                          <p className="mb-3 text-sm font-bold text-foreground">
                            Booking Price Details
                          </p>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between gap-4">
                              <span className="text-muted">Duration</span>

                              <span className="font-medium text-foreground">
                                {duration} {duration === 1 ? "Hour" : "Hours"}
                              </span>
                            </div>

                            <div className="flex justify-between gap-4">
                              <span className="text-muted">Rental Price</span>

                              <span className="font-medium text-foreground">
                                {formatPrice(rentalPrice)}
                              </span>
                            </div>

                            <div className="flex justify-between gap-4">
                              <span className="text-muted">
                                Security Deposit
                              </span>

                              <span className="font-medium text-foreground">
                                {securityDeposit !== undefined
                                  ? formatPrice(securityDeposit)
                                  : "Unavailable"}
                              </span>
                            </div>

                            <div className="flex justify-between gap-4 border-t border-border pt-3">
                              <span className="font-bold text-foreground">
                                Total Amount
                              </span>

                              <span className="text-lg font-extrabold text-primary">
                                {totalAmount !== undefined
                                  ? formatPrice(totalAmount)
                                  : "Unavailable"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={`/studios/${booking.studioId}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
                          >
                            View Studio
                            <ArrowRight size={15} />
                          </Link>

                          {booking.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={cancellingId === booking._id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {cancellingId === booking._id ? (
                                <>
                                  <Loader2 size={16} className="animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <XCircle size={16} />
                                  Cancel Booking
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
