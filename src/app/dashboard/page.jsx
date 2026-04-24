"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

/* ─── Sidebar Nav Items ─── */
const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "team", label: "Team Details", icon: "group" },
  { id: "shop", label: "Shop", icon: "storefront" },
];

/* ─── Dashboard Overview Section ─── */
function DashboardSection({ team }) {
  return (
    <>
      {/* Welcome Header */}
      <div className="mb-10">
        <p className="text-[#004491] text-xs uppercase tracking-[0.3em] font-bold mb-3">Overview</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
          Welcome, {team.leaderName}
        </h1>
        <p className="text-zinc-500 text-sm">
          Here&apos;s a quick snapshot of your team&apos;s status.
        </p>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card: Team Info */}
        <div className="relative bg-[#080808] border border-outline-variant p-6 group hover:border-[#004491]/50 transition-colors duration-300">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#004491]" />
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#004491] text-xl">badge</span>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest">Team Leader</h3>
          </div>
          <p className="text-zinc-300 text-lg font-semibold">{team.leaderName}</p>
          <p className="text-zinc-500 text-xs mt-1">{team.leaderEmail}</p>
        </div>

        {/* Card: Registration Status */}
        <div className="relative bg-[#080808] border border-outline-variant p-6 group hover:border-[#004491]/50 transition-colors duration-300">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500" />
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-emerald-500 text-xl">verified</span>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest">Status</h3>
          </div>
          <p className="text-emerald-400 text-lg font-semibold">Registered</p>
          <p className="text-zinc-500 text-xs mt-1">Since {new Date(team.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Card: Event */}
        <div className="relative bg-[#080808] border border-outline-variant p-6 group hover:border-[#004491]/50 transition-colors duration-300">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00d2ff]" />
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#00d2ff] text-xl">emoji_events</span>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest">Event</h3>
          </div>
          <p className="text-zinc-300 text-lg font-semibold">UOK Robot Games 2K26</p>
          <p className="text-zinc-500 text-xs mt-1">University of Kelaniya</p>
        </div>
      </div>
    </>
  );
}

/* ─── Phase definitions ─── */
const phases = [
  {
    id: 1,
    title: "Event Details",
    icon: "calendar_month",
    status: "unlocked",         // "unlocked" | "locked"
    accent: "#004491",
  },
  {
    id: 2,
    title: "Members Details",
    icon: "groups",
    status: "unlocked",
    accent: "#00d2ff",
  },
  {
    id: 3,
    title: "Payment Slip",
    icon: "receipt_long",
    status: "unlocked",
    accent: "#10b981",          // emerald
  },
  {
    id: 4,
    title: "Phase 4",
    icon: "lock",
    status: "locked",
    accent: "#27272a",          // zinc-800
  },
  {
    id: 5,
    title: "Phase 5",
    icon: "lock",
    status: "locked",
    accent: "#27272a",
  },
];

/* ─── Single Phase Step Node ─── */
function PhaseNode({ phase, isLast }) {
  const unlocked = phase.status === "unlocked";
  return (
    <div className="flex gap-4 sm:gap-6">
      {/* Step Indicator Column */}
      <div className="flex flex-col items-center">
        {/* Circle */}
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
            unlocked
              ? "border-[var(--accent)] bg-[var(--accent)]/10"
              : "border-zinc-800 bg-zinc-900/50"
          }`}
          style={{ "--accent": phase.accent }}
        >
          <span
            className={`material-symbols-outlined text-lg sm:text-xl ${
              unlocked ? "" : "text-zinc-700"
            }`}
            style={unlocked ? { color: phase.accent } : undefined}
          >
            {phase.icon}
          </span>
        </div>
        {/* Connector line */}
        {!isLast && (
          <div className={`w-[2px] flex-1 min-h-[24px] ${unlocked ? "bg-zinc-700/60" : "bg-zinc-800/40"}`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        {/* Phase Header */}
        <div className="flex items-center gap-3 mb-1 mt-2 sm:mt-2.5">
          <span className={`text-[10px] uppercase tracking-widest font-bold ${unlocked ? "text-zinc-500" : "text-zinc-700"}`}>
            Phase {phase.id}
          </span>
          {unlocked ? (
            <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Unlocked
            </span>
          ) : (
            <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-zinc-800/50 text-zinc-600 border border-zinc-800">
              Locked
            </span>
          )}
        </div>
        <h3 className={`text-sm sm:text-base font-black uppercase tracking-widest mb-3 ${unlocked ? "text-white" : "text-zinc-700"}`}>
          {phase.title}
        </h3>

        {/* Phase Body — only visible for unlocked */}
        {unlocked && phase.content}

        {/* Locked overlay */}
        {!unlocked && (
          <div className="relative bg-[#080808] border border-zinc-800/60 p-6 sm:p-8 overflow-hidden">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <span className="material-symbols-outlined text-zinc-800 text-4xl mb-3">lock</span>
              <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">Coming Soon</p>
              <p className="text-zinc-700 text-[10px] mt-1">This phase will be available soon.</p>
            </div>
            {/* Scan-line decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 3px)" }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Team Details Section ─── */
function TeamDetailsSection({ team }) {

  /* Build phase content dynamically so we can access `team` */
  const phasesWithContent = phases.map((phase) => {
    if (phase.id === 1) {
      return {
        ...phase,
        content: (
          <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: phase.accent }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Event</p>
                <p className="text-zinc-200 text-sm font-semibold">UOK Robot Games 2K26</p>
              </div>
              <div>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Team Name</p>
                <p className="text-zinc-200 text-sm font-semibold">{team.teamName}</p>
              </div>
              <div>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Leader</p>
                <p className="text-zinc-200 text-sm font-semibold">{team.leaderName}</p>
              </div>
              <div>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Registered On</p>
                <p className="text-zinc-200 text-sm font-semibold">
                  {new Date(team.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Contact Email</p>
                <p className="text-zinc-200 text-sm font-semibold">{team.leaderEmail}</p>
              </div>
              <div>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Venue</p>
                <p className="text-zinc-200 text-sm font-semibold">University of Kelaniya</p>
              </div>
            </div>
          </div>
        ),
      };
    }

    if (phase.id === 2) {
      return {
        ...phase,
        content: (
          <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: phase.accent }} />
            <div className="flex flex-col items-center justify-center text-center py-8">
              <span className="material-symbols-outlined text-zinc-700 text-5xl mb-4">person_add</span>
              <p className="text-zinc-400 text-sm font-semibold mb-1">No Members Added Yet</p>
              <p className="text-zinc-600 text-xs max-w-sm leading-relaxed">
                You&apos;ll be able to add your team members, assign roles, and manage your full roster here.
              </p>
            </div>
          </div>
        ),
      };
    }

    if (phase.id === 3) {
      return {
        ...phase,
        content: (
          <div className="relative bg-[#080808] border border-outline-variant p-5 sm:p-7">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: phase.accent }} />
            <div className="flex flex-col items-center justify-center text-center py-8">
              <span className="material-symbols-outlined text-zinc-700 text-5xl mb-4">cloud_upload</span>
              <p className="text-zinc-400 text-sm font-semibold mb-1">No Payment Submitted</p>
              <p className="text-zinc-600 text-xs max-w-sm leading-relaxed">
                Upload your payment slip and reference number here once payment is completed. This will be verified by the organizing committee.
              </p>
            </div>
          </div>
        ),
      };
    }

    return phase; // locked phases — no content needed
  });

  return (
    <>
      {/* Section Header */}
      <div className="mb-10">
        <p className="text-[#004491] text-xs uppercase tracking-[0.3em] font-bold mb-3">Team Details</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
          {team.teamName}
        </h1>
        <p className="text-zinc-500 text-sm">
          Complete each phase to finalize your registration.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">Progress</span>
          <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
            {phases.filter((p) => p.status === "unlocked").length} / {phases.length} Phases
          </span>
        </div>
        <div className="w-full h-[3px] bg-zinc-800/60 overflow-hidden">
          <div
            className="h-full bg-[#004491] transition-all duration-500"
            style={{ width: `${(phases.filter((p) => p.status === "unlocked").length / phases.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Phases Timeline */}
      <div className="relative">
        {phasesWithContent.map((phase, idx) => (
          <PhaseNode
            key={phase.id}
            phase={phase}
            isLast={idx === phasesWithContent.length - 1}
          />
        ))}
      </div>
    </>
  );
}

/* ─── Shop Products Data ─── */
const shopProducts = [
  {
    id: 1,
    name: "Official Event T-Shirt",
    description: "Premium cotton tee with UOK Robot Games 2K26 branding. Available in S, M, L, XL.",
    price: 1500,
    currency: "LKR",
    icon: "checkroom",
    accent: "#004491",
    badge: "Popular",
    badgeColor: "#004491",
    inStock: true,
  },
  {
    id: 2,
    name: "Cyber Wristband",
    description: "Glow-in-the-dark silicone wristband with the official arena logo.",
    price: 350,
    currency: "LKR",
    icon: "watch",
    accent: "#00d2ff",
    badge: "New",
    badgeColor: "#00d2ff",
    inStock: true,
  },
  {
    id: 3,
    name: "Sticker Pack",
    description: "Set of 6 premium holographic stickers featuring robot battle art.",
    price: 250,
    currency: "LKR",
    icon: "auto_awesome",
    accent: "#a855f7",
    badge: null,
    badgeColor: null,
    inStock: true,
  },
  {
    id: 4,
    name: "Event Lanyard + ID",
    description: "Custom lanyard with your team name printed. Includes event ID badge.",
    price: 500,
    currency: "LKR",
    icon: "badge",
    accent: "#10b981",
    badge: "Essential",
    badgeColor: "#10b981",
    inStock: true,
  },
  {
    id: 5,
    name: "Arena Cap",
    description: "Adjustable snapback cap with embroidered arena crest.",
    price: 1200,
    currency: "LKR",
    icon: "sports_esports",
    accent: "#f59e0b",
    badge: null,
    badgeColor: null,
    inStock: true,
  },
  {
    id: 6,
    name: "Hoodie — Limited Edition",
    description: "Premium heavyweight hoodie. Exclusive 2K26 design, limited run of 50.",
    price: 3500,
    currency: "LKR",
    icon: "dry_cleaning",
    accent: "#ef4444",
    badge: "Limited",
    badgeColor: "#ef4444",
    inStock: false,
  },
];

/* ─── Shop Section ─── */
function ShopSection() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {/* Section Header */}
      <div className="mb-10">
        <p className="text-[#004491] text-xs uppercase tracking-[0.3em] font-bold mb-3">Merchandise</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
          Shop
        </h1>
        <p className="text-zinc-500 text-sm">
          Grab official UOK Robot Games merch. Wear the arena.
        </p>
      </div>

      {/* Cart Summary (if items added) */}
      {totalItems > 0 && (
        <div className="mb-8 relative bg-[#080808] border border-outline-variant p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#004491]" />
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#004491] text-xl">shopping_cart</span>
            <div>
              <p className="text-white text-sm font-bold">{totalItems} item{totalItems !== 1 ? "s" : ""} in cart</p>
              <p className="text-zinc-500 text-xs">Total: <span className="text-zinc-200 font-semibold">LKR {totalPrice.toLocaleString()}</span></p>
            </div>
          </div>
          <button className="bg-[#004491] text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_15px_rgba(0,68,145,0.4)] transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center">
            <span className="material-symbols-outlined text-sm">lock</span>
            Checkout Coming Soon
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shopProducts.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);
          return (
            <div
              key={product.id}
              className={`relative bg-[#080808] border border-outline-variant group hover:border-zinc-700 transition-all duration-300 flex flex-col ${
                !product.inStock ? "opacity-60" : ""
              }`}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: product.accent }} />

              {/* Product Icon Area */}
              <div className="relative h-40 sm:h-44 bg-[#050505] flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${product.accent}, transparent 70%)`,
                  }}
                />
                <span
                  className="material-symbols-outlined text-6xl transition-transform duration-300 group-hover:scale-110"
                  style={{ color: product.accent }}
                >
                  {product.icon}
                </span>

                {/* Badge */}
                {product.badge && (
                  <span
                    className="absolute top-3 right-3 text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 border"
                    style={{
                      color: product.badgeColor,
                      borderColor: `${product.badgeColor}33`,
                      backgroundColor: `${product.badgeColor}15`,
                    }}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Out of Stock overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 border border-zinc-700 px-3 py-1 bg-black/80">Sold Out</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-white font-bold text-sm mb-1.5 uppercase tracking-wider">{product.name}</h3>
                <p className="text-zinc-600 text-xs leading-relaxed mb-4 flex-1">{product.description}</p>

                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-zinc-600 text-[10px] uppercase tracking-widest">Price</p>
                    <p className="text-white text-lg font-black">
                      {product.currency} {product.price.toLocaleString()}
                    </p>
                  </div>

                  {product.inStock ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all duration-200 hover:shadow-[0_0_12px_rgba(0,68,145,0.3)]"
                      style={{
                        color: product.accent,
                        borderColor: `${product.accent}50`,
                      }}
                    >
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      {cartItem ? `Added (${cartItem.qty})` : "Add"}
                    </button>
                  ) : (
                    <span className="text-zinc-700 text-[10px] uppercase tracking-widest font-bold">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─── Main Dashboard Page ─── */
export default function DashboardPage() {
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.authenticated) {
          setTeam(data.team);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#004491]/30 border-t-[#004491] rounded-full animate-spin" />
          <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!team) return null;

  /* Render the active section */
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection team={team} />;
      case "team":
        return <TeamDetailsSection team={team} />;
      case "shop":
        return <ShopSection />;
      default:
        return <DashboardSection team={team} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] font-space-grotesk">

      {/* ─── Top Bar ─── */}
      <nav className="fixed top-0 w-full z-50 bg-black border-b border-outline-variant flex justify-between items-center px-4 sm:px-6 md:px-8 h-16">
        {/* Left: Logo + Mobile sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-zinc-400 hover:text-white p-1 focus:outline-none"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileSidebarOpen ? "close" : "menu"}
            </span>
          </button>
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
        </div>

        {/* Right: Team name + Sign out */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
            <span className="material-symbols-outlined text-[#004491] text-lg">group</span>
            <span className="uppercase tracking-wider font-bold text-zinc-300">{team.teamName}</span>
          </div>
          <div className="w-[1px] h-6 bg-outline-variant hidden sm:block" />
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-zinc-500 hover:text-red-400 text-xs uppercase tracking-[0.15em] font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="hidden sm:inline">{loggingOut ? "..." : "Sign Out"}</span>
          </button>
        </div>
      </nav>

      {/* ─── Layout: Sidebar + Content ─── */}
      <div className="flex pt-16 min-h-screen">

        {/* ─── Desktop Sidebar ─── */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 fixed top-16 bottom-0 bg-[#050505] border-r border-outline-variant z-40">
          
          {/* Nav Items */}
          <nav className="flex-1 py-6 px-3 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-200 group ${
                    isActive
                      ? "bg-[#004491]/15 text-white border-l-2 border-[#004491]"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03] border-l-2 border-transparent"
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg transition-colors ${isActive ? "text-[#004491]" : "text-zinc-600 group-hover:text-zinc-400"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-4 py-5 border-t border-outline-variant">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 text-[10px] uppercase tracking-widest font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Return to Arena
            </Link>
          </div>
        </aside>

        {/* ─── Mobile Sidebar Overlay ─── */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex" onClick={() => setMobileSidebarOpen(false)}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Sidebar Panel */}
            <aside
              className="relative w-64 bg-[#050505] border-r border-outline-variant flex flex-col h-full pt-16"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex-1 py-6 px-3 space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-200 group ${
                        isActive
                          ? "bg-[#004491]/15 text-white border-l-2 border-[#004491]"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03] border-l-2 border-transparent"
                      }`}
                    >
                      <span className={`material-symbols-outlined text-lg transition-colors ${isActive ? "text-[#004491]" : "text-zinc-600 group-hover:text-zinc-400"}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="px-4 py-5 border-t border-outline-variant">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 text-[10px] uppercase tracking-widest font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Return to Arena
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* ─── Main Content ─── */}
        <main className="flex-1 md:ml-56 lg:ml-64 p-6 sm:p-8 lg:p-10">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
