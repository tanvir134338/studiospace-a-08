"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  MapPin,
  Users,
  Pencil,
  Trash2,
  Loader2,
  Building2,
  RefreshCw,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface Studio {
  _id: string;
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  securityDeposit: number;
  capacity: number;
  image: string;
  amenities: string[];
  category: string;
  createdAt: string;
}

export default function MyListingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch user's studios
  const fetchStudios = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/studios/my-listings",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load your studios.");
      }

      setError("");
      setStudios(result.studios || []);
    } catch (err) {
      console.error("Failed to fetch studios:", err);

      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load studios after authentication is ready
  useEffect(() => {
    if (isPending || !user) return;

    let cancelled = false;

    const loadStudios = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/studios/my-listings",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load your studios.");
        }

        if (!cancelled) {
          setError("");
          setStudios(result.studios || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch studios:", err);

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

    loadStudios();

    return () => {
      cancelled = true;
    };
  }, [isPending, user]);

  // Retry loading studios
  const handleRetry = async () => {
    setLoading(true);
    await fetchStudios();
  };

  // Delete studio
  const handleDelete = async () => {
    if (!selectedStudio) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `http://localhost:5000/api/studios/${selectedStudio._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete studio.");
      }

      setStudios((previous) =>
        previous.filter((studio) => studio._id !== selectedStudio._id),
      );

      setSelectedStudio(null);

      toast.success("Studio deleted successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete studio.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Authentication loading
  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={34} className="animate-spin text-primary" />
      </div>
    );
  }

  // Login required
  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Building2 size={45} className="mb-4 text-primary" />

        <h1 className="text-2xl font-bold">Login Required</h1>

        <p className="mt-2 text-sm text-muted">
          Please login to view your studio listings.
        </p>

        <Link
          href="/login"
          className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Login Now
        </Link>
      </div>
    );
  }

  // Studio loading
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={34} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Host Dashboard
            </span>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              My Studio Listings
            </h1>

            <p className="mt-3 text-sm leading-7 text-muted">
              Manage and monitor all the creative spaces you have listed.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-accent"
          >
            <Plus size={19} />
            Add New Studio
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Building2 size={22} />
              </div>

              <div>
                <p className="text-sm text-muted">Total Studios</p>

                <p className="text-2xl font-extrabold">{studios.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Clock size={22} />
              </div>

              <div>
                <p className="text-sm text-muted">Latest Listing</p>

                <p className="text-lg font-bold">
                  {studios.length > 0
                    ? new Date(studios[0].createdAt).toLocaleDateString()
                    : "No listings yet"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="shrink-0 text-red-500" />

                <p className="text-sm text-red-500">{error}</p>
              </div>

              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center gap-2 text-sm font-semibold text-primary"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && studios.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <div className="mb-5 rounded-2xl bg-primary/10 p-5 text-primary">
              <Building2 size={38} />
            </div>

            <h2 className="text-xl font-bold">No Studios Listed Yet</h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-muted">
              You have not added any studios yet. Share your creative space with
              the community by creating your first listing.
            </p>

            <Link
              href="/add-studio"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-accent"
            >
              <Plus size={18} />
              Add Your First Studio
            </Link>
          </div>
        )}

        {/* Studio Grid */}
        {!error && studios.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-secondary">
                  <img
                    src={studio.image}
                    alt={studio.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-bold text-foreground backdrop-blur">
                    {studio.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-xl font-bold text-foreground">
                    {studio.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                    {studio.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-muted">
                    <MapPin size={16} className="shrink-0 text-primary" />

                    <span className="line-clamp-1">{studio.location}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                    <Users size={16} className="text-primary" />
                    Capacity: {studio.capacity} people
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-muted">Hourly Rate</p>

                      <p className="text-xl font-extrabold text-primary">
                        ${studio.pricePerHour}
                        <span className="text-xs font-medium text-muted">
                          /hr
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/studios/edit/${studio._id}`}
                        title="Edit studio"
                        aria-label={`Edit ${studio.name}`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                      >
                        <Pencil size={17} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setSelectedStudio(studio)}
                        title="Delete studio"
                        aria-label={`Delete ${studio.name}`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-red-500 transition hover:border-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {selectedStudio && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="rounded-xl bg-red-500/10 p-3 text-red-500">
                <Trash2 size={23} />
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudio(null)}
                disabled={deleting}
                aria-label="Close dialog"
                className="rounded-lg p-2 transition hover:bg-secondary"
              >
                <X size={19} />
              </button>
            </div>

            <h2 id="delete-title" className="text-xl font-bold">
              Delete Studio?
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">{selectedStudio.name}</strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setSelectedStudio(null)}
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete Studio
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
