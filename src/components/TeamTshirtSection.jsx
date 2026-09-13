"use client";

import { useState, useEffect } from "react";

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
      
      {/* ─── Hero Header Banner ─── */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004491]/25 via-[#080808] to-[#080808]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#004491]/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00d2ff]/10 rounded-full blur-[80px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#004491]/20 flex items-center justify-center border border-[#004491]/30">
                <span className="material-symbols-outlined text-[#00d2ff] text-xl">apparel</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#5b9aff]">
                Team Pre-Order Portal
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2 uppercase">
              UOK Robot Games 2K26 <span className="text-[#00d2ff]">T-Shirts</span>
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Equip <strong className="text-white font-bold">{team.teamName}</strong> with official arena jerseys. Select which students want a shirt, customize sizes, and submit your team&apos;s slip in one unified order.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4">
              <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded bg-[#004491]/20 text-[#00d2ff] border border-[#004491]/40">
                Team: {team.teamName}
              </span>

              {hasExistingOrders && (
                <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Order Confirmed ({totalShirtsOrdered} {totalShirtsOrdered === 1 ? "Shirt" : "Shirts"})
                </span>
              )}

              <button
                type="button"
                onClick={() => setShowSizeChart(!showSizeChart)}
                className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded border border-outline-variant hover:border-[#00d2ff] bg-[#0b0c16] text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">straighten</span>
                {showSizeChart ? "Hide Size Chart" : "Size Measurements"}
              </button>

              {hasExistingOrders && (
                <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded bg-[#0b0c16] text-zinc-400 border border-zinc-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-[#00d2ff]">lock</span>
                  Order Locked (Cannot Edit)
                </span>
              )}
            </div>
          </div>

          {/* Quick Price Card */}
          <div className="bg-[#0b0c16]/80 border border-outline-variant p-4 sm:p-5 rounded-xl text-center shrink-0 w-full sm:w-auto">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
              {hasExistingOrders ? "Team Order Value" : `Team Allowance: Up to ${maxAllowedShirts} Shirts`}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {hasExistingOrders
                ? `LKR ${((primaryOrder?.shirtCount || totalShirtsOrdered) * PRICE_PER_SHIRT).toLocaleString()}`
                : `LKR ${PRICE_PER_SHIRT.toLocaleString()}`}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">
              {hasExistingOrders
                ? `${totalShirtsOrdered} Shirts Ordered · ${remainingAllowance > 0 ? `${remainingAllowance} More Allowed` : "Allowance Filled"}`
                : `Per T-Shirt · ${teamMemberCount} Members + ${MAX_EXTRAS} Extras`}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Size Chart Drawer / Modal ─── */}
      {showSizeChart && (
        <div className="bg-[#080808] border border-outline-variant p-6 relative rounded-sm overflow-hidden animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#004491] via-[#00d2ff] to-[#004491]" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00d2ff] text-xl">straighten</span>
              <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                T-Shirt Size Measurements (Inches)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowSizeChart(false)}
              className="text-zinc-500 hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="max-w-md mx-auto">
            <p className="text-[#00d2ff] text-xs font-bold uppercase tracking-widest mb-2 text-center">
              Size Measurements (Inches)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-zinc-300 border border-zinc-800">
                <thead className="bg-[#0b0c16] text-zinc-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-2.5 border-b border-zinc-800">Size</th>
                    <th className="p-2.5 border-b border-zinc-800">Chest (in)</th>
                    <th className="p-2.5 border-b border-zinc-800">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  <tr><td className="p-2 font-bold text-white">XS</td><td className="p-2">36&quot;</td><td className="p-2">26&quot;</td></tr>
                  <tr><td className="p-2 font-bold text-white">S</td><td className="p-2">38&quot;</td><td className="p-2">27&quot;</td></tr>
                  <tr><td className="p-2 font-bold text-white">M</td><td className="p-2">40&quot;</td><td className="p-2">28&quot;</td></tr>
                  <tr><td className="p-2 font-bold text-white">L</td><td className="p-2">42&quot;</td><td className="p-2">29&quot;</td></tr>
                  <tr><td className="p-2 font-bold text-white">XL</td><td className="p-2">44&quot;</td><td className="p-2">30&quot;</td></tr>
                  <tr><td className="p-2 font-bold text-white">2XL</td><td className="p-2">46&quot;</td><td className="p-2">31&quot;</td></tr>
                  <tr><td className="p-2 font-bold text-white">3XL</td><td className="p-2">48&quot;</td><td className="p-2">32&quot;</td></tr>
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
          <div className="relative bg-[#080808] border border-outline-variant p-6 sm:p-8 rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#004491] via-[#00d2ff] to-[#10b981]" />

            {/* Card Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {primaryOrder.status === 'verified' ? 'Order Verified & Approved' : 'Order Confirmed · Slip Received'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-zinc-900/90 text-zinc-400 border border-zinc-700">
                    <span className="material-symbols-outlined text-xs text-[#00d2ff]">lock</span>
                    Order Finalized
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Official Team Pre-Order Details
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  Submitted on {primaryOrder.createdAt ? new Date(primaryOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  {" · "}Team: <strong className="text-white">{team.teamName}</strong>
                </p>
              </div>

              {/* Order ID & Copy */}
              <div className="flex items-center gap-2 self-start lg:self-auto">
                <div className="bg-[#0b0c16] border border-[#004491]/50 px-4 py-2.5 rounded-lg flex items-center gap-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 block">Order ID</span>
                    <span className="text-sm sm:text-base font-mono font-bold text-[#00d2ff]">
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
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy Order ID"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedOrderId ? "done" : "content_copy"}
                    </span>
                    <span className="text-[10px] font-bold">{copiedOrderId ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Overview Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="bg-[#0b0c16] border border-outline-variant p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1 text-[#00d2ff]">
                  <span className="material-symbols-outlined text-base">apparel</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Total Shirts</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white font-mono">
                  {primaryOrder.shirtCount || primaryShirts.length}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Official Arena Jerseys
                </p>
              </div>

              <div className="bg-[#0b0c16] border border-outline-variant p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1 text-emerald-400">
                  <span className="material-symbols-outlined text-base">payments</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Total Amount</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  LKR {primaryTotalPaid.toLocaleString()}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  LKR {PRICE_PER_SHIRT.toLocaleString()} × {primaryOrder.shirtCount || primaryShirts.length}
                </p>
              </div>

              <div className="bg-[#0b0c16] border border-outline-variant p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1 text-[#5b9aff]">
                  <span className="material-symbols-outlined text-base">person</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Contact Person</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white truncate">
                  {primaryOrder.name}
                </p>
                <p className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">
                  {primaryOrder.whatsappNumber}
                </p>
              </div>

              <div className="bg-[#0b0c16] border border-outline-variant p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1 text-amber-400">
                  <span className="material-symbols-outlined text-base">storefront</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Collection</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">
                  Arena Desk
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  On Event Day
                </p>
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
              <div className="bg-[#0b0c16] border border-outline-variant p-4 sm:p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                    Payment Slip & Verification
                  </h4>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Payment Slip</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check</span>
                      Attached & Logged
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
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">Slip Thumbnail</span>
                      <div className="max-w-[160px] max-h-32 overflow-hidden rounded border border-zinc-800 bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Uploaded Slip" className="w-full h-auto object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Official Tournament Bank Info */}
              <div className="bg-[#0b0c16] border border-outline-variant p-4 sm:p-5 rounded-lg">
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
              <div className="border border-zinc-800 rounded-lg p-4 bg-[#0b0c16]/60 mb-8">
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
                      <div key={ord.orderId || ord.id} className="bg-[#080808] border border-zinc-800 p-3.5 rounded">
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
                <div className="px-4 py-2.5 bg-zinc-900 border border-zinc-700/70 text-zinc-300 text-xs uppercase tracking-wider font-bold rounded flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#00d2ff]">lock</span>
                  <span>Order Finalized &amp; Locked</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="w-full sm:w-auto px-4 py-2.5 border border-outline-variant hover:border-[#00d2ff] text-zinc-300 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors rounded flex items-center justify-center gap-2 cursor-pointer bg-[#0b0c16]"
                >
                  <span className="material-symbols-outlined text-base">straighten</span>
                  <span>Measurements Guide</span>
                </button>
              </div>

              <p className="text-[11px] text-zinc-400 text-center sm:text-right">
                Orders cannot be edited once placed · Jerseys issued at Registration Desk on Event Day
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ─── Order Form ─── */
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
          <div className="relative bg-[#080808] border border-outline-variant p-6 sm:p-8">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#004491]" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#004491]/20 flex items-center justify-center text-[#5b9aff] text-xs font-black">
                  1
                </div>
                <div>
                  <h2 className="text-white text-base font-bold uppercase tracking-wider">
                    Select Which Students Buy
                  </h2>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    Tick members who want an official jersey (Your team: {teamMemberCount} members + up to {MAX_EXTRAS} extras = max {maxAllowedShirts} shirts)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleSelectAll(true)}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-[#0b0c16] hover:bg-[#004491]/20 border border-outline-variant rounded transition-all cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAll(false)}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 bg-[#0b0c16] border border-outline-variant rounded transition-all cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Student Roster Cards */}
            <div className="space-y-2.5 mb-5">
              {roster.map((member, i) => (
                <div
                  key={member.id}
                  onClick={() => toggleMemberSelection(member.id)}
                  className={`flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded border transition-all cursor-pointer select-none ${
                    member.selected
                      ? "bg-[#004491]/15 border-[#00d2ff]/60 shadow-[0_0_12px_rgba(0,68,145,0.3)]"
                      : "bg-[#0b0c16] border-outline-variant text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${
                        member.selected
                          ? "bg-[#00d2ff] border-[#00d2ff] text-black shadow-[0_0_8px_rgba(0,210,255,0.5)]"
                          : "border-zinc-700 bg-[#080808]"
                      }`}
                    >
                      {member.selected && (
                        <span className="material-symbols-outlined text-sm font-black">check</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold truncate ${member.selected ? "text-white" : "text-zinc-400"}`}>
                          {member.name}
                        </p>
                        <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
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
                        <p className="text-zinc-500 text-xs font-mono mt-0.5">{member.contact}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {member.selected ? (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                        Purchasing Jersey ✓
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-500 italic">
                        Not ordering
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
                        className="p-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
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
                    className="text-xs uppercase tracking-widest font-bold text-[#5b9aff] hover:text-white flex items-center gap-1.5 border border-[#004491]/30 hover:border-[#004491] bg-[#004491]/10 px-3.5 py-2 rounded transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    + Add Extra Student / Supporter Shirt ({roster.filter((m) => m.isExtra).length}/{MAX_EXTRAS} Extras Added)
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 border border-zinc-800 bg-[#0b0c16] px-3 py-2 rounded">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                    <span>Maximum {MAX_EXTRAS} extra shirts reached for this team ({MAX_EXTRAS}/{MAX_EXTRAS})</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0b0c16] border border-outline-variant p-4 rounded-sm flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter Student / Supporter Full Name"
                  value={extraStudentName}
                  onChange={(e) => setExtraStudentName(e.target.value)}
                  className="flex-1 bg-[#080808] border border-outline-variant text-zinc-200 text-xs px-3 py-2.5 focus:outline-none focus:border-[#00d2ff]"
                />
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handleAddExtraStudent}
                    className="px-4 py-2 bg-[#004491] hover:bg-[#002d5e] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-sm"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddExtra(false);
                      setExtraStudentName("");
                    }}
                    className="px-3 py-2 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Selection Summary Pill */}
            <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                  Selected Count:
                </span>
                <span className="text-sm font-mono font-bold text-[#00d2ff]">
                  {selectedStudents.length} of max {maxAllowedShirts} Shirts
                </span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-400 text-xs font-semibold">
                  Total: LKR {(selectedStudents.length * PRICE_PER_SHIRT).toLocaleString()}
                </span>
                <span className="text-zinc-500">·</span>
                <span className="text-[11px] text-zinc-400">
                  ({teamMemberCount} members + {roster.filter((m) => m.isExtra && m.selected).length}/{MAX_EXTRAS} extras)
                </span>
              </div>

              {selectedStudents.length === 0 && (
                <span className="text-amber-400 text-xs font-bold animate-pulse">
                  ⚠ Please select at least one student above to configure sizes
                </span>
              )}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              STEP 2: CONTACT & PICKUP PERSON
             ════════════════════════════════════════════════════════════════ */}
          <div className="relative bg-[#080808] border border-outline-variant p-6 sm:p-8">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#004491]" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 rounded-full bg-[#004491]/20 flex items-center justify-center text-[#5b9aff] text-xs font-black">
                2
              </div>
              <div>
                <h2 className="text-white text-base font-bold uppercase tracking-wider">
                  Contact &amp; Delivery Lead
                </h2>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Point of contact for collecting the T-shirts at the competition arena
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                  Contact Person / Leader Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sushan Fernando"
                  value={contactName}
                  onChange={(e) => { setContactName(e.target.value); setError(""); }}
                  className="w-full bg-[#0b0c16] border border-outline-variant text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                  WhatsApp Contact Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +94 7X XXX XXXX"
                  value={whatsappNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9+ ]/g, "");
                    setWhatsappNumber(val);
                    setError("");
                  }}
                  className="w-full bg-[#0b0c16] border border-outline-variant text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              STEP 3: SIZE SELECTION FOR SELECTED STUDENTS
             ════════════════════════════════════════════════════════════════ */}
          {selectedStudents.length > 0 ? (
            <div className="relative bg-[#080808] border border-outline-variant p-4 sm:p-6 lg:p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00d2ff]" />
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#00d2ff]/20 flex items-center justify-center text-[#00d2ff] text-xs font-black shrink-0">
                    3
                  </div>
                  <div>
                    <h2 className="text-white text-sm sm:text-base font-bold uppercase tracking-wider">
                      T-Shirt Sizing for Selected Students
                    </h2>
                    <p className="text-zinc-500 text-[11px] mt-0.5">
                      Select size (XS to 3XL) for your {shirts.length} selected {shirts.length === 1 ? "student" : "students"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 bg-[#004491]/15 text-[#5b9aff] border border-[#004491]/30 rounded-sm hidden md:inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
                    Matrix View
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/30 rounded-sm inline-flex md:hidden items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
                    Simple View
                  </span>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  MOBILE VIEW (Simple Touch View strictly on mobile: block md:hidden)
                 ════════════════════════════════════════════════════════════════ */}
              <div className="block md:hidden">
                
                {/* Tab Bar & Dropdown Menu if > 1 student */}
                {shirts.length > 1 && (
                  <div className="mb-4 bg-[#0b0c16] border border-outline-variant p-3.5 rounded-sm">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                        {activeMobileTab === "all"
                          ? `All Selected Students (${shirts.length} Total)`
                          : `Configuring ${shirts[Number(activeMobileTab)]?.memberName || `Student #${Number(activeMobileTab) + 1}`}`}
                      </label>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        shirts.filter((s) => s.size).length === shirts.length
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      }`}>
                        {shirts.filter((s) => s.size).length} of {shirts.length} Sized
                      </span>
                    </div>

                    {/* Mobile Dropdown */}
                    <div className="relative mb-3">
                      <select
                        value={activeMobileTab}
                        onChange={(e) => setActiveMobileTab(e.target.value)}
                        className="w-full bg-[#080808] border border-outline-variant text-white text-xs font-bold px-3 py-2 appearance-none focus:outline-none focus:border-[#00d2ff] transition-colors cursor-pointer rounded-sm"
                      >
                        <option value="all">
                          Show All Students ({shirts.length}) — Overview &amp; Sizing
                        </option>
                        {shirts.map((s, idx) => (
                          <option key={s.memberId || idx} value={idx.toString()}>
                            {s.memberName} ({s.memberRole}) {s.size ? `[Size ${s.size}] ✓` : "(Size required)"}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-lg">
                        expand_more
                      </span>
                    </div>

                    {/* Quick Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      <button
                        type="button"
                        onClick={() => setActiveMobileTab("all")}
                        className={`py-2 px-3 text-center text-xs font-bold uppercase transition-all rounded-sm border shrink-0 flex items-center gap-1.5 cursor-pointer ${
                          activeMobileTab === "all"
                            ? "bg-[#004491] border-[#00d2ff] text-white shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                            : "bg-[#080808] border-outline-variant text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">view_agenda</span>
                        <span>Show All</span>
                      </button>

                      {shirts.map((s, idx) => (
                        <button
                          key={s.memberId || idx}
                          type="button"
                          onClick={() => setActiveMobileTab(idx.toString())}
                          className={`flex-1 min-w-[70px] py-1.5 px-2 text-center rounded-sm border shrink-0 transition-all cursor-pointer ${
                            activeMobileTab === idx.toString()
                              ? "bg-[#004491] border-[#00d2ff] text-white shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                              : s.size
                                ? "bg-[#080808] border-emerald-500/40 text-emerald-400"
                                : "bg-[#080808] border-outline-variant text-zinc-400 hover:text-white"
                          }`}
                        >
                          <div className="truncate text-[11px] font-bold">
                            {s.memberName?.split(" ")[0] || `#${idx + 1}`}
                          </div>
                          <div className="text-[9px] font-mono mt-0.5 truncate">
                            {s.size ? s.size : "—"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── SUB-VIEW 1: SHOW ALL TAB ── */}
                {shirts.length > 1 && activeMobileTab === "all" ? (
                  <div className="space-y-4 mb-5">
                    {shirts.map((shirt, idx) => {
                      return (
                        <div
                          key={shirt.memberId || idx}
                          className="bg-[#0b0c16] border border-outline-variant p-4 rounded-sm relative overflow-hidden transition-all"
                        >
                          <div
                            className={`absolute top-0 left-0 right-0 h-[2px] ${
                              shirt.size ? "bg-emerald-500" : "bg-[#004491]"
                            }`}
                          />

                          {/* Student Info Top */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-black uppercase tracking-wide">
                                  {shirt.memberName}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#004491]/20 text-[#00d2ff] border border-[#004491]/40">
                                  {shirt.memberRole || `Shirt #${idx + 1}`}
                                </span>
                              </div>
                            </div>

                            {shirt.size ? (
                              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                                Size {shirt.size} ✓
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded animate-pulse">
                                Size Required
                              </span>
                            )}
                          </div>

                          {/* Size Selection Grid */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold">
                                Choose Size
                              </p>
                              {shirt.size && (
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {SIZE_MEASUREMENTS[shirt.size]}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-4 gap-1.5">
                              {SIZES.map((sizeId) => {
                                const isSelected = shirt.size === sizeId;
                                return (
                                  <button
                                    key={sizeId}
                                    type="button"
                                    onClick={() => handleSizeSelect(idx, sizeId)}
                                    className={`py-2 px-1 text-center rounded border transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-[#00d2ff] border-[#00d2ff] text-black font-black shadow-[0_0_10px_rgba(0,210,255,0.5)]"
                                        : "bg-[#080808] border-outline-variant text-zinc-300 hover:border-zinc-500 hover:text-white font-bold"
                                    }`}
                                  >
                                    <div className="text-xs">{sizeId}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/* ── SUB-VIEW 2: INDIVIDUAL STUDENT FOCUSED VIEW ── */}
                {(shirts.length === 1 || activeMobileTab !== "all") && (
                  <div>
                    {(() => {
                      const targetIdx = shirts.length === 1 ? 0 : Number(activeMobileTab);
                      const shirt = shirts[targetIdx];
                      if (!shirt) return null;

                      return (
                        <div className="bg-[#0b0c16] border border-outline-variant p-4 sm:p-5 mb-5 relative overflow-hidden rounded-sm">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#004491] via-[#00d2ff] to-[#004491]" />
                          
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-white text-base font-black uppercase tracking-wider">
                                  {shirt.memberName}
                                </h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#004491]/20 text-[#00d2ff] border border-[#004491]/40">
                                  {shirt.memberRole || `Shirt #${targetIdx + 1}`}
                                </span>
                              </div>
                              <p className="text-zinc-500 text-xs mt-0.5">
                                Select T-Shirt Size
                              </p>
                            </div>

                            {shirt.size && (
                              <div className="text-right">
                                <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Size</span>
                                <span className="text-lg font-black text-[#00d2ff] font-mono">
                                  {shirt.size}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Size Options Grid */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                                Choose Size
                              </p>
                              {shirt.size && (
                                <span className="text-[11px] font-bold text-emerald-400">
                                  Selected: {shirt.size} ✓
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                                        setTimeout(() => setActiveMobileTab((targetIdx + 1).toString()), 250);
                                      }
                                    }}
                                    className={`p-3 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-[#004491] border-[#00d2ff] text-white shadow-[0_0_12px_rgba(0,210,255,0.5)]"
                                        : "bg-[#080808] border-outline-variant text-zinc-300 hover:border-zinc-500 hover:text-white"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between w-full mb-1">
                                      <span className="text-base font-black tracking-wide">{sizeId}</span>
                                      {isSelected ? (
                                        <span className="material-symbols-outlined text-white text-base">check_circle</span>
                                      ) : (
                                        <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 inline-block" />
                                      )}
                                    </div>
                                    {measurement && (
                                      <span className={`text-[10px] font-mono ${isSelected ? "text-zinc-200" : "text-zinc-500"}`}>
                                        {measurement}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Nav buttons */}
                            {shirts.length > 1 && (
                              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  disabled={targetIdx === 0}
                                  onClick={() => setActiveMobileTab((targetIdx - 1).toString())}
                                  className="px-3 py-1.5 text-xs font-bold uppercase border border-outline-variant text-zinc-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed flex items-center gap-1 rounded-sm cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                                  Prev
                                </button>

                                <span className="text-[11px] text-zinc-500">
                                  {targetIdx + 1} of {shirts.length}
                                </span>

                                <button
                                  type="button"
                                  disabled={targetIdx === shirts.length - 1}
                                  onClick={() => setActiveMobileTab((targetIdx + 1).toString())}
                                  className="px-3 py-1.5 text-xs font-bold uppercase border border-outline-variant text-zinc-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed flex items-center gap-1 rounded-sm cursor-pointer"
                                >
                                  Next
                                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  DESKTOP MATRIX VIEW (hidden md:block)
                 ════════════════════════════════════════════════════════════════ */}
              <div className="hidden md:block">
                {/* Matrix Table with Sticky Size Column */}
                <div className="overflow-x-auto border border-outline-variant bg-[#0b0c16] rounded-sm">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant bg-[#080808]">
                        <th
                          className={`p-4 text-left text-zinc-400 text-xs font-bold uppercase tracking-widest sticky left-0 bg-[#080808] z-10 border-r border-outline-variant shadow-[4px_0_10px_rgba(0,0,0,0.6)] ${
                            shirts.length === 1 ? "w-2/5 min-w-[160px]" : "min-w-[140px]"
                          }`}
                        >
                          Size
                        </th>
                        {shirts.map((s, idx) => (
                          <th
                            key={s.memberId || idx}
                            className={`p-3 border-l border-outline-variant ${
                              shirts.length === 1 ? "w-3/5" : "min-w-[120px]"
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-white text-xs font-black tracking-wide truncate max-w-[140px]">
                                {s.memberName}
                              </span>
                              <span className="text-[9px] uppercase tracking-widest text-[#5b9aff] mt-0.5 font-bold">
                                {s.memberRole || `Shirt #${idx + 1}`}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60">
                      {TABLE_SIZE_ROWS.map((row) => (
                        <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3.5 text-left text-xs font-bold uppercase tracking-wider text-zinc-200 sticky left-0 bg-[#080808] z-10 border-r border-outline-variant shadow-[4px_0_10px_rgba(0,0,0,0.6)]">
                            <div className="flex items-center justify-between gap-2">
                              <span>
                                {row.label}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono font-normal">
                                {SIZE_MEASUREMENTS[row.id]}
                              </span>
                            </div>
                          </td>

                          {shirts.map((shirt, idx) => {
                            const isSelected = shirt.size === row.id;

                            return (
                              <td
                                key={shirt.memberId || idx}
                                className={`p-3 border-l border-outline-variant transition-colors ${
                                  isSelected
                                    ? "bg-[#004491]/20 cursor-pointer"
                                    : "hover:bg-[#004491]/10 cursor-pointer"
                                }`}
                                onClick={() => handleSizeSelect(idx, row.id)}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <div
                                    className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-all ${
                                      isSelected
                                        ? "bg-[#004491] border-[#00d2ff] shadow-[0_0_8px_rgba(0,210,255,0.6)]"
                                        : "border-zinc-600 bg-[#080808] hover:border-zinc-400"
                                    }`}
                                  >
                                    {isSelected && (
                                      <span className="material-symbols-outlined text-white text-sm font-black">
                                        check
                                      </span>
                                    )}
                                  </div>
                                  {shirts.length === 1 && isSelected && (
                                    <span className="text-xs font-bold text-[#00d2ff] hidden sm:inline">
                                      Selected
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected Sizes Summary */}
                <div className="mt-5 pt-4 border-t border-zinc-800">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">
                    Current Selection:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {shirts.map((s, idx) => (
                      <div
                        key={s.memberId || idx}
                        className={`text-xs px-3 py-1.5 rounded border flex items-center gap-2 ${
                          s.size
                            ? "bg-[#004491]/15 border-[#004491]/50 text-white"
                            : "bg-red-950/30 border-red-500/40 text-red-300"
                        }`}
                      >
                        <span className="font-bold">{s.memberName}:</span>
                        {s.size ? (
                          <span className="font-bold text-[#00d2ff] uppercase">Size {s.size}</span>
                        ) : (
                          <span className="text-red-400 text-[11px] font-semibold italic">Choose size</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* ════════════════════════════════════════════════════════════════
              STEP 4: PAYMENT DETAILS & BANK SLIP UPLOAD
             ════════════════════════════════════════════════════════════════ */}
          {selectedStudents.length > 0 && (
            <div className="relative bg-[#080808] border border-outline-variant p-6 sm:p-8">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#004491]" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-full bg-[#004491]/20 flex items-center justify-center text-[#5b9aff] text-xs font-black">
                  4
                </div>
                <h2 className="text-white text-base font-bold uppercase tracking-wider">
                  Payment Details &amp; Slip Upload
                </h2>
              </div>

              {/* Bank Account Details Card */}
              <div className="mb-6 bg-[#0b0c16] border border-outline-variant p-5 rounded-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800 mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#5b9aff] font-bold">
                      Direct Bank Transfer / Deposit
                    </p>
                    <h3 className="text-white text-base font-bold mt-0.5">People&apos;s Bank</h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">Total Payable</p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-400">
                      LKR {(shirts.length * PRICE_PER_SHIRT).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      ({shirts.length} × LKR {PRICE_PER_SHIRT.toLocaleString()})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-0.5">Account Name</p>
                    <p className="text-zinc-200 font-semibold">Electronics and Computer Science Student Club</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-0.5">Account Number</p>
                    <div className="flex items-center gap-2">
                      <p className="text-zinc-200 font-mono font-bold text-sm">055200290051008</p>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="text-[10px] text-[#5b9aff] hover:text-white underline cursor-pointer"
                      >
                        {copiedAccount ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-0.5">Branch</p>
                    <p className="text-zinc-200 font-semibold">Kelaniya Branch</p>
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="mb-6">
                <label className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                  Upload Payment Slip <span className="text-red-400">*</span>
                </label>

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed p-6 sm:p-8 text-center rounded-sm transition-all ${
                    dragOver
                      ? "border-[#00d2ff] bg-[#004491]/20"
                      : paymentSlip
                        ? "border-emerald-500/60 bg-emerald-950/20"
                        : "border-outline-variant hover:border-zinc-500 bg-[#0b0c16]/50"
                  }`}
                >
                  {paymentSlip ? (
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400 text-3xl">task</span>
                      <div>
                        <p className="text-white text-sm font-bold">{paymentSlip.name}</p>
                        <p className="text-zinc-500 text-xs">
                          {(paymentSlip.size / 1024 / 1024).toFixed(2)} MB · Slip attached
                        </p>
                      </div>
                      {preview && (
                        <div className="mt-2 max-w-xs max-h-48 overflow-hidden rounded border border-zinc-800">
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
                      <span className="material-symbols-outlined text-zinc-500 text-4xl mb-2">cloud_upload</span>
                      <p className="text-white text-sm font-bold mb-1">
                        Drag and drop your slip here, or browse
                      </p>
                      <p className="text-zinc-500 text-xs mb-4">
                        Supported: JPG, PNG, WebP, PDF (Max 5MB)
                      </p>
                      <label className="inline-block px-5 py-2.5 bg-[#004491] hover:bg-[#002d5e] text-white text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors rounded-sm">
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
                <label className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                  Bank Reference / Transaction ID <span className="text-zinc-600">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN987654321 or Deposit Number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full bg-[#0b0c16] border border-outline-variant text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors"
                />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              SUBMIT BUTTON
             ════════════════════════════════════════════════════════════════ */}
          {selectedStudents.length > 0 && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#004491] hover:bg-[#003570] active:scale-[0.99] text-white text-sm uppercase tracking-[0.2em] font-black transition-all shadow-[0_0_20px_rgba(0,68,145,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer rounded-sm"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Team Order...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>Submit Team Order ({shirts.length} {shirts.length === 1 ? "Shirt" : "Shirts"} · LKR {(shirts.length * PRICE_PER_SHIRT).toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      )}

    </div>
  );
}
