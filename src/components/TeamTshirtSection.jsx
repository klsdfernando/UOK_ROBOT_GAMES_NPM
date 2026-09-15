"use client";

import { useState, useEffect } from "react";
import TshirtCountdownBanner from "@/components/TshirtCountdownBanner";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const TABLE_SIZE_ROWS = [
  { id: "XS", label: "XS" },
  { id: "S", label: "S" },
  { id: "M", label: "M" },
  { id: "L", label: "L" },
  { id: "XL", label: "XL" },
  { id: "2XL", label: "2XL" },
  { id: "3XL", label: "3XL" },
];

const SIZE_MEASUREMENTS = {
  XS: 'Chest 36" · L 26"',
  S: 'Chest 38" · L 27"',
  M: 'Chest 40" · L 28"',
  L: 'Chest 42" · L 29"',
  XL: 'Chest 44" · L 30"',
  "2XL": 'Chest 46" · L 31"',
  "3XL": 'Chest 48" · L 32"',
};

const PRICE_PER_SHIRT = 1900; // LKR

export default function TeamTshirtSection({ team }) {
  // Extract team members from Phase 2 data
  const phase2Members = team.phases?.["2"]?.data?.members || [];
  const teamMemberCount = Math.max(1, phase2Members.length || team.phases?.["2"]?.data?.memberCount || 1);
  const MAX_EXTRAS = 3;
  const maxAllowedShirts = teamMemberCount + MAX_EXTRAS;

  // Build initial roster
  const [roster, setRoster] = useState(() => {
    if (phase2Members.length > 0) {
      return phase2Members.map((m, idx) => ({
        id: `member-${idx}`,
        name: m.fullName?.trim() || (idx === 0 ? team.leaderName || "Leader" : `Member ${idx + 1}`),
        contact: m.contactNumber || "",
        role: idx === 0 ? "Leader" : "Member",
        isExtra: false,
        selected: true,
      }));
    }
    // Fallback if phase 2 not completed yet
    return [
      {
        id: "member-0",
        name: team.leaderName || "Team Leader",
        contact: "",
        role: "Leader",
        isExtra: false,
        selected: true,
      },
    ];
  });

  // Extra non-roster members (mentor, extra students)
  const [extraStudentName, setExtraStudentName] = useState("");
  const [showAddExtra, setShowAddExtra] = useState(false);

  // Selected students who will receive shirts
  const selectedStudents = roster.filter((m) => m.selected);

  // Contact info
  const [contactName, setContactName] = useState(team.leaderName || "");
  const [whatsappNumber, setWhatsappNumber] = useState(
    phase2Members[0]?.contactNumber || ""
  );

  // Shirts configuration mapped to selected students
  // Keyed by student.id -> { category, size }
  const [shirtPreferences, setShirtPreferences] = useState({});

  const shirts = selectedStudents.map((student) => {
    const pref = shirtPreferences[student.id];
    return {
      memberId: student.id,
      memberName: student.name,
      memberRole: student.role,
      category: pref?.category || "Normal Size",
      size: pref?.size || "",
    };
  });

  // Mobile active tab: "all" or index string "0", "1"...
  const [activeMobileTab, setActiveMobileTab] = useState("0");

  // Payment & Slip state
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Past team orders & view mode
  const [pastOrders, setPastOrders] = useState([]);
  const [loadingPastOrders, setLoadingPastOrders] = useState(() => Boolean(team?.id));
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [showPreviousOrdersList, setShowPreviousOrdersList] = useState(false);

  // Refresh past orders after order placement
  const refreshPastOrders = async () => {
    if (!team?.id) return;
    try {
      const res = await fetch(`/api/tshirt?teamId=${encodeURIComponent(team.id)}`);
      const data = await res.json();
      if (data.success && data.orders) {
        setPastOrders(data.orders);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    let active = true;
    if (!team?.id) {
      return;
    }
    async function loadOrders() {
      try {
        const res = await fetch(`/api/tshirt?teamId=${encodeURIComponent(team.id)}`);
        const data = await res.json();
        if (active && data.success && data.orders) {
          setPastOrders(data.orders);
        }
      } catch (err) {
        console.warn("Failed to load past orders:", err);
      } finally {
        if (active) {
          setLoadingPastOrders(false);
        }
      }
    }
    loadOrders();
    return () => {
      active = false;
    };
  }, [team?.id]);

  // Helper for measurements
  const getSizeMeasurement = (category, size) => {
    if (!size) return "";
    return SIZE_MEASUREMENTS[size] || "";
  };

  // Combine orderResult and pastOrders into unified order list
  const allOrders = (() => {
    const list = [...pastOrders];
    if (orderResult?.order) {
      const oid = orderResult.order.orderId || orderResult.order.id;
      const idx = list.findIndex((o) => (o.orderId || o.id) === oid);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...orderResult.order };
      } else {
        list.unshift(orderResult.order);
      }
    }
    return list;
  })();

  const hasExistingOrders = allOrders.length > 0;
  const primaryOrder = allOrders[0] || null;
  const totalShirtsOrdered = allOrders.reduce(
    (sum, o) => sum + (o.shirtCount || (o.shirts?.length || 0)),
    0
  );
  const remainingAllowance = Math.max(0, maxAllowedShirts - totalShirtsOrdered);

  const primaryShirts = primaryOrder?.shirts || [];
  const primaryTotalPaid = (primaryOrder?.shirtCount || primaryShirts.length) * PRICE_PER_SHIRT;
  const previousOrders = allOrders.slice(1);

  // Toggle member selection
  const toggleMemberSelection = (id) => {
    setError("");
    setRoster((prev) => {
      const currentSelectedCount = prev.filter((m) => m.selected).length;
      return prev.map((m) => {
        if (m.id === id) {
          if (!m.selected && currentSelectedCount >= maxAllowedShirts) {
            setError(
              `Maximum ${maxAllowedShirts} T-shirts allowed for your team (${teamMemberCount} members + up to ${MAX_EXTRAS} extras).`
            );
            return m;
          }
          return { ...m, selected: !m.selected };
        }
        return m;
      });
    });
  };

  // Select all / Deselect all
  const handleSelectAll = (select) => {
    setError("");
    if (select) {
      setRoster((prev) => {
        let count = 0;
        return prev.map((m) => {
          if (count < maxAllowedShirts) {
            count++;
            return { ...m, selected: true };
          }
          return { ...m, selected: false };
        });
      });
      if (roster.length > maxAllowedShirts) {
        setError(
          `Selected first ${maxAllowedShirts} shirts (team allowance: ${teamMemberCount} members + ${MAX_EXTRAS} extras = max ${maxAllowedShirts} shirts).`
        );
      }
    } else {
      setRoster((prev) => prev.map((m) => ({ ...m, selected: false })));
    }
  };

  // Add extra student/supporter
  const handleAddExtraStudent = () => {
    if (!extraStudentName.trim()) return;
    const currentExtras = roster.filter((m) => m.isExtra).length;
    if (currentExtras >= MAX_EXTRAS) {
      setError(`Your team can add a maximum of ${MAX_EXTRAS} extra shirts.`);
      return;
    }
    const currentSelected = roster.filter((m) => m.selected).length;
    const canSelect = currentSelected < maxAllowedShirts;

    const newMember = {
      id: `extra-${Date.now()}`,
      name: extraStudentName.trim(),
      contact: "",
      role: "Extra / Supporter",
      isExtra: true,
      selected: canSelect,
    };

    setRoster((prev) => [...prev, newMember]);
    setExtraStudentName("");
    setShowAddExtra(false);
    if (!canSelect) {
      setError(
        `Added to roster. Your team already has ${maxAllowedShirts} shirts selected (${teamMemberCount} members + ${MAX_EXTRAS} extras).`
      );
    }
  };

  // Remove an added extra student
  const handleRemoveExtraStudent = (id) => {
    setRoster((prev) => prev.filter((m) => m.id !== id));
    setError("");
  };

  // Update category for a specific shirt
  const handleCategoryChange = (index, category) => {
    const shirt = shirts[index];
    if (!shirt) return;
    setShirtPreferences((prev) => ({
      ...prev,
      [shirt.memberId]: { ...(prev[shirt.memberId] || {}), category: "Adult Size" },
    }));
  };

  // Update size for a specific shirt
  const handleSizeSelect = (shirtIndex, sizeId) => {
    const shirt = shirts[shirtIndex];
    if (!shirt) return;

    setShirtPreferences((prev) => ({
      ...prev,
      [shirt.memberId]: { category: "Adult Size", size: sizeId },
    }));
    setError("");
  };

  // File select
  const handleFileSelect = (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, WebP, or PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }
    setPaymentSlip(file);
    setError("");
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText("055200290051008");
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (selectedStudents.length === 0) {
      setError("Please select at least one team member to buy a T-shirt.");
      return;
    }

    if (!contactName.trim()) {
      setError("Please enter the contact person's name.");
      return;
    }
    if (!whatsappNumber.trim()) {
      setError("Please enter a WhatsApp contact number.");
      return;
    }

    // Check all shirts have a size
    for (let i = 0; i < shirts.length; i++) {
      if (!shirts[i].size) {
        setError(`Please select a size for ${shirts[i].memberName || `Shirt #${i + 1}`}.`);
        return;
      }
    }

    if (!paymentSlip) {
      setError("Please upload your bank transfer or deposit slip.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", contactName.trim());
      formData.append("whatsappNumber", whatsappNumber.trim());
      formData.append("shirtCount", shirts.length.toString());
      formData.append("shirts", JSON.stringify(shirts));
      formData.append("teamId", team.id || "");
      formData.append("teamName", team.teamName || "");
      formData.append("referenceNumber", referenceNumber.trim());
      formData.append("paymentSlip", paymentSlip);

      const res = await fetch("/api/tshirt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setOrderResult(data);
        setJustSubmitted(true);
        setShowNewOrderForm(false);
        refreshPastOrders();
      } else {
        setError(data.message || "Failed to submit team order. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetFormState = () => {
    setPaymentSlip(null);
    setPreview(null);
    setReferenceNumber("");
    setError("");
    setActiveMobileTab("0");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── Top Live Countdown Banner ─── */}
      <TshirtCountdownBanner />

      {/* ─── Hero Header Banner ─── */}
      <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004491]/20 border border-[#004491]/40 text-[#5b9aff] text-xs font-semibold mb-3">
              <span className="material-symbols-outlined text-sm">apparel</span>
              <span>Team T-Shirt Orders</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Official T-Shirts for <span className="text-[#00d2ff]">{team.teamName}</span>
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Equip your members and mentors with official UOK Robot Games 2K26 arena jerseys. Select who wants a shirt, choose sizes from XS to 3XL, and upload your payment slip in one unified team order.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#12131f] text-zinc-300 border border-zinc-800">
                Team: <strong className="text-white font-medium ml-1">{team.teamName}</strong>
              </span>

              {hasExistingOrders && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Order Confirmed ({totalShirtsOrdered} {totalShirtsOrdered === 1 ? "Shirt" : "Shirts"})
                </span>
              )}

              {hasExistingOrders && !showNewOrderForm && (
                <button
                  type="button"
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 bg-[#12131f] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">straighten</span>
                  <span>{showSizeChart ? "Hide Size Chart" : "View Size Chart"}</span>
                </button>
              )}

              {hasExistingOrders && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#12131f] text-zinc-400 border border-zinc-800">
                  <span className="material-symbols-outlined text-xs text-[#00d2ff]">lock</span>
                  <span>Locked</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Price Card */}
          <div className="bg-[#12131f] border border-zinc-800/90 p-4 sm:p-5 rounded-xl text-center shrink-0 w-full sm:w-auto">
            <span className="text-xs text-zinc-400 font-medium block mb-1">
              {hasExistingOrders ? "Team Order Total" : `Allowance: Up to ${maxAllowedShirts} Shirts`}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
              {hasExistingOrders
                ? `LKR ${((primaryOrder?.shirtCount || totalShirtsOrdered) * PRICE_PER_SHIRT).toLocaleString()}`
                : `LKR ${PRICE_PER_SHIRT.toLocaleString()}`}
            </span>
            <span className="text-xs text-zinc-400 block mt-1">
              {hasExistingOrders
                ? `${totalShirtsOrdered} Shirts Ordered · ${remainingAllowance > 0 ? `${remainingAllowance} More Allowed` : "Max Reached"}`
                : `Per shirt · ${teamMemberCount} members + ${MAX_EXTRAS} extras`}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Size Chart Drawer / Modal (Only in receipt mode) ─── */}
      {hasExistingOrders && !showNewOrderForm && showSizeChart && (
        <div className="bg-[#0b0c16]/90 border border-zinc-800/80 p-4 sm:p-6 rounded-2xl animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00d2ff] text-xl">straighten</span>
              <h3 className="text-white text-sm font-bold">
                T-Shirt Size Measurements (Inches)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowSizeChart(false)}
              className="text-zinc-500 hover:text-white cursor-pointer p-1"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="max-w-md mx-auto">
            <div className="overflow-x-auto border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left text-zinc-300">
                <thead className="bg-[#12131f] text-zinc-400 text-xs font-semibold border-b border-zinc-800">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chest (in)</th>
                    <th className="py-2.5 px-3">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-[#080811]">
                  <tr><td className="py-2 px-3 font-bold text-white">XS</td><td className="py-2 px-3">36&quot;</td><td className="py-2 px-3">26&quot;</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-white">S</td><td className="py-2 px-3">38&quot;</td><td className="py-2 px-3">27&quot;</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-white">M</td><td className="py-2 px-3">40&quot;</td><td className="py-2 px-3">28&quot;</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-white">L</td><td className="py-2 px-3">42&quot;</td><td className="py-2 px-3">29&quot;</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-white">XL</td><td className="py-2 px-3">44&quot;</td><td className="py-2 px-3">30&quot;</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-white">2XL</td><td className="py-2 px-3">46&quot;</td><td className="py-2 px-3">31&quot;</td></tr>
                  <tr><td className="py-2 px-3 font-bold text-white">3XL</td><td className="py-2 px-3">48&quot;</td><td className="py-2 px-3">32&quot;</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Loading State ─── */}
      {loadingPastOrders ? (
        <div className="bg-[#080808] border border-outline-variant p-12 text-center rounded-xl animate-fadeIn">
          <div className="w-10 h-10 border-2 border-[#00d2ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-1">
            Loading Team Pre-Order Details...
          </h3>
          <p className="text-zinc-500 text-xs">
            Retrieving official order records for {team.teamName}
          </p>
        </div>
      ) : hasExistingOrders ? (
        /* ─── Team Order Details View (Receipt & Breakdown) ─── */
        <div className="space-y-6 animate-fadeIn">
          {/* Top Just-Submitted Celebration Banner */}
          {justSubmitted && (
            <div className="bg-emerald-950/50 border border-emerald-500/60 p-4 sm:p-5 rounded-xl flex items-start justify-between gap-4 animate-fadeIn shadow-[0_0_25px_rgba(16,185,129,0.15)]">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
                </div>
                <div>
                  <h3 className="text-white text-sm sm:text-base font-bold uppercase tracking-wider">
                    Pre-Order Successfully Placed!
                  </h3>
                  <p className="text-emerald-300/90 text-xs mt-0.5 leading-relaxed">
                    Thank you, <strong className="text-white font-semibold">{primaryOrder.name}</strong>. Your team&apos;s T-shirt pre-order has been logged with Reference ID{" "}
                    <strong className="text-white font-mono">{primaryOrder.orderId || primaryOrder.id}</strong>.
                    Your complete order receipt and member sizes are confirmed below.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a
                      href="https://chat.whatsapp.com/FE5230pvNjY6avaOxpfdkL?s=cl&p=i&mlu=4&ilr=4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-[#075E54] font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_12px_rgba(37,211,102,0.35)]"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.588-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.146-.527-1.745-.722-2.871-2.493-2.958-2.608-.087-.116-.708-.94-.708-1.793s.448-1.272.607-1.446c.159-.175.346-.219.462-.219.116 0 .232.001.332.006.106.005.249-.04.39.298.144.347.491 1.2.535 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.109 1.523 5.839l-1.616 5.905 6.059-1.589c1.67.91 3.578 1.439 5.61 1.439 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>Join WhatsApp Group</span>
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setJustSubmitted(false)}
                className="text-emerald-400/60 hover:text-emerald-300 text-xs shrink-0 cursor-pointer p-1"
                title="Dismiss"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          {/* Main Order Details Card */}
          <div className="bg-[#0b0c16]/90 border border-zinc-800/80 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl">
            {/* Card Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {primaryOrder.status === 'verified' ? 'Order Verified & Approved' : 'Order Confirmed · Slip Received'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700">
                    <span className="material-symbols-outlined text-xs text-[#00d2ff]">lock</span>
                    Locked
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Team Pre-Order Summary
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  Submitted on {primaryOrder.createdAt ? new Date(primaryOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  {" · "}Team: <strong className="text-white font-medium">{team.teamName}</strong>
                </p>
              </div>

              {/* Order ID & Copy */}
              <div className="flex items-center gap-2 self-start lg:self-auto">
                <div className="bg-[#12131f] border border-zinc-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-medium">Order ID</span>
                    <span className="text-sm font-mono font-bold text-[#00d2ff]">
                      {primaryOrder.orderId || primaryOrder.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(primaryOrder.orderId || primaryOrder.id || "");
                      setCopiedOrderId(true);
                      setTimeout(() => setCopiedOrderId(false), 2000);
                    }}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy Order ID"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedOrderId ? "done" : "content_copy"}
                    </span>
                    <span className="text-xs font-medium">{copiedOrderId ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Overview Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="bg-[#12131f] border border-white/[0.06] p-4 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1 text-[#00d2ff]">
                  <span className="material-symbols-outlined text-base">apparel</span>
                  <span className="text-xs font-semibold text-zinc-400">Total Shirts</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {primaryOrder.shirtCount || primaryShirts.length}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Official arena jerseys
                </p>
              </div>

              <div className="bg-[#12131f] border border-white/[0.06] p-4 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1 text-emerald-400">
                  <span className="material-symbols-outlined text-base">payments</span>
                  <span className="text-xs font-semibold text-zinc-400">Total Paid</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
                  LKR {primaryTotalPaid.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {primaryOrder.shirtCount || primaryShirts.length} × LKR {PRICE_PER_SHIRT.toLocaleString()}
                </p>
              </div>

              <div className="bg-[#12131f] border border-white/[0.06] p-4 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1 text-[#5b9aff]">
                  <span className="material-symbols-outlined text-base">person</span>
                  <span className="text-xs font-semibold text-zinc-400">Contact</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white truncate">
                  {primaryOrder.name}
                </p>
                <p className="text-xs text-zinc-400 font-mono mt-0.5 truncate">
                  {primaryOrder.whatsappNumber}
                </p>
              </div>

              <div className="bg-[#12131f] border border-white/[0.06] p-4 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1 text-amber-400">
                  <span className="material-symbols-outlined text-base">storefront</span>
                  <span className="text-xs font-semibold text-zinc-400">Collection</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">
                  Arena Desk
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  On event day
                </p>
              </div>
            </div>

            {/* Official WhatsApp Group Card for Teams */}
            <div className="bg-gradient-to-r from-[#075E54]/25 via-[#128C7E]/20 to-[#25D366]/10 border border-[#25D366]/30 p-4 sm:p-5 rounded-xl text-left mb-8 shadow-[0_0_25px_rgba(37,211,102,0.12)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <svg className="w-6 h-6 text-[#25D366] fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.588-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.146-.527-1.745-.722-2.871-2.493-2.958-2.608-.087-.116-.708-.94-.708-1.793s.448-1.272.607-1.446c.159-.175.346-.219.462-.219.116 0 .232.001.332.006.106.005.249-.04.39.298.144.347.491 1.2.535 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.109 1.523 5.839l-1.616 5.905 6.059-1.589c1.67.91 3.578 1.439 5.61 1.439 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold flex items-center gap-1.5">
                      Official T-Shirt Updates WhatsApp Group
                      <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                    </h4>
                    <p className="text-zinc-300 text-xs mt-0.5 leading-relaxed">
                      Team leaders & coordinators: Join the group for slip verification status, batch production updates, and bulk arena desk collection.
                    </p>
                  </div>
                </div>

                <a
                  href="https://chat.whatsapp.com/FE5230pvNjY6avaOxpfdkL?s=cl&p=i&mlu=4&ilr=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto shrink-0 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-[#075E54] font-black text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.35)] hover:shadow-[0_0_25px_rgba(37,211,102,0.6)]"
                >
                  <span>Join Group</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>

            {/* Roster & Size Breakdown */}
            <div className="mb-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00d2ff] text-base">groups</span>
                  <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                    Team Member & Size Allocation
                  </h3>
                </div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  {primaryShirts.length} {primaryShirts.length === 1 ? "Jersey" : "Jerseys"} Assigned
                </span>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto border border-zinc-800 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0b0c16] text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-3 w-12 text-center">#</th>
                      <th className="p-3">Team Member / Supporter</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Assigned Size</th>
                      <th className="p-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-[#080808]">
                    {primaryShirts.map((s, idx) => {
                      const measurement = getSizeMeasurement(s.category, s.size);
                      return (
                        <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="p-3 text-center text-zinc-500 font-mono text-[11px]">{idx + 1}</td>
                          <td className="p-3 font-semibold text-white">
                            {s.memberName || `Shirt #${idx + 1}`}
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              s.memberRole === 'Leader'
                                ? 'bg-[#004491]/30 text-[#00d2ff] border border-[#004491]/50'
                                : s.memberRole === 'Extra / Supporter'
                                ? 'bg-purple-950/40 text-purple-300 border border-purple-800/40'
                                : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                            }`}>
                              {s.memberRole || 'Member'}
                            </span>
                          </td>
                          <td className="p-3 text-zinc-300">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                              s.category === 'Kids Size'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                : 'bg-zinc-800/60 text-zinc-300'
                            }`}>
                              {s.category || 'Normal Size'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#00d2ff] bg-[#004491]/20 px-2.5 py-0.5 rounded border border-[#004491]/40">
                                {s.size}
                              </span>
                              {measurement && (
                                <span className="text-[11px] text-zinc-500 font-mono">
                                  ({measurement})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-400">
                            LKR {PRICE_PER_SHIRT.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="sm:hidden space-y-2.5">
                {primaryShirts.map((s, idx) => {
                  const measurement = getSizeMeasurement(s.category, s.size);
                  return (
                    <div key={idx} className="bg-[#0b0c16] border border-outline-variant p-3.5 rounded-lg">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-mono flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-white text-xs font-bold">
                            {s.memberName || `Shirt #${idx + 1}`}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          s.memberRole === 'Leader'
                            ? 'bg-[#004491]/30 text-[#00d2ff] border border-[#004491]/50'
                            : s.memberRole === 'Extra / Supporter'
                            ? 'bg-purple-950/40 text-purple-300 border border-purple-800/40'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {s.memberRole || 'Member'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/80">
                        <span className="text-zinc-400 text-[11px]">{s.category || 'Normal Size'}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#00d2ff] bg-[#004491]/20 px-2 py-0.5 rounded border border-[#004491]/40 text-[11px]">
                            Size {s.size}
                          </span>
                          {measurement && (
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {measurement}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Verification & Bank Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Slip Verification Box */}
              <div className="bg-[#12131f] border border-white/[0.06] p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                    Payment Slip &amp; Verification
                  </h4>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Payment Slip</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check</span>
                      Attached &amp; Logged
                    </span>
                  </div>

                  {primaryOrder.slipName && (
                    <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-400">File Name</span>
                      <span className="text-zinc-300 font-mono truncate max-w-[200px]">{primaryOrder.slipName}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Reference / Txn ID</span>
                    <span className="text-white font-mono">{primaryOrder.referenceNumber || "Submitted via Slip"}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-400">Payment Status</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {primaryOrder.status || "Received"}
                    </span>
                  </div>

                  {preview && (
                    <div className="mt-3 pt-3 border-t border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block mb-2 font-medium">Slip Thumbnail</span>
                      <div className="max-w-[160px] max-h-32 overflow-hidden rounded-lg border border-zinc-700 bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Uploaded Slip" className="w-full h-auto object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Official Tournament Bank Info */}
              <div className="bg-[#12131f] border border-white/[0.06] p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#00d2ff] text-base">account_balance</span>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                    Official Account Credited
                  </h4>
                </div>

                <div className="space-y-2 text-xs text-zinc-400">
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>Bank</span>
                    <span className="text-white font-medium">People&apos;s Bank</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>Branch</span>
                    <span className="text-white font-medium">Kelaniya Branch</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span>Account Name</span>
                    <span className="text-white font-medium">Electronics and Computer Science Student Club</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Account Number</span>
                    <span className="text-[#00d2ff] font-mono font-bold">055200290051008</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Orders History (if multiple orders exist) */}
            {previousOrders.length > 0 && (
              <div className="border border-white/[0.06] rounded-xl p-4 bg-[#12131f] mb-8">
                <button
                  type="button"
                  onClick={() => setShowPreviousOrdersList(!showPreviousOrdersList)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-base">history</span>
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      Previous Orders Placed by Your Team ({previousOrders.length})
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-zinc-400 text-base">
                    {showPreviousOrdersList ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {showPreviousOrdersList && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-zinc-800">
                    {previousOrders.map((ord) => (
                      <div key={ord.orderId || ord.id} className="bg-[#080811] border border-zinc-800 p-3.5 rounded-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <span className="font-mono text-xs font-bold text-[#00d2ff]">{ord.orderId || ord.id}</span>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <span>{ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : ""}</span>
                            <span className="text-emerald-400 font-bold">
                              {ord.shirtCount || ord.shirts?.length} Shirts · LKR {((ord.shirtCount || ord.shirts?.length || 0) * PRICE_PER_SHIRT).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {ord.shirts?.map((s, idx) => (
                            <span key={idx} className="text-[10px] bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                              {s.memberName}: {s.size} ({s.category})
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Controls & Contact */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800/80">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="px-3.5 py-2 bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#00d2ff]">lock</span>
                  <span>Order Finalized &amp; Locked</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="w-full sm:w-auto px-3.5 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-semibold transition-colors rounded-lg flex items-center justify-center gap-2 cursor-pointer bg-[#12131f]"
                >
                  <span className="material-symbols-outlined text-base">straighten</span>
                  <span>Measurements Guide</span>
                </button>
              </div>

              <p className="text-xs text-zinc-400 text-center sm:text-right">
                Orders cannot be edited once placed · Jerseys issued at Registration Desk on Event Day
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ─── Order Form ─── */
        <div className="space-y-8">
          {/* Official Merchandise Showcase: Flyer & Size Chart (Always Visible) */}
          <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* Left Column: Official Event Flyer */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative group w-full max-w-[280px] sm:max-w-[340px] rounded-2xl overflow-hidden border border-zinc-700/80 bg-[#12131f] shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://ik.imagekit.io/wfnazmyxh/Posts/WhatsApp%20Image%202026-09-13%20at%2010.20.14%20AM.jpeg"
                    alt="Official UOK Robot Games 2K26 T-Shirt Flyer"
                    className="w-full h-auto aspect-square object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <a
                    href="https://ik.imagekit.io/wfnazmyxh/Posts/WhatsApp%20Image%202026-09-13%20at%2010.20.14%20AM.jpeg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1.5px]"
                    title="Open flyer in full size"
                  >
                    <span className="text-xs font-semibold text-white bg-black/80 hover:bg-black px-3.5 py-2 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-xl transition-all">
                      <span className="material-symbols-outlined text-sm text-[#00d2ff]">zoom_in</span>
                      <span>View Full Flyer</span>
                    </span>
                  </a>
                </div>

                {/* Sub-bar below flyer: Price & Aligned Full Flyer Button */}
                <div className="mt-3 w-full max-w-[280px] sm:max-w-[340px] flex items-center justify-between gap-2 px-0.5">
                  <div className="inline-flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-white">Event Jersey</span>
                    <span className="font-bold text-[#00d2ff] bg-[#004491]/20 border border-[#004491]/40 px-2 py-0.5 rounded-md">
                      Rs. 1,900
                    </span>
                  </div>

                  <a
                    href="https://ik.imagekit.io/wfnazmyxh/Posts/WhatsApp%20Image%202026-09-13%20at%2010.20.14%20AM.jpeg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white bg-[#12131f] hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#00d2ff]/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Open flyer in high resolution"
                  >
                    <span className="material-symbols-outlined text-xs text-[#00d2ff]">open_in_new</span>
                    <span>Full Flyer</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Size Measurements Table (Always Shown) */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[#00d2ff] text-xl shrink-0">straighten</span>
                    <h2 className="text-white text-sm sm:text-base font-bold uppercase tracking-wider truncate">
                      Size Measurements <span className="text-zinc-400 text-xs font-medium lowercase tracking-normal">(inches)</span>
                    </h2>
                  </div>
                  <span className="shrink-0 whitespace-nowrap text-[11px] font-semibold tracking-wide text-[#00d2ff] bg-[#004491]/25 border border-[#004491]/50 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
                    Unisex Fit
                  </span>
                </div>

                <p className="text-zinc-400 text-xs mb-3 leading-relaxed">
                  Check your measurements below to pick your best fit. All values are in inches:
                </p>

                <div className="border border-zinc-800/90 rounded-xl overflow-x-auto shadow-inner">
                  <table className="w-full text-xs">
                    <thead className="bg-[#12131f] text-zinc-400 uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-zinc-800">
                      <tr>
                        <th className="py-2.5 px-3 sm:px-4 text-left font-bold text-white">Size</th>
                        <th className="py-2.5 px-3 sm:px-4 text-center font-semibold text-zinc-300">Chest (in)</th>
                        <th className="py-2.5 px-3 sm:px-4 text-center font-semibold text-zinc-300">Length (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/70 bg-[#07080f]/80 text-zinc-300">
                      <tr className="hover:bg-[#12131f]/60 transition-colors">
                        <td className="py-2 px-3 sm:px-4 text-left font-bold text-white">XS</td>
                        <td className="py-2 px-3 sm:px-4 text-center font-medium">36&quot;</td>
                        <td className="py-2 px-3 sm:px-4 text-center font-medium">26&quot;</td>
                      </tr>
                      <tr className="hover:bg-[#12131f]/60 transition-colors">
                        <td className="py-2 px-3 sm:px-4 text-left font-bold text-white">S</td>
                        <td className="py-2 px-3 sm:px-4 text-center font-medium">38&quot;</td>
                        <td className="py-2 px-4 text-center font-medium">27&quot;</td>
                      </tr>
                      <tr className="hover:bg-[#12131f]/60 transition-colors">
                        <td className="py-2 px-3 sm:px-4 text-left font-bold text-white">M</td>
                        <td className="py-2 px-3 sm:px-4 text-center font-medium">40&quot;</td>
                        <td className="py-2 px-4 text-center font-medium">28&quot;</td>
                      </tr>
                      <tr className="hover:bg-[#12131f]/60 transition-colors">
                        <td className="py-2 px-3 sm:px-4 text-left font-bold text-white">L</td>
                        <td className="py-2 px-3 sm:px-4 text-center font-medium">42&quot;</td>
                        <td className="py-2 px-4 text-center font-medium">29&quot;</td>
                      </tr>
                      <tr className="hover:bg-[#12131f]/60 transition-colors">
                        <td className="py-2 px-3 sm:px-4 text-left font-bold text-white">XL</td>
                        <td className="py-2 px-3 sm:px-4 text-center font-medium">44&quot;</td>
                        <td className="py-2 px-4 text-center font-medium">30&quot;</td>
                      </tr>
                      <tr className="hover:bg-[#12131f]/60 transition-colors">
                        <td className="py-2 px-3 sm:px-4 text-left font-bold text-white">2XL</td>
                        <td className="py-2 px-3 sm:px-4 text-center font-medium">46&quot;</td>
                        <td className="py-2 px-4 text-center font-medium">31&quot;</td>
                      </tr>
                      <tr className="hover:bg-[#12131f]/60 transition-colors">
                        <td className="py-2 px-3 sm:px-4 text-left font-bold text-white">3XL</td>
                        <td className="py-2 px-3 sm:px-4 text-center font-medium">48&quot;</td>
                        <td className="py-2 px-4 text-center font-medium">32&quot;</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <span className="material-symbols-outlined text-sm text-[#00d2ff] shrink-0">check_circle</span>
                  <span>Standard unisex chest circumference and body length.</span>
                </div>
              </div>

            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
          {hasExistingOrders && (
            <div className="bg-[#0b0c16] border border-[#004491]/50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#004491]/20 flex items-center justify-center shrink-0 border border-[#004491]/40">
                  <span className="material-symbols-outlined text-[#00d2ff] text-base">receipt_long</span>
                </div>
                <div>
                  <span className="text-white text-xs font-bold block">
                    Existing Order Active ({primaryOrder.orderId || primaryOrder.id})
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    You already placed an order for {totalShirtsOrdered} {totalShirtsOrdered === 1 ? "shirt" : "shirts"}. You are now placing an additional order.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewOrderForm(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Order Details</span>
              </button>
            </div>
          )}
          
          {error && (
            <div className="bg-red-950/40 border border-red-500/50 p-4 rounded-sm flex items-start gap-3 animate-fadeIn">
              <span className="material-symbols-outlined text-red-400 text-lg shrink-0 mt-0.5">error</span>
              <p className="text-red-200 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 1: SELECT WHICH STUDENTS BUY T-SHIRTS
             ════════════════════════════════════════════════════════════════ */}
          <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-zinc-800/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#004491]/30 border border-[#004491]/50 flex items-center justify-center text-[#5b9aff] text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <h2 className="text-white text-base sm:text-lg font-bold">
                    1. Select Members for T-Shirts
                  </h2>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Choose who in your team wants an official jersey ({teamMemberCount} members + up to {MAX_EXTRAS} extra mentors/supporters).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleSelectAll(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-[#12131f] hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAll(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-[#12131f] border border-zinc-800 rounded-lg transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Student Roster Cards */}
            <div className="space-y-2.5 mb-5">
              {roster.map((member) => (
                <div
                  key={member.id}
                  onClick={() => toggleMemberSelection(member.id)}
                  className={`flex items-center justify-between gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    member.selected
                      ? "bg-[#12131f] border-[#004491]/80 shadow-sm"
                      : "bg-[#080811] border-zinc-800/80 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        member.selected
                          ? "bg-[#004491] border-[#00d2ff] text-white"
                          : "border-zinc-700 bg-transparent"
                      }`}
                    >
                      {member.selected && (
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className={`text-xs sm:text-sm font-semibold truncate ${member.selected ? "text-white" : "text-zinc-400"}`}>
                          {member.name}
                        </p>
                        <span className={`text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md shrink-0 ${
                          member.role === "Leader"
                            ? "bg-[#004491]/25 text-[#00d2ff] border border-[#004491]/40"
                            : member.isExtra
                              ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                              : "bg-white/[0.04] text-zinc-400 border border-white/[0.08]"
                        }`}>
                          {member.role}
                        </span>
                      </div>
                      {member.contact && (
                        <p className="text-zinc-500 text-[11px] sm:text-xs font-mono mt-0.5">{member.contact}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {member.selected ? (
                      <span className="text-[11px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                        Included
                      </span>
                    ) : (
                      <span className="text-[11px] sm:text-xs text-zinc-500 font-medium">
                        Excluded
                      </span>
                    )}

                    {member.isExtra && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveExtraStudent(member.id);
                        }}
                        title="Remove extra supporter"
                        className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add extra student button & inline form */}
            {!showAddExtra ? (
              <div className="flex flex-wrap items-center gap-3">
                {roster.filter((m) => m.isExtra).length < MAX_EXTRAS ? (
                  <button
                    type="button"
                    onClick={() => setShowAddExtra(true)}
                    className="text-xs font-semibold text-[#5b9aff] hover:text-white flex items-center gap-1.5 border border-zinc-700 hover:border-zinc-500 bg-[#12131f] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    + Add Mentor or Supporter ({roster.filter((m) => m.isExtra).length}/{MAX_EXTRAS} added)
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 border border-zinc-800 bg-[#12131f] px-3.5 py-2 rounded-xl">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    <span>Maximum {MAX_EXTRAS} extra supporters reached ({MAX_EXTRAS}/{MAX_EXTRAS})</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#12131f] border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter mentor or supporter full name"
                  value={extraStudentName}
                  onChange={(e) => setExtraStudentName(e.target.value)}
                  className="flex-1 w-full bg-[#080811] border border-zinc-700 rounded-xl text-zinc-200 text-xs px-3.5 py-2.5 focus:outline-none focus:border-[#004491]"
                />
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handleAddExtraStudent}
                    className="px-4 py-2 bg-[#004491] hover:bg-[#002d5e] text-white text-xs font-semibold transition-colors cursor-pointer rounded-xl"
                  >
                    Add to List
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddExtra(false);
                      setExtraStudentName("");
                    }}
                    className="px-3 py-2 text-zinc-400 hover:text-white text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Selection Summary Pill */}
            <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-zinc-400 font-medium">
                  Selected shirts:
                </span>
                <span className="text-sm font-bold text-white">
                  {selectedStudents.length} of max {maxAllowedShirts}
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  LKR {(selectedStudents.length * PRICE_PER_SHIRT).toLocaleString()}
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400 text-xs">
                  ({teamMemberCount} members + {roster.filter((m) => m.isExtra && m.selected).length}/{MAX_EXTRAS} extras)
                </span>
              </div>

              {selectedStudents.length === 0 && (
                <span className="text-amber-400 text-xs font-medium">
                  Please select at least one member above to configure sizes
                </span>
              )}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              STEP 2: CONTACT & PICKUP PERSON
             ════════════════════════════════════════════════════════════════ */}
          <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-lg">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-zinc-800/70">
              <div className="w-8 h-8 rounded-full bg-[#004491]/30 border border-[#004491]/50 flex items-center justify-center text-[#5b9aff] text-xs font-bold shrink-0">
                2
              </div>
              <div>
                <h2 className="text-white text-base sm:text-lg font-bold">
                  2. Team Contact Person
                </h2>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Point of contact for collecting the T-shirts at the competition arena on event day.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-zinc-300 text-xs font-semibold mb-2">
                  Contact Person / Leader Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sushan Fernando"
                  value={contactName}
                  onChange={(e) => { setContactName(e.target.value); setError(""); }}
                  className="w-full bg-[#12131f] border border-zinc-800 rounded-xl text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 text-xs font-semibold mb-2">
                  WhatsApp Contact Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 077 123 4567"
                  value={whatsappNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9+ ]/g, "");
                    setWhatsappNumber(val);
                    setError("");
                  }}
                  className="w-full bg-[#12131f] border border-zinc-800 rounded-xl text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              STEP 3: SIZE SELECTION FOR SELECTED STUDENTS
             ════════════════════════════════════════════════════════════════ */}
          {selectedStudents.length > 0 ? (
            <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-zinc-800/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#004491]/30 border border-[#004491]/50 flex items-center justify-center text-[#5b9aff] text-xs font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h2 className="text-white text-base sm:text-lg font-bold">
                      3. Select Sizes
                    </h2>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      Pick a size for each of your {shirts.length} selected {shirts.length === 1 ? "member" : "members"} (XS to 3XL).
                    </p>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 font-medium shrink-0">
                  <span className="text-[#00d2ff] font-bold">{shirts.filter((s) => s.size).length}</span> of {shirts.length} sized
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  MOBILE VIEW (Touch friendly list of members)
                 ════════════════════════════════════════════════════════════════ */}
              <div className="block md:hidden">
                {/* Tab Bar if > 1 student */}
                {shirts.length > 1 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
                      <span>Select a member to configure:</span>
                      <span className="text-[#00d2ff]">
                        {shirts.filter((s) => s.size).length} of {shirts.length} chosen
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      <button
                        type="button"
                        onClick={() => setActiveMobileTab("all")}
                        className={`py-1.5 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          activeMobileTab === "all"
                            ? "bg-[#004491] text-white border-[#00d2ff]/60 shadow-sm"
                            : "bg-[#12131f] border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        All ({shirts.length})
                      </button>

                      {shirts.map((s, idx) => (
                        <button
                          key={s.memberId || idx}
                          type="button"
                          onClick={() => setActiveMobileTab(idx.toString())}
                          className={`flex-1 min-w-[70px] py-1.5 px-2 text-center text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            activeMobileTab === idx.toString()
                              ? "bg-[#004491] text-white border-[#00d2ff]/60 shadow-sm"
                              : s.size
                                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                                : "bg-[#12131f] border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <div className="truncate">{s.memberName?.split(" ")[0] || `#${idx + 1}`}</div>
                          <div className="text-[10px] text-zinc-400 font-normal">
                            {s.size ? s.size : "Pick size"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile All View */}
                {shirts.length > 1 && activeMobileTab === "all" ? (
                  <div className="space-y-4 mb-5">
                    {shirts.map((shirt, idx) => {
                      return (
                        <div
                          key={shirt.memberId || idx}
                          className="bg-[#12131f] border border-zinc-800/90 p-4 rounded-xl"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-sm font-bold">
                                {shirt.memberName}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                {shirt.memberRole}
                              </span>
                            </div>

                            {shirt.size ? (
                              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                                Size {shirt.size}
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-amber-400">
                                Select size below
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {SIZES.map((sizeId) => {
                              const isSelected = shirt.size === sizeId;
                              const measurement = SIZE_MEASUREMENTS[sizeId];
                              return (
                                <button
                                  key={sizeId}
                                  type="button"
                                  onClick={() => handleSizeSelect(idx, sizeId)}
                                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-[#004491] border-[#00d2ff] text-white shadow-md"
                                      : "bg-[#0a0b12] border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full mb-1">
                                    <span className="text-sm font-bold">{sizeId}</span>
                                    {isSelected ? (
                                      <span className="material-symbols-outlined text-sm text-[#00d2ff]">check_circle</span>
                                    ) : (
                                      <span className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
                                    )}
                                  </div>
                                  {measurement && (
                                    <span className="text-[11px] text-zinc-400">
                                      {measurement}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/* Mobile Individual View */}
                {(shirts.length === 1 || activeMobileTab !== "all") && (
                  <div>
                    {(() => {
                      const targetIdx = shirts.length === 1 ? 0 : Number(activeMobileTab);
                      const shirt = shirts[targetIdx];
                      if (!shirt) return null;

                      return (
                        <div className="bg-[#12131f] border border-zinc-800/90 p-4 sm:p-5 mb-5 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white text-sm sm:text-base font-bold">
                                {shirt.memberName} Size
                              </h3>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                {shirt.memberRole}
                              </span>
                            </div>

                            {shirt.size && (
                              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                                Size {shirt.size} selected
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {SIZES.map((sizeId) => {
                              const isSelected = shirt.size === sizeId;
                              const measurement = SIZE_MEASUREMENTS[sizeId];

                              return (
                                <button
                                  key={sizeId}
                                  type="button"
                                  onClick={() => {
                                    handleSizeSelect(targetIdx, sizeId);
                                    if (targetIdx < shirts.length - 1 && !shirts[targetIdx + 1]?.size) {
                                      setTimeout(() => setActiveMobileTab((targetIdx + 1).toString()), 200);
                                    }
                                  }}
                                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-[#004491] border-[#00d2ff] text-white shadow-md"
                                      : "bg-[#0a0b12] border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full mb-1">
                                    <span className="text-sm font-bold">{sizeId}</span>
                                    {isSelected ? (
                                      <span className="material-symbols-outlined text-sm text-[#00d2ff]">check_circle</span>
                                    ) : (
                                      <span className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
                                    )}
                                  </div>
                                  {measurement && (
                                    <span className="text-[11px] text-zinc-400">
                                      {measurement}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {shirts.length > 1 && (
                            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                disabled={targetIdx === 0}
                                onClick={() => setActiveMobileTab((targetIdx - 1).toString())}
                                className="px-3 py-1.5 text-xs font-medium border border-zinc-700 rounded-lg text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                ← Previous
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveMobileTab("all")}
                                className="px-3 py-1.5 text-xs font-medium text-[#00d2ff] bg-[#004491]/20 hover:bg-[#004491]/40 border border-[#004491]/50 rounded-lg cursor-pointer"
                              >
                                View All Members
                              </button>

                              <button
                                type="button"
                                disabled={targetIdx === shirts.length - 1}
                                onClick={() => setActiveMobileTab((targetIdx + 1).toString())}
                                className="px-3 py-1.5 text-xs font-medium border border-zinc-700 rounded-lg text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              >
                                Next →
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  DESKTOP VIEW (Clean list of members & size chips: hidden md:block)
                 ════════════════════════════════════════════════════════════════ */}
              <div className="hidden md:block">
                <div className="border border-white/[0.08] bg-[#12131f] rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-zinc-800 bg-[#080811] flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-sm font-bold">Assign Member Sizes</h3>
                      <p className="text-zinc-400 text-xs">
                        Select a size for each member or supporter below.
                      </p>
                    </div>
                    <div className="text-xs text-zinc-400 font-medium">
                      <span className="text-white font-bold">{shirts.filter((s) => s.size).length}</span> of {shirts.length} chosen
                    </div>
                  </div>

                  <div className="divide-y divide-zinc-800/80">
                    {shirts.map((shirt, idx) => (
                      <div
                        key={shirt.memberId || idx}
                        className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.015] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            shirt.size
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-zinc-800 text-zinc-400"
                          }`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-semibold">{shirt.memberName}</p>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                {shirt.memberRole}
                              </span>
                            </div>
                            <p className="text-zinc-400 text-xs mt-0.5">
                              {shirt.size ? `Size ${shirt.size}` : "No size selected"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {SIZES.map((sizeId) => {
                            const isSelected = shirt.size === sizeId;
                            return (
                              <button
                                key={sizeId}
                                type="button"
                                title={`${sizeId} (${SIZE_MEASUREMENTS[sizeId]})`}
                                onClick={() => handleSizeSelect(idx, sizeId)}
                                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#004491] text-white border border-[#00d2ff] shadow-sm"
                                    : "bg-[#080811] border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
                                }`}
                              >
                                {sizeId}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Sizes Summary */}
                <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-zinc-400 font-medium">Selected summary:</span>
                    {shirts.map((s, idx) => (
                      <div
                        key={s.memberId || idx}
                        className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                          s.size
                            ? "bg-[#004491]/20 border-[#004491]/60 text-blue-200"
                            : "bg-amber-950/20 border-amber-500/30 text-amber-300"
                        }`}
                      >
                        <span className="font-semibold">{s.memberName?.split(" ")[0]}:</span>
                        <span>{s.size ? s.size : "None"}</span>
                      </div>
                    ))}
                  </div>
                  {shirts.every((s) => s.size) && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      All sizes selected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* ════════════════════════════════════════════════════════════════
              STEP 4: PAYMENT DETAILS & BANK SLIP UPLOAD
             ════════════════════════════════════════════════════════════════ */}
          {selectedStudents.length > 0 && (
            <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-lg">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-zinc-800/70">
                <div className="w-8 h-8 rounded-full bg-[#004491]/30 border border-[#004491]/50 flex items-center justify-center text-[#5b9aff] text-xs font-bold shrink-0">
                  4
                </div>
                <div>
                  <h2 className="text-white text-base sm:text-lg font-bold">
                    4. Payment &amp; Slip Upload
                  </h2>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Transfer the total amount to the official club account and upload your deposit slip or receipt.
                  </p>
                </div>
              </div>

              {/* Bank Account Details Card */}
              <div className="mb-6 bg-[#12131f] border border-zinc-800/90 p-4 sm:p-6 rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-[#5b9aff]">
                      Direct Bank Transfer or Online Deposit
                    </span>
                    <h3 className="text-white text-lg font-bold mt-0.5">People&apos;s Bank</h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-zinc-400">Total Payable</p>
                    <p className="text-2xl font-bold text-emerald-400 font-mono">
                      LKR {(shirts.length * PRICE_PER_SHIRT).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      ({shirts.length} × LKR {PRICE_PER_SHIRT.toLocaleString()})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 text-xs">
                  <div>
                    <p className="text-zinc-400 text-[11px] mb-1">Account Name</p>
                    <p className="text-zinc-100 font-medium">Electronics and Computer Science Student Club</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] mb-1">Account Number</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-mono font-bold text-sm tracking-wide">055200290051008</p>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[#5b9aff] hover:text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        {copiedAccount ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] mb-1">Branch</p>
                    <p className="text-zinc-100 font-medium">Kelaniya Branch</p>
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="mb-6">
                <label className="block text-zinc-300 text-xs font-semibold mb-2.5">
                  Payment Slip / Receipt <span className="text-red-400">*</span>
                </label>

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed p-5 sm:p-8 text-center rounded-xl transition-all ${
                    dragOver
                      ? "border-[#00d2ff] bg-[#004491]/15"
                      : paymentSlip
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-zinc-700 hover:border-zinc-500 bg-[#12131f]"
                  }`}
                >
                  {paymentSlip ? (
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400 text-4xl">task</span>
                      <div>
                        <p className="text-white text-sm font-semibold">{paymentSlip.name}</p>
                        <p className="text-zinc-400 text-xs mt-0.5">
                          {(paymentSlip.size / 1024 / 1024).toFixed(2)} MB · Slip attached
                        </p>
                      </div>
                      {preview && (
                        <div className="mt-2 max-w-xs max-h-48 overflow-hidden rounded-lg border border-zinc-700 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={preview} alt="Slip preview" className="w-full h-auto object-contain" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => { setPaymentSlip(null); setPreview(null); }}
                        className="text-red-400 text-xs hover:underline mt-1 cursor-pointer"
                      >
                        Remove and select another
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span className="material-symbols-outlined text-zinc-400 text-4xl mb-2">cloud_upload</span>
                      <p className="text-zinc-200 text-sm font-semibold mb-1">
                        Drag and drop your slip here, or browse
                      </p>
                      <p className="text-zinc-400 text-xs mb-4">
                        Supported formats: JPG, PNG, WebP, PDF (Max 5MB)
                      </p>
                      <label className="inline-block px-5 py-2.5 bg-[#004491] hover:bg-[#003570] text-white text-xs font-semibold cursor-pointer transition-colors rounded-xl">
                        Select Payment Slip
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-zinc-300 text-xs font-semibold mb-2">
                  Bank Reference / Transaction ID <span className="text-zinc-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN987654321 or Deposit Slip Reference"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full bg-[#12131f] border border-zinc-800 rounded-xl text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors"
                />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              SUBMIT BUTTON & SUMMARY BAR
             ════════════════════════════════════════════════════════════════ */}
          {selectedStudents.length > 0 && (
            <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <p className="text-white text-base font-bold">
                  Total: {shirts.length} {shirts.length === 1 ? "Shirt" : "Shirts"} · LKR {(shirts.length * PRICE_PER_SHIRT).toLocaleString()}
                </p>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Please verify sizes and contact information before submitting.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#004491] hover:bg-[#003570] text-white text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#004491]/25"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Team Order...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">shopping_bag</span>
                    <span>Submit Team Order</span>
                  </>
                )}
              </button>
            </div>
          )}
          </form>
        </div>
      )}

    </div>
  );
}
