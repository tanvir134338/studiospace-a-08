"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  MapPin,
  Users,
  Building2,
  Loader2,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface Studio {
  _id: string;
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  capacity: number;
  image: string;
  amenities: string[];
  category: string;
  createdAt?: string;
}

interface StudiosResponse {
  success: boolean;
  message?: string;
  studios?: Studio[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function formatCategory(category: string | undefined) {
  if (!category) return "Creative Space";

  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchStudios() {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(`${API_URL}/api/studios`, {
          method: "GET",
          cache: "no-store",
        });

        const result: StudiosResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load featured studios.");
        }

        const allStudios = result.studios || [];

        // Sort studios by newest first.
        const sortedStudios = [...allStudios].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

          return dateB - dateA;
        });

        if (!cancelled) {
          // Display a maximum of six studios.
          setStudios(sortedStudios.slice(0, 6));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Featured studios error:", err);

          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading studios.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchStudios();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
              <Sparkles size={16} />
              Handpicked Spaces
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Featured <span className="text-primary">Studios.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
              Discover some of the latest creative spaces available for your
              next project.
            </p>
          </div>

          <Link
            href="/studios"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            Explore All Studios
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <Loader2 size={35} className="animate-spin text-primary" />

            <p className="mt-4 text-sm text-muted">
              Loading featured studios...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-5 text-center">
            <AlertCircle size={40} className="text-red-500" />

            <h3 className="mt-4 text-xl font-bold text-foreground">
              Unable to Load Studios
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetryKey((previous) => previous + 1)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && studios.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-5 text-center">
            <Building2 size={45} className="text-primary" />

            <h3 className="mt-4 text-xl font-bold text-foreground">
              No Studios Available Yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted">
              New creative spaces will appear here once they are listed.
            </p>

            <Link
              href="/studios"
              className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent"
            >
              Explore Studios
            </Link>
          </div>
        )}

        {/* Featured Studio Cards */}
        {!loading && !error && studios.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Studio Image */}
                <div className="relative h-56 shrink-0 overflow-hidden bg-secondary">
                  {studio.image ? (
                    <Image
                      src={studio.image}
                      alt={studio.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2 size={42} className="text-muted" />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-bold capitalize text-white backdrop-blur">
                    {formatCategory(studio.category)}
                  </span>

                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
                    <Sparkles size={13} />
                    Featured
                  </span>
                </div>

                {/* Studio Information */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {studio.name}
                  </h3>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-muted">
                    {studio.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-muted">
                    <MapPin size={17} className="shrink-0 text-primary" />
                    <span className="line-clamp-1">{studio.location}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                    <Users size={17} className="shrink-0 text-primary" />
                    Capacity: {studio.capacity} people
                  </div>

                  {/* Price and Button */}
                  <div className="mt-auto mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
                    <div>
                      <p className="text-xs text-muted">Starting from</p>

                      <p className="mt-1 text-xl font-extrabold text-primary">
                        ${studio.pricePerHour}
                        <span className="text-xs font-medium text-muted">
                          /hour
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground transition hover:bg-accent sm:text-sm"
                    >
                      View Details
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
