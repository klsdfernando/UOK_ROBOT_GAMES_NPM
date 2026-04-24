"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Arena" },
  { href: "/prizes", label: "Prizes" },
  { href: "/rules", label: "Rules" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setIsLoggedIn(data.authenticated === true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [pathname]); // Re-check on route change

  return (
    <>
      {/* Desktop & Mobile Top Bar */}
      <nav className="fixed top-0 w-full z-50 bg-black border-b border-blue-900/50 flex justify-between items-center px-8 h-16 max-w-full">
        <Link href="/" className="h-8 md:h-10 shrink-0">
          <Image
            src="/images/logo.png"
            alt="UOK Robot Games Logo"
            width={160}
            height={40}
            className="h-full w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8 font-bold uppercase tracking-tighter text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "text-blue-500 border-b border-blue-500 pb-1 hover:bg-zinc-900/50 transition-colors duration-200 bg-blue-950/20"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900/50 transition-colors duration-200"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!checkingAuth && (
            isLoggedIn ? (
              <Link
                href="/dashboard"
                className="bg-[#004491] text-white px-6 py-2 text-sm font-bold tracking-wider hover:bg-[#002d5e] transition-colors border border-[#004491] uppercase text-center flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                DASHBOARD
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-zinc-300 hover:text-white text-sm font-bold tracking-wider transition-colors uppercase">
                  LOGIN
                </Link>
                <Link href="/register" className="bg-[#004491] text-white px-6 py-2 text-sm font-bold tracking-wider hover:bg-[#002d5e] transition-colors border border-[#004491] uppercase text-center">
                  REGISTER
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2 focus:outline-none z-[60]"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/95 z-[55] flex flex-col items-center justify-center space-y-8 font-bold uppercase tracking-tighter text-xl">
          <button
            className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 focus:outline-none"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-zinc-400 hover:text-white transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col items-center gap-4 pt-8 border-t border-zinc-800 w-1/2">
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="bg-[#004491] text-white px-6 py-3 w-full hover:bg-[#002d5e] transition-colors border border-[#004491] uppercase text-center flex items-center justify-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                DASHBOARD
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-zinc-300 hover:text-white transition-colors uppercase w-full py-2 text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  LOGIN
                </Link>
                <Link 
                  href="/register" 
                  className="bg-[#004491] text-white px-6 py-3 w-full hover:bg-[#002d5e] transition-colors border border-[#004491] uppercase text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  REGISTER
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
