"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// Studio categories
const categories = [
  { value: "photography", label: "Photography Studio" },
  { value: "film-video", label: "Film & Video" },
  { value: "podcast", label: "Podcast Studio" },
  { value: "music", label: "Music Production" },
  { value: "creative", label: "Creative Space" },
  { value: "events", label: "Events & Workshops" },
];

// Available amenities
const availableAmenities = [
  "Wi-Fi",
  "Air Conditioning",
  "Parking",
  "Lighting Equipment",
  "Camera Equipment",
  "Soundproofing",
  "Backdrop",
  "Restroom",
  "Kitchen",
  "Furniture",
];

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
}

function EditStudioForm() {
  const router = useRouter();

  const params = useParams<{ id: string }>();
  const studioId = params.id;

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [capacity, setCapacity] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");

  // Load existing studio information
  useEffect(() => {
    if (isPending || !user || !studioId) return;

    let cancelled = false;

    const loadStudio = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/studios/${studioId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success || !result.studio) {
          throw new Error(result.message || "Failed to load studio.");
        }

        const studio: Studio = result.studio;

        if (studio.ownerId !== user.id) {
          throw new Error("You are not authorized to edit this studio.");
        }

        if (cancelled) return;

        // Fill form with existing information
        setName(studio.name || "");
        setDescription(studio.description || "");
        setLocation(studio.location || "");
        setCategory(studio.category || "");

        setPricePerHour(String(studio.pricePerHour ?? ""));

        setSecurityDeposit(String(studio.securityDeposit ?? ""));

        setCapacity(String(studio.capacity ?? ""));

        setAmenities(studio.amenities || []);
        setImagePreview(studio.image || "");
      } catch (error) {
        if (!cancelled) {
          setPageError(
            error instanceof Error ? error.message : "Something went wrong.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStudio();

    return () => {
      cancelled = true;
    };
  }, [isPending, user, studioId]);

  // Handle image selection
  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    // Revoke previous local preview
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Remove selected image
  const removeImage = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
  };

  // Toggle amenities
  const toggleAmenity = (amenity: string) => {
    setAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity],
    );
  };

  // Update studio
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please login to update a studio.");
      router.push("/login");
      return;
    }

    if (!name.trim() || !description.trim() || !location.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!imagePreview) {
      toast.error("Please upload a studio image.");
      return;
    }

    if (amenities.length === 0) {
      toast.error("Please select at least one amenity.");
      return;
    }

    if (
      Number(pricePerHour) <= 0 ||
      Number(securityDeposit) < 0 ||
      Number(capacity) <= 0
    ) {
      toast.error("Please enter valid pricing and capacity.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = imagePreview;

      // Upload new image only when selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(uploadResult.message || "Image upload failed.");
        }

        imageUrl = uploadResult.imageUrl;
      }

      // Updated studio information
      const studioData = {
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
        category,
        pricePerHour: Number(pricePerHour),
        securityDeposit: Number(securityDeposit),
        capacity: Number(capacity),
        amenities,
        image: imageUrl,
      };

      // Update studio in MongoDB
      const response = await fetch(
        `http://localhost:5000/api/studios/${studioId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studioData),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update studio.");
      }

      toast.success("Studio updated successfully!");

      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Studio update failed:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Authentication and data loading
  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // Login required
  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Building2 size={48} className="mb-4 text-primary" />

        <h1 className="text-2xl font-bold text-foreground">Login Required</h1>

        <p className="mt-2 text-sm text-muted">
          Please login to edit your studio.
        </p>

        <Link
          href="/login"
          className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          Login Now
        </Link>
      </div>
    );
  }

  // Error state
  if (pageError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Building2 size={48} className="mb-4 text-primary" />

        <h1 className="text-2xl font-bold text-foreground">
          Unable to Load Studio
        </h1>

        <p className="mt-3 text-sm text-muted">{pageError}</p>

        <Link
          href="/my-listings"
          className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <Link
          href="/my-listings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft size={17} />
          Back to My Listings
        </Link>

        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Host Dashboard
          </span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Edit Your Studio
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Update your studio information, facilities and pricing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Host Information */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Users size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Host Information
                </h2>

                <p className="text-xs text-muted">Your account information</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Your Name
                </label>

                <input
                  value={user.name || ""}
                  readOnly
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>

                <input
                  value={user.email || ""}
                  readOnly
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted outline-none"
                />
              </div>
            </div>
          </section>

          {/* Studio Information */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Building2 size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Studio Information
                </h2>

                <p className="text-xs text-muted">
                  Update your creative space details
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Studio Name *
                </label>

                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your studio name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category *
                </label>

                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                >
                  <option value="">Select a category</option>

                  {categories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Studio Description *
                </label>

                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your studio, facilities and what makes it special..."
                  className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <MapPin size={16} className="text-primary" />
                  Studio Location *
                </label>

                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter full studio address"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>
            </div>
          </section>

          {/* Pricing and Capacity */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <DollarSign size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Pricing & Capacity
                </h2>

                <p className="text-xs text-muted">
                  Update your studio pricing and capacity
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Hourly Rate ($) *
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Security Deposit ($) *
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Users size={16} className="text-primary" />
                  Maximum Capacity *
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Maximum number of people"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-foreground">
                Studio Amenities *
              </h2>

              <p className="mt-1 text-xs text-muted">
                Select the facilities available in your studio.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {availableAmenities.map((amenity) => {
                const selected = amenities.includes(amenity);

                return (
                  <label
                    key={amenity}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-medium transition sm:text-sm ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleAmenity(amenity)}
                      className="h-4 w-4 accent-primary"
                    />

                    {amenity}
                  </label>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-muted">
              {amenities.length} amenities selected
            </p>
          </section>

          {/* Studio Image */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <ImageIcon size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Studio Image *
                </h2>

                <p className="text-xs text-muted">
                  Keep your current image or upload a new one
                </p>
              </div>
            </div>

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <div className="relative h-64 w-full sm:h-80">
                  <Image
                    src={imagePreview}
                    alt="Studio preview"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 768px"
                    className="object-cover"
                    unoptimized={imagePreview.startsWith("blob:")}
                  />
                </div>

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-500"
                  aria-label="Remove image"
                >
                  <X size={19} />
                </button>

                <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-lg bg-black/75 px-4 py-2 text-xs font-semibold text-white transition hover:bg-black">
                  <Upload size={15} />
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleImageChange(e.target.files?.[0]);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
              </div>
            ) : (
              <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-4 text-center transition hover:border-primary hover:bg-primary/5">
                <Upload size={34} className="mb-4 text-primary" />

                <span className="text-sm font-bold text-foreground">
                  Click to upload studio image
                </span>

                <span className="mt-2 text-xs text-muted">
                  JPG, PNG or WEBP · Maximum 5MB
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleImageChange(e.target.files?.[0]);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            )}
          </section>

          {/* Submit Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="rounded-xl border border-border px-7 py-3.5 text-sm font-semibold transition hover:bg-secondary disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating Studio...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Update Studio
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// Suspense boundary for Next.js 16 useParams()
export default function EditStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      }
    >
      <EditStudioForm />
    </Suspense>
  );
}
