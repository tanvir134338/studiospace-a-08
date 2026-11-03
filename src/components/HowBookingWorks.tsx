import Link from "next/link";
import {
  ArrowRight,
  Search,
  CalendarDays,
  CalendarCheck,
  Clapperboard,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Explore a wide range of professional studios and find the perfect space for your creative project.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description:
      "Choose your preferred date and available time slot according to your project requirements.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Complete your booking in just a few clicks and get ready for your upcoming session.",
    icon: CalendarCheck,
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Step into your chosen space and bring your creative ideas to life.",
    icon: Clapperboard,
  },
];

export default function HowBookingWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-28 border-y border-border bg-card/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
            Simple Booking Process
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How Booking <span className="text-primary">Works.</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            Finding and booking your perfect creative space is easier than ever.
            Just follow these four simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 sm:p-7"
              >
                {/* Step Number */}
                <span className="absolute right-6 top-6 text-sm font-bold tracking-widest text-muted/50">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {step.description}
                </p>

                {/* Bottom Indicator */}
                <div className="mt-6 h-1 w-10 rounded-full bg-primary/30 transition-all duration-300 group-hover:w-16 group-hover:bg-primary" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center sm:mt-14">
          <Link
            href="/studios"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
          >
            Find Your Studio
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
