"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
import ProtectedRoute from "@/components/ProtectedRoute";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

const categories = [
  { value: "photography", label: "Photography Studio" },
  { value: "film-video", label: "Film & Video" },
  { value: "podcast", label: "Podcast Studio" },
  { value: "music", label: "Music Production" },
  { value: "creative", label: "Creative Space" },
  { value: "events", label: "Events & Workshops" },
];

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

export default function AddStudioPage() {
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [capacity, setCapacity] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const previewUrlsRef = useRef<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Clean up temporary preview URLs
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Handle multiple image selection (maximum 5)
  const handleImageChange = (files: FileList | null) => {
    if (!files) return;

    const selectedFiles = Array.from(files);
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}: Please select a valid image.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Image size must be less than 5MB.`);
        continue;
      }

      validFiles.push(file);
    }

    const remainingSlots = 5 - imageFiles.length;

    if (remainingSlots <= 0) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      toast.error(`Only ${remainingSlots} more image(s) can be added.`);
    }

    if (filesToAdd.length === 0) return;

    const newPreviews = filesToAdd.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.push(previewUrl);
      return previewUrl;
    });

    setImageFiles((previous) => [...previous, ...filesToAdd]);
    setImagePreviews((previous) => [...previous, ...newPreviews]);
  };

  // Remove one selected image
  const removeImage = (index: number) => {
    const previewUrl = imagePreviews[index];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);

      previewUrlsRef.current = previewUrlsRef.current.filter(
        (url) => url !== previewUrl,
      );
    }

    setImageFiles((previous) => previous.filter((_, i) => i !== index));
    setImagePreviews((previous) => previous.filter((_, i) => i !== index));
  };

  // Handle amenities selection
  const toggleAmenity = (amenity: string) => {
    setAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity],
    );
  };

  // Reset all studio form fields after successful creation
  const resetForm = () => {
    setName("");
    setDescription("");
    setLocation("");
    setCategory("");
    setPricePerHour("");
    setSecurityDeposit("");
    setCapacity("");
    setAmenities([]);

    // Release temporary image preview URLs
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];

    setImageFiles([]);
    setImagePreviews([]);
  };

  // Submit studio
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please login to add a studio.");
      router.push("/login");
      return;
    }

    if (imageFiles.length === 0) {
      toast.error("Please upload at least one studio image.");
      return;
    }

    if (amenities.length === 0) {
      toast.error("Please select at least one amenity.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Upload all selected images to ImgBB
      const imageUrls: string[] = [];

      for (const imageFile of imageFiles) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadResult.success ||
          !uploadResult.imageUrl
        ) {
          throw new Error(
            uploadResult.message || `Failed to upload ${imageFile.name}.`,
          );
        }

        imageUrls.push(uploadResult.imageUrl);
      }

      // Step 2: Create studio
      const studioData = {
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
        category,
        pricePerHour: Number(pricePerHour),
        securityDeposit: Number(securityDeposit),
        capacity: Number(capacity),
        amenities,
        image: imageUrls[0],
        images: imageUrls,
      };

      const studioResponse = await fetch(`${API_URL}/api/studios`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studioData),
      });

      const studioResult = await studioResponse.json();

      if (!studioResponse.ok || !studioResult.success) {
        throw new Error(studioResult.message || "Failed to create studio.");
      }

      toast.success("Studio created successfully!");

      // Reset the form after successful creation
      resetForm();

      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Studio creation failed:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Host Your Space
            </span>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Add Your Studio
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Share your creative space with the community and start receiving
              bookings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Owner Information */}
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
                    value={user?.name || ""}
                    readOnly
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email Address
                  </label>

                  <input
                    value={user?.email || ""}
                    readOnly
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Basic Information */}
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
                    Tell us about your creative space
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
                    Set your studio pricing and capacity
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

            {/* Studio Gallery Images */}
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <ImageIcon size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Studio Gallery Images *
                  </h2>

                  <p className="text-xs text-muted">
                    Upload up to 5 images. The first image will be the cover
                    image.
                  </p>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="relative overflow-hidden rounded-xl border border-border"
                    >
                      <Image
                        src={preview}
                        alt={`Studio preview ${index + 1}`}
                        width={600}
                        height={400}
                        unoptimized
                        className="h-36 w-full object-cover sm:h-44"
                      />

                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                          Cover Image
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-500"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imageFiles.length < 5 && (
                <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-4 text-center transition hover:border-primary hover:bg-primary/5">
                  <Upload size={34} className="mb-4 text-primary" />

                  <span className="text-sm font-bold text-foreground">
                    Click to upload studio images
                  </span>

                  <span className="mt-2 text-xs text-muted">
                    JPG, PNG or WEBP · Maximum 5MB per image
                  </span>

                  <span className="mt-1 text-xs text-muted">
                    {imageFiles.length}/5 images selected
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleImageChange(e.target.files);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
              )}

              <p className="mt-4 text-xs text-muted">
                Select at least 1 image. You can add up to 5 images, and remove
                any image before publishing.
              </p>
            </section>

            {/* Submit */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="rounded-xl border border-border px-7 py-3.5 text-sm font-semibold transition hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Uploading & Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Publish Studio
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
