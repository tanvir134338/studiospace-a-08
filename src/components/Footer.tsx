import Link from "next/link";
import { Aperture, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { FaFacebookF, FaLinkedin, FaTwitter } from "react-icons/fa";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

const categories = [
  { name: "Photography Studios", slug: "photography" },
  { name: "Film & Video", slug: "film-video" },
  { name: "Podcast Studios", slug: "podcast" },
  { name: "Music Production", slug: "music" },
  { name: "Creative Spaces", slug: "creative" },
  { name: "Events & Workshops", slug: "events" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: FaFacebookF,
  },
  {
    name: "Twitter",
    href: "https://www.twitter.com/",
    icon: FaTwitter,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: FaLinkedin,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-[1440px] px-4 pt-14 sm:px-6 sm:pt-16 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="StudioSpace Home"
              className="group mb-5 inline-flex items-center gap-2.5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-12">
                <Aperture size={25} strokeWidth={1.8} />
              </div>

              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-foreground">Studio</span>
                <span className="text-accent">Space</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-muted">
              Discover, book and create. StudioSpace connects creative
              professionals with inspiring studio spaces for every project.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit StudioSpace on ${social.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer quick links">
            <h3 className="mb-5 text-base font-bold text-foreground">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
                  >
                    {link.name}

                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label="Studio categories">
            <h3 className="mb-5 text-base font-bold text-foreground">
              Explore Categories
            </h3>

            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/studios?category=${category.slug}`}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-base font-bold text-foreground">
              Get in Touch
            </h3>

            <p className="mb-5 text-sm leading-7 text-muted">
              Have questions or need help? We would love to hear from you.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-muted">
                <Mail
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span>sample@example.com</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-muted">
                <MapPin
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span>Bangladesh</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-muted">
                <Phone
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span>+880 1234 567890</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter / Discover CTA */}
        <div className="mt-12 rounded-2xl border border-border bg-background p-6 sm:mt-16 sm:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Stay in the Creative Loop.
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Get updates about new studios, creative spaces and platform
                news.
              </p>
            </div>

            <Link
              href="/studios"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Discover Studios
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted sm:text-sm">
            © 2026 StudioSpace. All rights reserved.
          </p>

          <p className="text-xs text-muted sm:text-sm">
            Made for creators, by creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
