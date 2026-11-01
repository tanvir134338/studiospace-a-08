import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  Palette,
  Users,
} from "lucide-react";

const categories = [
  {
    title: "Photography Studios",
    description:
      "Professional spaces for portraits, fashion and product photography.",
    icon: Camera,
    slug: "photography",
    number: "01",
    image: "/images/categories/photography.jpg",
  },
  {
    title: "Film & Video",
    description:
      "Creative environments for filmmaking, commercials and video shoots.",
    icon: Clapperboard,
    slug: "film-video",
    number: "02",
    image: "/images/categories/film-video.jpg",
  },
  {
    title: "Podcast Studios",
    description:
      "Soundproof spaces for podcasts, interviews and content creation.",
    icon: Mic2,
    slug: "podcast",
    number: "03",
    image: "/images/categories/podcast.jpg",
  },
  {
    title: "Music Production",
    description:
      "Fully equipped studios for recording, mixing and music production.",
    icon: Music2,
    slug: "music",
    number: "04",
    image: "/images/categories/music.jpg",
  },
  {
    title: "Creative Spaces",
    description:
      "Unique environments for artistic projects and creative sessions.",
    icon: Palette,
    slug: "creative",
    number: "05",
    image: "/images/categories/creative.jpg",
  },
  {
    title: "Events & Workshops",
    description:
      "Flexible venues for workshops, creative events and gatherings.",
    icon: Users,
    slug: "events",
    number: "06",
    image: "/images/categories/events.jpg",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
              Explore Possibilities
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Explore by <span className="text-primary">Category.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
              Discover the perfect creative environment for your next
              photography, filmmaking, podcast or production project.
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

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                href={`/studios?category=${category.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Category Image */}
                <div className="relative h-52 overflow-hidden sm:h-56">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url("${category.image}")`,
                    }}
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10" />

                  {/* Category Number */}
                  <span className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-xs font-semibold tracking-widest text-white backdrop-blur-md">
                    {category.number}
                  </span>

                  {/* Image Bottom Label */}
                  <div className="absolute bottom-4 left-5 flex items-center gap-2 text-white">
                    <Icon size={19} />
                    <span className="text-sm font-semibold">
                      {category.title}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {category.title}
                  </h3>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-muted">
                    {category.description}
                  </p>

                  {/* Card Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm font-semibold text-muted transition-colors group-hover:text-primary">
                      Explore Category
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight size={17} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
