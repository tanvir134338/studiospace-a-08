"use client";

import dynamic from "next/dynamic";

const HeroSliderClient = dynamic(() => import("./HeroSliderClient"), {
  ssr: false,
  loading: () => (
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
  ),
});

export default function HeroSlider() {
  return <HeroSliderClient />;
}
