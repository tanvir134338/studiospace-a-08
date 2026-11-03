import Link from "next/link";
import {
  ShieldCheck,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Handshake,
  Lightbulb,
} from "lucide-react";

const hostBenefits = [
  "Manage your studio listings easily",
  "Control your availability and bookings",
  "Reach creators looking for studio spaces",
];

const creatorBenefits = [
  "Explore studios for different creative needs",
  "View transparent hourly rental prices",
  "Book available time slots with confidence",
];

export default function HostGuarantee() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
            Built for Hosts & Creators
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            A Better Experience for{" "}
            <span className="text-primary">Everyone.</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            Whether you host a studio or create something amazing, StudioSpace
            makes finding and managing creative spaces easier.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Host Card */}
          <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <ShieldCheck size={32} strokeWidth={1.7} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  For Studio Hosts
                </span>

                <h3 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                  Host with Confidence.
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  Manage your creative space, organize bookings and connect with
                  creators looking for the perfect studio.
                </p>
              </div>
            </div>

            <div className="my-7 h-px bg-border" />

            <ul className="space-y-4">
              {hostBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/add-studio"
              className="group/link mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
            >
              Become a Host
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover/link:translate-x-1"
              />
            </Link>
          </div>

          {/* Creator Card */}
          <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Headphones size={32} strokeWidth={1.7} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  For Creators
                </span>

                <h3 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                  Create Without Limits.
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  Discover inspiring spaces, find the right facilities and book
                  a studio that fits your creative vision.
                </p>
              </div>
            </div>

            <div className="my-7 h-px bg-border" />

            <ul className="space-y-4">
              {creatorBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/studios"
              className="group/link mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
            >
              Explore Studios
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover/link:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card/50 p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Handshake size={23} />
            </div>

            <div>
              <h4 className="font-bold text-foreground">
                Built Around Collaboration
              </h4>
              <p className="mt-1 text-sm leading-6 text-muted">
                Bringing studio hosts and creative professionals together.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Lightbulb size={23} />
            </div>

            <div>
              <h4 className="font-bold text-foreground">Your Ideas Matter</h4>
              <p className="mt-1 text-sm leading-6 text-muted">
                Find the right environment to turn creative ideas into reality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
