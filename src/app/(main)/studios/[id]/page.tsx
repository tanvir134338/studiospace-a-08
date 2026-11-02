"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

// Main details component
function StudioDetailsContent() {
  const params = useParams<{ id: string }>();
  const studioId = params.id;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

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

  // Booking button
  const handleBooking = () => {
    toast.info("Booking functionality is coming soon!");
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
                Booking functionality will be available soon.
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
                <ShieldCheck size={16} className="text-primary" />
                Secure studio booking experience
              </div>
            </div>
          </aside>
        </div>
      </div>
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
