"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  Upload,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
  Loader2,
  Star,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

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
  images?: string[];
  ownerId: string;
}

// Gallery image type
interface GalleryImage {
  id: string;
  url: string;
  file: File | null;
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

  // Gallery states
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

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
        const response = await fetch(`${API_URL}/api/studios/${studioId}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

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

        // Load existing gallery
        const existingImages =
          studio.images && studio.images.length > 0
            ? studio.images
            : studio.image
              ? [studio.image]
              : [];

        setGalleryImages(
          existingImages.slice(0, 5).map((url, index) => ({
            id: `existing-${index}-${url}`,
            url,
            file: null,
          })),
        );
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

  // Clean up temporary image previews
  useEffect(() => {
    return () => {
      galleryImages.forEach((image) => {
        if (image.file && image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [galleryImages]);

  // Add new gallery images
  const handleImageChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - galleryImages.length;

    if (remainingSlots <= 0) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    const selectedFiles = Array.from(files);

    if (selectedFiles.length > remainingSlots) {
      toast.error(
        `You can add only ${remainingSlots} more image(s). Maximum 5 images allowed.`,
      );
    }

    const validFiles: GalleryImage[] = [];

    for (const file of selectedFiles.slice(0, remainingSlots)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 5MB size limit.`);
        continue;
      }

      validFiles.push({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
      });
    }

    if (validFiles.length > 0) {
      setGalleryImages((previous) => [...previous, ...validFiles]);
    }
  };

  // Remove gallery image
  const removeImage = (imageId: string) => {
    const imageToRemove = galleryImages.find((image) => image.id === imageId);

    if (imageToRemove?.file && imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    setGalleryImages((previous) =>
      previous.filter((image) => image.id !== imageId),
    );
  };

  // Make selected image the cover image
  const makeCoverImage = (imageId: string) => {
    setGalleryImages((previous) => {
      const selectedIndex = previous.findIndex((image) => image.id === imageId);

      if (selectedIndex <= 0) return previous;

      const updatedImages = [...previous];
      const [selectedImage] = updatedImages.splice(selectedIndex, 1);

      updatedImages.unshift(selectedImage);

      return updatedImages;
    });

    toast.success("Cover image changed.");
  };

  // Toggle amenities
  const toggleAmenity = (amenity: string) => {
    setAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity],
    );
  };

  // Upload a new image to ImgBB
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const uploadResponse = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok || !uploadResult.success) {
      throw new Error(uploadResult.message || "Image upload failed.");
    }

    if (!uploadResult.imageUrl) {
      throw new Error("Image upload did not return a valid URL.");
    }

    return uploadResult.imageUrl;
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

    if (galleryImages.length === 0) {
      toast.error("Please keep at least one studio image.");
      return;
    }

    if (galleryImages.length > 5) {
      toast.error("You can keep a maximum of 5 images.");
      return;
    }

    if (amenities.length === 0) {
      toast.error("Please select at least one amenity.");
      return;
    }

    if (
      !Number.isFinite(Number(pricePerHour)) ||
      Number(pricePerHour) <= 0 ||
      !Number.isFinite(Number(securityDeposit)) ||
      Number(securityDeposit) < 0 ||
      !Number.isFinite(Number(capacity)) ||
      Number(capacity) <= 0
    ) {
      toast.error("Please enter valid pricing and capacity.");
      return;
    }

    try {
      setSaving(true);

      // Keep existing URLs and upload only new images
      const imageUrls: string[] = [];

      for (const image of galleryImages) {
        if (image.file) {
          const uploadedUrl = await uploadImage(image.file);
          imageUrls.push(uploadedUrl);
        } else {
          imageUrls.push(image.url);
        }
      }

      if (imageUrls.length === 0) {
        throw new Error("At least one studio image is required.");
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

        // First image is the cover image
        image: imageUrls[0],

        // Complete gallery
        images: imageUrls,
      };

      // Update studio in MongoDB
      const response = await fetch(`${API_URL}/api/studios/${studioId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studioData),
      });

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

          {/* Studio Gallery */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <ImageIcon size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Studio Gallery *
                  </h2>

                  <p className="text-xs text-muted">
                    Manage your studio photos and cover image
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                {galleryImages.length}/5 Images
              </span>
            </div>

            {/* Gallery Images */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative overflow-hidden rounded-xl border ${
                      index === 0
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full bg-secondary">
                      <Image
                        src={image.url}
                        alt={`Studio gallery image ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized={image.url.startsWith("blob:")}
                      />
                    </div>

                    {/* Cover Badge */}
                    {index === 0 && (
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1.5 text-[10px] font-bold text-primary-foreground shadow">
                        <Star size={12} fill="currentColor" />
                        Cover Image
                      </span>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      disabled={saving}
                      aria-label="Remove image"
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>

                    {/* Make Cover Button */}
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => makeCoverImage(image.id)}
                        disabled={saving}
                        className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/75 px-2 py-2 text-[10px] font-bold text-white transition hover:bg-primary disabled:opacity-50 sm:text-xs"
                      >
                        Make Cover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Images */}
            {galleryImages.length < 5 && (
              <label className="mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-4 py-6 text-center transition hover:border-primary hover:bg-primary/5">
                <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
                  <Upload size={24} />
                </div>

                <span className="text-sm font-bold text-foreground">
                  Add More Images
                </span>

                <span className="mt-2 text-xs text-muted">
                  JPG, PNG or WEBP · Maximum 5MB per image
                </span>

                <span className="mt-1 text-xs text-muted">
                  You can add {5 - galleryImages.length} more image(s).
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={saving}
                  className="hidden"
                  onChange={(e) => {
                    handleImageChange(e.target.files);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            )}

            {galleryImages.length === 0 && (
              <p className="mt-4 text-center text-xs font-medium text-red-500">
                At least one image is required.
              </p>
            )}

            <p className="mt-5 text-xs leading-6 text-muted">
              The first image will be displayed as your studio cover image. You
              can change the cover image anytime using the Make Cover button.
              Maximum 5 images are allowed.
            </p>
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
