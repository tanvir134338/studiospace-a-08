"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Hydration-safe mounted detection
const subscribe = () => () => {};

const getSnapshot = () => true;

const getServerSnapshot = () => false;

const slides = [
  {
    id: 1,
    eyebrow: "YOUR CREATIVE SPACE",
    title: "Create Without Limits.",
    description:
      "Discover inspiring photography studios, production spaces and creative environments designed to bring your ideas to life.",
    image: "/images/hero/hero-01.jpg",
    label: "Spaces for every vision",
  },
  {
    id: 2,
    eyebrow: "MAKE EVERY FRAME COUNT",
    title: "Where Creativity Comes Alive.",
    description:
      "Find beautiful photography and film studios equipped with everything you need to create extraordinary work.",
    image: "/images/hero/hero-02.jpg",
    label: "Professional production spaces",
  },
  {
    id: 3,
    eyebrow: "YOUR NEXT BIG IDEA STARTS HERE",
    title: "A Space to Make It Happen.",
    description:
      "From podcast sessions to music production, explore unique spaces that inspire your next creative project.",
    image: "/images/hero/hero-03.jpg",
    label: "Built for creators",
  },
];

export default function HeroSliderClient() {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Render a static placeholder during server rendering
  if (!mounted) {
    return (
      <section className="px-3 pt-5 sm:px-5 sm:pt-7 lg:px-8 lg:pt-8">
        <div className="mx-auto flex min-h-[540px] max-w-[1440px] items-center overflow-hidden rounded-2xl bg-[#241820] px-6 sm:min-h-[580px] sm:px-12 lg:min-h-[640px] lg:rounded-3xl lg:px-20">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold tracking-widest text-[#D08A96]">
              YOUR CREATIVE SPACE
            </p>

            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl">
              Create Without Limits.
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Discover inspiring photography studios, production spaces and
              creative environments designed to bring your ideas to life.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-3 pt-5 sm:px-5 sm:pt-7 lg:px-8 lg:pt-8">
      <div className="relative mx-auto max-w-[1440px]">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          slidesPerView={1}
          loop
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: ".hero-prev",
            nextEl: ".hero-next",
          }}
          pagination={{
            clickable: true,
            el: ".hero-pagination",
          }}
          className="group overflow-hidden rounded-2xl sm:rounded-3xl"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative flex min-h-[540px] items-center overflow-hidden bg-[#241820] sm:min-h-[580px] lg:min-h-[640px]">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ease-linear group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${slide.image}")`,
                  }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#171116]/95 via-[#171116]/75 to-[#171116]/20" />

                {/* Content */}
                <div className="relative z-10 w-full px-6 py-16 sm:px-12 lg:px-20 lg:py-24">
                  <div className="max-w-3xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white backdrop-blur-md sm:text-sm">
                      <Sparkles size={15} className="text-[#D08A96]" />
                      {slide.eyebrow}
                    </div>

                    <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
                      {slide.title}
                    </h1>

                    <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8 lg:text-lg">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/studios"
                        className="group/btn inline-flex items-center justify-center gap-2 rounded-xl bg-[#B76E79] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#C7838D] hover:shadow-xl"
                      >
                        Explore Studios
                        <ArrowRight
                          size={18}
                          className="transition-transform group-hover/btn:translate-x-1"
                        />
                      </Link>

                      <Link
                        href="/register"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                      >
                        Host Your Space
                        <ArrowUpRight size={18} />
                      </Link>
                    </div>

                    {/* Slide Label */}
                    <div className="mt-12 flex items-center gap-3 text-sm text-white/60">
                      <span className="h-px w-10 bg-[#D08A96]" />
                      {slide.label}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Controls */}
        <div className="absolute bottom-6 right-5 z-20 flex items-center gap-3 sm:bottom-8 sm:right-8">
          <button
            type="button"
            aria-label="Previous slide"
            className="hero-prev flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#B76E79] sm:h-12 sm:w-12"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            className="hero-next flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#B76E79] sm:h-12 sm:w-12"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Pagination */}
        <div className="hero-pagination absolute bottom-10 left-6 z-20 flex items-center gap-2 sm:left-12 lg:left-20" />
      </div>

      {/* Pagination Styling */}
      <style jsx global>{`
        .hero-pagination .swiper-pagination-bullet {
          width: 9px;
          height: 9px;
          background: white;
          opacity: 0.55;
          transition: all 0.3s ease;
        }

        .hero-pagination .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 20px;
          background: #d08a96;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
