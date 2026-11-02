"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Loader2,
  RefreshCw,
  CalendarDays,
  X,
  Clock,
} from "lucide-react";

import { toast } from "sonner";

// Studio data type
interface Studio {
  _id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  pricePerHour: number;
  securityDeposit: number;
  capacity: number;
  amenities: string[];
  image: string;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  studio?: Studio;
}

// Category labels
const categoryLabels: Record<string, string> = {
  photography: "Photography Studio",
  "film-video": "Film & Video",
  podcast: "Podcast Studio",
  music: "Music Production",
  creative: "Creative Space",
  events: "Events & Workshops",
};

// Get today's date in local YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Main details component
function StudioDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const studioId = params.id;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Booking states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch studio details
  useEffect(() => {
    if (!studioId) return;

    let cancelled = false;

    const fetchStudio = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/studios/${studioId}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result: ApiResponse = await response.json();

        if (!response.ok || !result.success || !result.studio) {
          throw new Error(result.message || "Unable to load studio details.");
        }

        if (!cancelled) {
          setStudio(result.studio);
          setImageError(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStudio();

    return () => {
      cancelled = true;
    };
  }, [studioId, retryKey]);

  // Retry loading
  const handleRetry = () => {
    setRetryKey((previous) => previous + 1);
  };

  // Open booking modal
  const handleBooking = () => {
    setBookingDate("");
    setStartTime("09:00");
    setEndTime("11:00");
    setIsBookingOpen(true);
  };

  // Calculate booking duration
  const calculateDuration = () => {
    if (!startTime || !endTime || startTime >= endTime) {
      return 0;
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    return (end - start) / 60;
  };

  const duration = calculateDuration();

  const rentalPrice = studio ? duration * studio.pricePerHour : 0;

  const securityDeposit = studio ? studio.securityDeposit : 0;

  const totalAmount = rentalPrice + securityDeposit;

  // Submit booking
  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!studio) return;

    if (!bookingDate) {
      toast.error("Please select a booking date.");
      return;
    }

    if (bookingDate < getTodayDate()) {
      toast.error("Past dates cannot be selected.");
      return;
    }

    if (duration <= 0) {
      toast.error("End time must be after start time.");
      return;
    }

    try {
      setBookingLoading(true);

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studioId: studio._id,
          date: bookingDate,
          startTime,
          endTime,
          totalPrice: rentalPrice,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        toast.error("Please login before booking a studio.");
        setIsBookingOpen(false);
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to create booking.");
      }

      toast.success("Booking request submitted successfully!");

      setIsBookingOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4">
        <Loader2 className="animate-spin text-primary" size={40} />

        <p className="text-sm font-medium text-muted">
          Loading studio details...
        </p>
      </div>
    );
  }

  // Error state
  if (error || !studio) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 rounded-2xl bg-primary/10 p-5 text-primary">
          <Building2 size={42} />
        </div>

        <h1 className="text-2xl font-bold text-foreground">Studio Not Found</h1>

        <p className="mt-3 max-w-md text-sm leading-7 text-muted">
          {error || "We couldn't find the studio you're looking for."}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
          >
            <ArrowLeft size={16} />
            Explore Studios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Navigation */}
        <Link
          href="/studios"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-primary"
        >
          <ArrowLeft size={18} />
          Back to Explore Studios
        </Link>

        {/* Main Layout */}
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px] xl:gap-12">
          {/* Left Section */}
          <div className="min-w-0">
            {/* Studio Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-secondary sm:aspect-[16/9]">
              {studio.image && !imageError ? (
                <Image
                  src={studio.image}
                  alt={studio.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted">
                  <Building2 size={60} />
                </div>
              )}

              <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/65 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                {categoryLabels[studio.category] || studio.category}
              </div>
            </div>

            {/* Studio Heading */}
            <div className="mt-7">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <MapPin size={16} className="text-primary" />
                <span>{studio.location}</span>
              </div>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {studio.name}
              </h1>

              <p className="mt-5 text-sm leading-8 text-muted sm:text-base">
                {studio.description}
              </p>
            </div>

            {/* Studio Highlights */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <Users className="mb-3 text-primary" size={23} />

                <p className="text-xl font-bold text-foreground">
                  {studio.capacity}
                </p>

                <p className="mt-1 text-xs text-muted">Maximum Capacity</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <DollarSign className="mb-3 text-primary" size={23} />

                <p className="text-xl font-bold text-foreground">
                  ${studio.pricePerHour}
                </p>

                <p className="mt-1 text-xs text-muted">Per Hour</p>
              </div>

              <div className="col-span-2 rounded-2xl border border-border bg-card p-4 sm:col-span-1 sm:p-5">
                <ShieldCheck className="mb-3 text-primary" size={23} />

                <p className="text-xl font-bold text-foreground">
                  ${studio.securityDeposit}
                </p>

                <p className="mt-1 text-xs text-muted">Security Deposit</p>
              </div>
            </div>

            {/* Amenities */}
            <section className="mt-10">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-foreground">
                  Studio Amenities
                </h2>

                <p className="mt-2 text-sm text-muted">
                  Facilities available at this studio.
                </p>
              </div>

              {studio.amenities?.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {studio.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-primary"
                      />

                      <span className="text-sm font-medium text-foreground">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-border p-5 text-sm text-muted">
                  No amenities information available.
                </p>
              )}
            </section>

            {/* Host Information */}
            <section className="mt-10 rounded-2xl border border-border bg-card p-5 sm:p-7">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Building2 size={25} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Studio Host
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    This creative space is listed by its owner.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Section - Booking Card */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <p className="text-sm font-medium text-muted">
                Studio Rental Price
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-foreground">
                  ${studio.pricePerHour}
                </span>

                <span className="text-sm text-muted">/ hour</span>
              </div>

              <div className="my-6 border-t border-border" />

              {/* Pricing Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted">Hourly Rate</span>

                  <span className="font-semibold text-foreground">
                    ${studio.pricePerHour}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted">Security Deposit</span>

                  <span className="font-semibold text-foreground">
                    ${studio.securityDeposit}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted">Capacity</span>

                  <span className="font-semibold text-foreground">
                    {studio.capacity} People
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-border" />

              {/* Booking Button */}
              <button
                onClick={handleBooking}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-bold text-primary-foreground transition hover:opacity-90"
              >
                <CalendarDays size={19} />
                Book This Studio
              </button>

              <p className="mt-4 text-center text-xs leading-6 text-muted">
                Select your preferred date and time to request a booking.
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
                <ShieldCheck size={16} className="text-primary" />
                Secure studio booking experience
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !bookingLoading) {
              setIsBookingOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-7"
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="booking-modal-title"
                  className="text-2xl font-bold text-foreground"
                >
                  Book This Studio
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Select your preferred booking schedule.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                disabled={bookingLoading}
                className="rounded-lg p-2 text-muted transition hover:bg-secondary hover:text-foreground disabled:opacity-50"
                aria-label="Close booking modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Studio Information */}
            <div className="mb-6 rounded-xl bg-secondary/60 p-4">
              <p className="font-semibold text-foreground">{studio.name}</p>

              <p className="mt-1 text-sm text-muted">{studio.location}</p>

              <p className="mt-2 text-sm font-semibold text-primary">
                ${studio.pricePerHour} / hour
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* Booking Date */}
              <div>
                <label
                  htmlFor="bookingDate"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Booking Date
                </label>

                <input
                  id="bookingDate"
                  type="date"
                  required
                  min={getTodayDate()}
                  value={bookingDate}
                  onChange={(event) => setBookingDate(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                />
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startTime"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Start Time
                  </label>

                  <input
                    id="startTime"
                    type="time"
                    required
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endTime"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    End Time
                  </label>

                  <input
                    id="endTime"
                    type="time"
                    required
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <div className="space-y-3 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted">
                    <Clock size={16} />
                    Duration
                  </span>

                  <span className="font-semibold text-foreground">
                    {duration > 0 ? `${duration} hours` : "Invalid time"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted">Hourly Rate</span>

                  <span className="font-semibold text-foreground">
                    ${studio.pricePerHour}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted">Rental Price</span>

                  <span className="font-semibold text-foreground">
                    ${rentalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted">Security Deposit</span>

                  <span className="font-semibold text-foreground">
                    ${securityDeposit.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between gap-3">
                    <span className="font-bold text-foreground">
                      Total Amount
                    </span>

                    <span className="text-xl font-extrabold text-primary">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  bookingLoading ||
                  duration <= 0 ||
                  !bookingDate ||
                  bookingDate < getTodayDate()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>

              <p className="text-center text-xs leading-5 text-muted">
                Your booking request will be submitted with Pending status.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Page wrapper with Suspense
export default function StudioDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      }
    >
      <StudioDetailsContent />
    </Suspense>
  );
}
