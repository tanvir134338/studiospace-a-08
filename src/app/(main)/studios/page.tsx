"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Search,
  MapPin,
  Users,
  SlidersHorizontal,
  ArrowUpRight,
  Building2,
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
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
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "photography", label: "Photography" },
  { value: "film-video", label: "Film & Video" },
  { value: "podcast", label: "Podcast" },
  { value: "music", label: "Music Production" },
  { value: "creative", label: "Creative Space" },
  { value: "events", label: "Events & Workshops" },
];

// Normalize category values from the database
function normalizeCategory(category: string | undefined) {
  const value = (category || "")
    .toLowerCase()
    .trim()
    .replace(/[_]/g, "-")
    .replace(/\s+/g, " ");

  const categoryMap: Record<string, string> = {
    photography: "photography",
    "photography studio": "photography",
    "photography studios": "photography",

    "film video": "film-video",
    "film & video": "film-video",
    "film-video": "film-video",

    podcast: "podcast",
    "podcast studio": "podcast",
    "podcast studios": "podcast",

    music: "music",
    "music production": "music",

    creative: "creative",
    "creative space": "creative",
    "creative spaces": "creative",

    events: "events",
    event: "events",
    "events & workshops": "events",
    "events and workshops": "events",
  };

  return categoryMap[value] || value;
}

// Fetch studios from API
async function getStudios(): Promise<Studio[]> {
  const response = await fetch("http://localhost:5000/api/studios", {
    method: "GET",
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load studios.");
  }

  return result.studios || [];
}

// Main Explore Studios Content
function ExploreStudiosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Read category directly from the URL
  const categoryParam = searchParams.get("category");

  const normalizedCategory = normalizeCategory(categoryParam || "");

  const selectedCategory = categories.some(
    (category) => category.value === normalizedCategory,
  )
    ? normalizedCategory
    : "all";

  // Load studios when the page mounts
  useEffect(() => {
    let ignore = false;

    async function loadStudios() {
      try {
        const studioData = await getStudios();

        if (!ignore) {
          setStudios(studioData);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to fetch studios:", err);

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

    loadStudios();

    return () => {
      ignore = true;
    };
  }, []);

  // Filter and sort studios
  const filteredStudios = useMemo(() => {
    let result = [...studios];

    const searchTerm = search.trim().toLowerCase();

    // Search by studio name or location
    if (searchTerm) {
      result = result.filter(
        (studio) =>
          (studio.name || "").toLowerCase().includes(searchTerm) ||
          (studio.location || "").toLowerCase().includes(searchTerm),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (studio) => normalizeCategory(studio.category) === selectedCategory,
      );
    }

    // Sort by price
    if (sortBy === "low-to-high") {
      result.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => b.pricePerHour - a.pricePerHour);
    }

    return result;
  }, [studios, search, selectedCategory, sortBy]);

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    const query = params.toString();

    router.push(query ? `/studios?${query}` : "/studios");
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setSortBy("default");
    router.push("/studios");
  };

  // Retry fetching studios
  const handleRetry = async () => {
    setLoading(true);
    setError("");

    try {
      const studioData = await getStudios();
      setStudios(studioData);
    } catch (err) {
      console.error("Failed to fetch studios:", err);

      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Page Header */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Discover Creative Spaces
          </span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Explore <span className="text-primary">Studios.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Find the perfect creative space for your next photography,
            filmmaking, podcast or production project.
          </p>
        </div>

        {/* Search and Filters */}
        <section className="mb-10 rounded-2xl border border-border bg-card p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_240px_220px]">
            {/* Search */}
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by studio name or location..."
                className="w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <SlidersHorizontal
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />

              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort studios by price"
              className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary"
            >
              <option value="default">Default Sorting</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>

          {/* Filter Information */}
          <div className="mt-5 flex flex-col justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <p className="text-sm text-muted">
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredStudios.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-foreground">
                {studios.length}
              </span>{" "}
              studios
            </p>

            {(search || selectedCategory !== "all" || sortBy !== "default") && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition hover:text-accent"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center">
            <Loader2 size={35} className="animate-spin text-primary" />

            <p className="mt-4 text-sm text-muted">
              Discovering creative studios...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-5 text-center">
            <AlertCircle size={42} className="mb-4 text-red-500" />

            <h2 className="text-xl font-bold text-foreground">
              Unable to Load Studios
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-muted">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && studios.length === 0 && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-5 text-center">
            <Building2 size={45} className="mb-5 text-primary" />

            <h2 className="text-xl font-bold text-foreground">
              No Studios Available
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-muted">
              There are no studios listed yet. Check back later for new creative
              spaces.
            </p>
          </div>
        )}

        {/* No Search Results */}
        {!loading &&
          !error &&
          studios.length > 0 &&
          filteredStudios.length === 0 && (
            <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-5 text-center">
              <Search size={42} className="mb-4 text-muted" />

              <h2 className="text-xl font-bold text-foreground">
                No Matching Studios Found
              </h2>

              <p className="mt-3 text-sm text-muted">
                Try changing your search or selected filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* Studio Cards */}
        {!loading && !error && filteredStudios.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio) => (
              <article
                key={studio._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Studio Image */}
                <div className="relative h-56 overflow-hidden bg-secondary">
                  {studio.image ? (
                    <Image
                      src={studio.image}
                      alt={studio.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2 size={42} className="text-muted" />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-bold capitalize text-white backdrop-blur">
                    {studio.category || "Studio"}
                  </span>
                </div>

                {/* Studio Content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h2 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {studio.name}
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                    {studio.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-muted">
                    <MapPin size={17} className="shrink-0 text-primary" />

                    <span className="line-clamp-1">{studio.location}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                    <Users size={17} className="text-primary" />
                    Capacity: {studio.capacity} people
                  </div>

                  {/* Price and Details */}
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
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
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground transition hover:bg-accent sm:text-sm"
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
    </main>
  );
}

// Page with Suspense boundary for useSearchParams
export default function ExploreStudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <Loader2 size={35} className="animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted">Loading studios...</p>
        </div>
      }
    >
      <ExploreStudiosContent />
    </Suspense>
  );
}
