"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const quickLinks = [
  { href: "/", label: "About Competition" },
  { href: "/#timeline", label: "Event Timeline" },
  { href: "/prizes", label: "Prizes" },
  { href: "/rules", label: "Rules & Regulations" },
  { href: "/gallery", label: "Gallery" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 3000);
      }
    } catch (err) {
      console.error("Subscribe error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#080808] border-t border-outline-variant mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Logo & Description */}
          <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Link href="/" className="shrink-0">
                <Image
                  src="https://ik.imagekit.io/wfnazmyxh/images/logo.png?updatedAt=1777697840160"
                  alt="UOK Robot Games Logo"
                  width={140}
                  height={50}
                  className="h-11 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
              <div className="w-[1px] h-8 bg-outline-variant" />
              <Image
                src="https://ik.imagekit.io/wfnazmyxh/images/UniLogo.svg?updatedAt=1777697834303"
                alt="University of Kelaniya Logo"
                width={100}
                height={50}
                className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
              <div className="w-[1px] h-8 bg-outline-variant" />
              <Image
                src="https://ik.imagekit.io/wfnazmyxh/images/club_logo.png?updatedAt=1777698175245"
                alt="ECSC Club Logo"
                width={100}
                height={50}
                className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              The ultimate inter-university robotics competition. Build your
              machine, enter the arena, and emerge victorious in the battle
              for glory.
            </p>
            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2 w-full">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-[#00d2ff] hover:border-[#00d2ff]/50 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-[#00d2ff] hover:border-[#00d2ff]/50 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-[#00d2ff] hover:border-[#00d2ff]/50 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left mt-8 md:mt-0">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4 w-full">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-on-surface-variant hover:text-[#00d2ff] transition-colors duration-300 text-sm flex items-center justify-center md:justify-start gap-2 group"
                  >
                    <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-[#00d2ff] transition-colors">
                      chevron_right
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left mt-8 md:mt-0">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">
              Contact Info
            </h3>
            <ul className="space-y-5 w-full">
              <li>
                <a
                  href="mailto:contact@ecsc-uok.com"
                  className="text-on-surface-variant hover:text-[#00d2ff] transition-colors duration-300 text-sm flex items-center justify-center md:justify-start gap-3"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#0066ff]">
                    mail
                  </span>
                  contact@ecsc-uok.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+94763074621"
                  className="text-on-surface-variant hover:text-[#00d2ff] transition-colors duration-300 text-sm flex items-center justify-center md:justify-start gap-3"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#0066ff]">
                    call
                  </span>
                  +94 76 30 74 621
                </a>
              </li>
              <li className="text-on-surface-variant text-sm flex items-center justify-center md:justify-start gap-3">
                <span className="material-symbols-outlined text-[18px] text-[#0066ff]">
                  location_on
                </span>
                University of Kelaniya
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Updated */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left mt-8 md:mt-0">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">
              Stay Updated
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Get the latest updates about UOK Robot Games 2K26 and future
              robotics events.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3 w-full max-w-xs md:max-w-full">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b0c16] border border-outline-variant text-on-surface-variant text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-outline"
                required
              />
              <button
                type="submit"
                className="w-full py-3 font-bold text-sm uppercase tracking-widest transition-all duration-300 bg-[#004491] text-white hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.4)]"
              >
                {subscribed ? "✓ Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-center items-center">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest text-center">
            © 2026 UOK Robot Games. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
