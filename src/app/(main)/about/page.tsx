import Link from "next/link";
import {
  Aperture,
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  Palette,
  ShieldCheck,
  Clock3,
  CreditCard,
  ArrowRight,
  Target,
  Heart,
  Users,
  Sparkles,
} from "lucide-react";

const services = [
  {
    icon: Camera,
    title: "Photography Studios",
    description:
      "Discover professional photography spaces with creative setups and perfect lighting.",
  },
  {
    icon: Clapperboard,
    title: "Film & Production",
    description:
      "Find production-ready spaces for filmmaking, video production, and creative shoots.",
  },
  {
    icon: Mic2,
    title: "Podcast Rooms",
    description:
      "Book comfortable podcast rooms equipped for recording and content creation.",
  },
  {
    icon: Music2,
    title: "Music Suites",
    description:
      "Explore dedicated spaces for music production, recording, and practice.",
  },
  {
    icon: Palette,
    title: "Creative Workshops",
    description:
      "Find inspiring environments for art, design, learning, and collaboration.",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure Booking",
    description:
      "A reliable booking experience designed to make reservations simple and secure.",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description:
      "View hourly rates and security deposits before making your reservation.",
  },
  {
    icon: Clock3,
    title: "Easy Scheduling",
    description:
      "Choose your preferred date and available time slot for your project.",
  },
  {
    icon: Heart,
    title: "Creative Community",
    description:
      "Connect studio owners and creators through one creative marketplace.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent)_0%,transparent_65%)] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 lg:py-32">
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-accent">
            <Aperture size={16} />
            About StudioSpace
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Creative Spaces,
            <span className="block text-accent">Endless Possibilities.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            We connect creators with inspiring spaces. From photography studios
            to podcast rooms, StudioSpace makes finding and booking the perfect
            creative workspace easier than ever.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/studios"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Explore Studios <ArrowRight size={18} />
            </Link>

            <Link
              href="/#how-it-works"
              className="rounded-xl border border-border px-7 py-3.5 font-semibold text-foreground transition hover:bg-secondary"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Our Story
          </p>

          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Making Creative Spaces
            <span className="text-accent"> Accessible to Everyone.</span>
          </h2>

          <p className="mt-6 leading-8 text-muted">
            Every creative project deserves the right environment. However,
            finding a suitable studio, comparing prices, and arranging bookings
            can be challenging.
          </p>

          <p className="mt-4 leading-8 text-muted">
            StudioSpace is designed to simplify that experience by bringing
            studio owners and creators together on one platform. Users can
            discover creative spaces, explore their facilities, compare pricing,
            and reserve a suitable time slot.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12">
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-secondary">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
                <Aperture size={52} />
              </div>

              <h3 className="mt-6 text-3xl font-extrabold text-card-foreground">
                Studio<span className="text-accent">Space</span>
              </h3>

              <p className="mt-2 text-sm text-muted">
                Where Creativity Finds Its Space
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Target size={25} />
            </div>

            <h3 className="text-2xl font-bold text-card-foreground">
              Our Mission
            </h3>

            <p className="mt-4 leading-8 text-muted">
              To make creative workspaces accessible by connecting studio owners
              with creators through a simple, transparent, and convenient
              booking platform.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Sparkles size={25} />
            </div>

            <h3 className="text-2xl font-bold text-card-foreground">
              Our Vision
            </h3>

            <p className="mt-4 leading-8 text-muted">
              To build a creative community where photographers, filmmakers,
              podcasters, musicians, and artists can find the right space to
              bring their ideas to life.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">
            What We Offer
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Spaces for Every Creative Idea
          </h2>

          <p className="mt-4 leading-7 text-muted">
            Explore different types of creative workspaces that support your
            next project.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="rounded-2xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-accent"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={25} />
                </div>

                <h3 className="text-xl font-bold text-card-foreground">
                  {service.title}
                </h3>

                <p className="mt-3 leading-7 text-muted">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">
              Why StudioSpace
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              A Better Way to Book Creative Spaces
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-card-foreground">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="rounded-3xl border border-border bg-secondary px-6 py-12 text-center sm:px-12 lg:py-16">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Users size={30} />
          </div>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Your Next Creative Project Starts Here.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-muted">
            Whether you own a studio or are looking for the perfect creative
            space, StudioSpace brings opportunities and creativity together.
          </p>

          <Link
            href="/studios"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Find Your Studio <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
