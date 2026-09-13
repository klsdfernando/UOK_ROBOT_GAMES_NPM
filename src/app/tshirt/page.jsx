"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Size definitions per user instructions
const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

// All unique rows shown in the table matrix
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
  "XS": 'Chest 36" · L 26"',
  "S": 'Chest 38" · L 27"',
  "M": 'Chest 40" · L 28"',
  "L": 'Chest 42" · L 29"',
  "XL": 'Chest 44" · L 30"',
  "2XL": 'Chest 46" · L 31"',
  "3XL": 'Chest 48" · L 32"',
};

const PRICE_PER_SHIRT = 1900; // LKR

export default function TshirtPage() {
  const [name, setName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [shirtCount, setShirtCount] = useState(1);

  // Array of shirt configurations: [{ category: 'Normal Size' | 'Kids Size', size: '' }]
  const [shirts, setShirts] = useState([
    { category: "Normal Size", size: "" },
  ]);

  // Mobile active tab: "0", "1"... for specific shirt or "all" to show all shirts
  const [activeMobileTab, setActiveMobileTab] = useState("0");

  const [paymentSlip, setPaymentSlip] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Handle shirt count change (min 1, max 5)
  const handleCountChange = (count) => {
    const validCount = Math.max(1, Math.min(5, Number(count)));
    setShirtCount(validCount);
    if (activeMobileTab !== "all" && Number(activeMobileTab) >= validCount) {
      setActiveMobileTab(validCount === 1 ? "0" : "all");
    }
    setShirts((prev) => {
      const updated = [];
      for (let i = 0; i < validCount; i++) {
        if (prev[i]) {
          updated.push(prev[i]);
        } else {
          updated.push({ category: "Normal Size", size: "" });
        }
      }
      return updated;
    });
    setError("");
  };

  // Update category for a specific shirt
  const handleCategoryChange = (index, category) => {
    setShirts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], category: "Adult Size" };
      return updated;
    });
  };

  // Update size for a specific shirt
  const handleSizeSelect = (shirtIndex, sizeId) => {
    const shirt = shirts[shirtIndex];
    if (!shirt) return;

    setShirts((prev) => {
      const updated = [...prev];
      updated[shirtIndex] = { ...updated[shirtIndex], category: "Adult Size", size: sizeId };
      return updated;
    });
    setError("");
  };

  // Handle file select
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

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!whatsappNumber.trim()) {
      setError("Please enter your WhatsApp number.");
      return;
    }

    // Check all shirts have a size selected
    for (let i = 0; i < shirts.length; i++) {
      if (!shirts[i].size) {
        setError(`Please select a size for Shirt #${i + 1} in the table.`);
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
      formData.append("name", name.trim());
      formData.append("whatsappNumber", whatsappNumber.trim());
      formData.append("shirtCount", shirtCount.toString());
      formData.append("shirts", JSON.stringify(shirts));
      formData.append("referenceNumber", referenceNumber.trim());
      formData.append("paymentSlip", paymentSlip);

      const res = await fetch("/api/tshirt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setOrderResult(data);
      } else {
        setError(data.message || "Failed to submit order. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setWhatsappNumber("");
    setShirtCount(1);
    setShirts([{ category: "Normal Size", size: "" }]);
    setActiveMobileTab("0");
    setPaymentSlip(null);
    setPreview(null);
    setReferenceNumber("");
    setError("");
    setOrderResult(null);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col selection:bg-[#004491] selection:text-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Badge & Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#004491]/15 border border-[#004491]/40 rounded-full text-[#5b9aff] text-[11px] uppercase tracking-widest font-bold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse" />
              Official Merchandise Pre-Order
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-wider mb-4">
              UOK Robot Games <span className="text-[#00d2ff]">2K26</span> T-Shirt
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Gear up with the official arena jersey. Complete your details below to order up to 5 shirts per form with custom sizing.
            </p>

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowSizeChart(!showSizeChart)}
                className="text-xs uppercase tracking-widest font-bold text-[#5b9aff] hover:text-white flex items-center gap-1.5 border border-[#004491]/30 hover:border-[#004491] bg-[#004491]/10 px-4 py-2 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-sm">straighten</span>
                {showSizeChart ? "Hide Size Chart" : "View Size Measurements"}
              </button>
            </div>
          </div>

          {/* Size Chart Modal / Drawer */}
          {showSizeChart && (
            <div className="mb-10 bg-[#080808] border border-outline-variant p-6 relative rounded-sm overflow-hidden animate-fadeIn">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#004491] via-[#00d2ff] to-[#004491]" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00d2ff] text-xl">straighten</span>
                  <h3 className="text-white text-sm font-bold uppercase tracking-wider">T-Shirt Size Chart (Inches)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSizeChart(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="max-w-md mx-auto">
                <p className="text-[#00d2ff] text-xs font-bold uppercase tracking-widest mb-2 text-center">Size Measurements (Inches)</p>
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

          {/* Success Screen */}
          {orderResult ? (
            <div className="relative bg-[#080808] border border-outline-variant p-8 sm:p-12 text-center rounded-sm">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500" />
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
                Order Received!
              </h2>
              <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Thank you, <strong className="text-white">{orderResult.order?.name}</strong>. Your T-shirt pre-order has been registered with Order ID:
              </p>

              <div className="inline-block bg-[#0b0c16] border border-[#004491]/40 px-6 py-3 rounded mb-8">
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Order Reference ID</p>
                <p className="text-lg font-mono font-bold text-[#00d2ff]">{orderResult.orderId}</p>
              </div>

              {/* Order breakdown */}
              <div className="bg-[#0b0c16] border border-outline-variant p-5 max-w-lg mx-auto text-left mb-8">
                <p className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-3 border-b border-zinc-800 pb-2">
                  Order Summary ({orderResult.order?.shirtCount} {orderResult.order?.shirtCount === 1 ? "Shirt" : "Shirts"})
                </p>
                <div className="space-y-2 text-xs">
                  {orderResult.order?.shirts?.map((s, i) => (
                    <div key={i} className="flex justify-between items-center py-1">
                      <span className="text-zinc-300 font-semibold">Shirt #{i + 1}</span>
                      <span className="text-[#00d2ff] font-mono bg-[#004491]/15 px-2 py-0.5 rounded border border-[#004491]/30">
                        {s.category} · Size {s.size}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-zinc-800 pt-2 flex justify-between items-center text-sm font-bold text-white mt-2">
                    <span>Total Amount</span>
                    <span className="text-emerald-400">LKR {(orderResult.order?.shirtCount * PRICE_PER_SHIRT).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-[#004491] text-white text-xs uppercase tracking-widest font-bold hover:bg-[#002d5e] border border-[#004491] transition-all"
                >
                  Place Another Order
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 border border-outline-variant text-zinc-300 hover:text-white hover:border-zinc-500 text-xs uppercase tracking-widest font-bold transition-all"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          ) : (
            /* Order Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-950/40 border border-red-500/50 p-4 rounded-sm flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-400 text-lg shrink-0 mt-0.5">error</span>
                  <p className="text-red-200 text-xs leading-relaxed">{error}</p>
                </div>
              )}

              {/* Step 1: Customer Contact Information */}
              <div className="relative bg-[#080808] border border-outline-variant p-6 sm:p-8">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#004491]" />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-7 h-7 rounded-full bg-[#004491]/20 flex items-center justify-center text-[#5b9aff] text-xs font-black">
                    1
                  </div>
                  <h2 className="text-white text-base font-bold uppercase tracking-wider">
                    Contact Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sushan Fernando"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(""); }}
                      className="w-full bg-[#0b0c16] border border-outline-variant text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-zinc-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                      WhatsApp Number <span className="text-red-400">*</span>
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
                      className="w-full bg-[#0b0c16] border border-outline-variant text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-zinc-700"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shirt Quantity Selection */}
              <div className="relative bg-[#080808] border border-outline-variant p-6 sm:p-8">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#004491]" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#004491]/20 flex items-center justify-center text-[#5b9aff] text-xs font-black">
                      2
                    </div>
                    <h2 className="text-white text-base font-bold uppercase tracking-wider">
                      How Many Shirts Need?
                    </h2>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 bg-[#004491]/10 text-[#5b9aff] border border-[#004491]/30">
                    Max 5 per form
                  </span>
                </div>

                <p className="text-zinc-400 text-xs mb-6">
                  Select how many shirts you want to order. Changing this count dynamically updates the configuration table below.
                </p>

                <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => handleCountChange(cnt)}
                      className={`py-2.5 sm:py-3 px-1 text-center border font-bold uppercase transition-all duration-200 rounded-sm cursor-pointer ${
                        shirtCount === cnt
                          ? "bg-[#004491] border-[#00d2ff] text-white shadow-[0_0_15px_rgba(0,68,145,0.4)]"
                          : "bg-[#0b0c16] border-outline-variant text-zinc-400 hover:text-white hover:border-zinc-600"
                      }`}
                    >
                      <div className="text-sm sm:text-base font-black">{cnt}</div>
                      <div className="text-[9px] sm:text-[10px] font-semibold text-zinc-400">
                        {cnt === 1 ? "Shirt" : "Shirts"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Size & Category Selection Table (Matching Provided Matrix Grid) */}
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
                        T-Shirt Category &amp; Size Selection
                      </h2>
                      <p className="text-zinc-500 text-[11px] mt-0.5">
                        Configure Category and Size for your {shirtCount} {shirtCount === 1 ? "shirt" : "shirts"}
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
                    MOBILE VIEW (Strictly Simple Touch View on Mobile: block md:hidden)
                   ════════════════════════════════════════════════════════════════ */}
                <div className="block md:hidden">
                  
                  {/* If more than 1 shirt, provide Dropdown Menu & Tab Bar */}
                  {shirtCount > 1 && (
                    <div className="mb-4 bg-[#0b0c16] border border-outline-variant p-3.5 sm:p-4 rounded-sm">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                          {activeMobileTab === "all"
                            ? `All Shirts Overview (${shirtCount} Total)`
                            : `Configuring Shirt #${Number(activeMobileTab) + 1} of ${shirtCount}`}
                        </label>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          shirts.filter((s) => s.size).length === shirtCount
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        }`}>
                          {shirts.filter((s) => s.size).length} of {shirtCount} Sized
                        </span>
                      </div>

                      {/* Dropdown Menu */}
                      <div className="relative mb-3">
                        <select
                          value={activeMobileTab}
                          onChange={(e) => setActiveMobileTab(e.target.value)}
                          className="w-full bg-[#080808] border border-outline-variant text-white text-xs sm:text-sm font-bold px-3.5 py-2.5 appearance-none focus:outline-none focus:border-[#00d2ff] transition-colors cursor-pointer rounded-sm"
                        >
                          <option value="all">
                            Show All Shirts ({shirtCount}) — Tab Overview &amp; Sizing
                          </option>
                          {shirts.map((s, idx) => (
                            <option key={idx} value={idx.toString()}>
                              Shirt #{idx + 1} — {s.category} {s.size ? `[Size ${s.size}] ✓` : "(Size required)"}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-lg">
                          expand_more
                        </span>
                      </div>

                      {/* Quick Shirt Tabs */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {/* Tab to Show All */}
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

                        {/* Individual Shirt Tabs */}
                        {shirts.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveMobileTab(idx.toString())}
                            className={`flex-1 min-w-[62px] py-2 px-1 text-center text-xs font-bold uppercase transition-all rounded-sm border shrink-0 cursor-pointer ${
                              activeMobileTab === idx.toString()
                                ? "bg-[#004491] border-[#00d2ff] text-white shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                                : s.size
                                  ? "bg-[#080808] border-emerald-500/40 text-emerald-400"
                                  : "bg-[#080808] border-outline-variant text-zinc-400 hover:text-white"
                            }`}
                          >
                            <div>#{idx + 1}</div>
                            <div className="text-[9px] font-mono mt-0.5 truncate">
                              {s.size ? s.size : "—"}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── SUB-VIEW 1: SHOW ALL TAB (All shirts stacked in clean cards) ── */}
                  {shirtCount > 1 && activeMobileTab === "all" ? (
                    <div className="space-y-4 mb-5">
                      {/* Overall Progress Banner */}
                      <div className="bg-[#0b0c16] border border-outline-variant p-3.5 rounded-sm flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">
                            All {shirtCount} Shirts Overview
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            Configure category &amp; size for each shirt below
                          </p>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                          shirts.filter((s) => s.size).length === shirtCount
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        }`}>
                          {shirts.filter((s) => s.size).length}/{shirtCount} Sized
                        </span>
                      </div>

                      {/* Stacked Shirt Cards */}
                      {shirts.map((shirt, idx) => {
                        return (
                          <div
                            key={idx}
                            className="bg-[#0b0c16] border border-outline-variant p-4 rounded-sm relative overflow-hidden transition-all"
                          >
                            <div
                              className={`absolute top-0 left-0 right-0 h-[2px] ${
                                shirt.size ? "bg-emerald-500" : "bg-[#004491]"
                              }`}
                            />

                            {/* Shirt Top Row */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-black uppercase tracking-wide">
                                  Shirt #{idx + 1}
                                </span>
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

                            {/* Size Selection Pills */}
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

                  {/* ── SUB-VIEW 2: INDIVIDUAL SHIRT FOCUSED VIEW ── */}
                  {(shirtCount === 1 || activeMobileTab !== "all") && (
                    <div>
                      {(() => {
                        const targetIdx = shirtCount === 1 ? 0 : Number(activeMobileTab);
                        const shirt = shirts[targetIdx];
                        if (!shirt) return null;

                        return (
                          <div className="bg-[#0b0c16] border border-outline-variant p-4 sm:p-5 mb-5 relative overflow-hidden rounded-sm">
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#004491] via-[#00d2ff] to-[#004491]" />
                            
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-white text-base font-black uppercase tracking-wider">
                                    Shirt #{targetIdx + 1}
                                  </h3>
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
                                        // Auto advance to next shirt if available and not yet set
                                        if (targetIdx < shirtCount - 1 && !shirts[targetIdx + 1]?.size) {
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

                              {/* Navigation Buttons for Multiple Shirts */}
                              {shirtCount > 1 && (
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

                                  <button
                                    type="button"
                                    onClick={() => setActiveMobileTab("all")}
                                    className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#00d2ff] bg-[#004491]/15 hover:bg-[#004491]/30 border border-[#004491]/40 rounded-sm flex items-center gap-1 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-xs">view_agenda</span>
                                    Show All
                                  </button>

                                  <button
                                    type="button"
                                    disabled={targetIdx === shirtCount - 1}
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

                      {/* Mobile Review Checklist when in focused view */}
                      {shirtCount > 1 && (
                        <div className="mb-5 bg-[#080808] border border-outline-variant p-3.5 rounded-sm">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                              Configured Shirts:
                            </p>
                            <button
                              type="button"
                              onClick={() => setActiveMobileTab("all")}
                              className="text-[10px] text-[#00d2ff] hover:underline font-bold uppercase"
                            >
                              Show All Shirts →
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {shirts.map((s, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveMobileTab(idx.toString())}
                                className={`w-full text-left p-2.5 rounded text-xs flex items-center justify-between border transition-all cursor-pointer ${
                                  activeMobileTab === idx.toString()
                                    ? "border-[#00d2ff]/60 bg-[#004491]/20"
                                    : "border-zinc-800/80 bg-[#0b0c16] hover:border-zinc-700"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-zinc-200 font-bold">Shirt #{idx + 1}</span>
                                  <span className="text-zinc-500 text-[11px]">({s.category})</span>
                                </div>
                                {s.size ? (
                                  <span className="text-xs font-mono font-bold text-[#00d2ff] bg-[#004491]/20 px-2 py-0.5 rounded border border-[#004491]/30">
                                    Size {s.size} ✓
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-amber-400 font-semibold italic">
                                    Tap to choose size
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* ════════════════════════════════════════════════════════════════
                    DESKTOP MATRIX TABLE VIEW (Strictly hidden on mobile: hidden md:block)
                   ════════════════════════════════════════════════════════════════ */}
                <div className="hidden md:block">

                  {/* Matrix Table with Sticky Size Column */}
                  <div className="overflow-x-auto border border-outline-variant bg-[#0b0c16] rounded-sm">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant bg-[#080808]">
                          <th className={`p-4 text-left text-zinc-400 text-xs font-bold uppercase tracking-widest sticky left-0 bg-[#080808] z-10 border-r border-outline-variant shadow-[4px_0_10px_rgba(0,0,0,0.6)] ${shirts.length === 1 ? 'w-1/2 sm:w-2/5 min-w-[160px]' : 'min-w-[140px]'}`}>
                            Size
                          </th>
                          {shirts.map((s, idx) => (
                            <th key={idx} className={`p-4 border-l border-outline-variant ${shirts.length === 1 ? 'w-1/2 sm:w-3/5' : 'min-w-[90px]'}`}>
                              <div className="flex flex-col items-center">
                                <span className="text-white text-base font-black tracking-wide">
                                  {shirts.length === 1 ? "Shirt #1 Selection" : `Shirt #${idx + 1}`}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/60">
                        {TABLE_SIZE_ROWS.map((row) => (
                          <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* Sticky Row label on the left */}
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

                            {/* Columns 1..N */}
                            {shirts.map((shirt, idx) => {
                              const isSelected = shirt.size === row.id;

                              return (
                                <td
                                  key={idx}
                                  title={`Select ${row.label} for Shirt #${idx + 1}`}
                                  className={`p-3 border-l border-outline-variant transition-colors ${
                                    isSelected
                                      ? "bg-[#004491]/20 cursor-pointer"
                                      : "hover:bg-[#004491]/10 cursor-pointer"
                                  }`}
                                  onClick={() => {
                                    handleSizeSelect(idx, row.id);
                                  }}
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

                  {/* Desktop Selected Sizes Summary Pills */}
                  <div className="mt-5 pt-4 border-t border-zinc-800">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">
                      Current Selection:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {shirts.map((s, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-3 py-1.5 rounded border flex items-center gap-2 ${
                            s.size
                              ? "bg-[#004491]/15 border-[#004491]/50 text-white"
                              : "bg-red-950/30 border-red-500/40 text-red-300"
                          }`}
                        >
                          <span className="font-bold">Shirt #{idx + 1}:</span>
                          {s.size ? (
                            <span className="font-bold text-[#00d2ff] uppercase">Size {s.size}</span>
                          ) : (
                            <span className="text-red-400 text-[11px] font-semibold italic">Select size in table</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Step 4: Payment Instructions & File Upload */}
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

                {/* Bank Account Info Card */}
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
                      <p className="text-xl font-black text-emerald-400">
                        LKR {(shirtCount * PRICE_PER_SHIRT).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-zinc-500">({shirtCount} × LKR {PRICE_PER_SHIRT.toLocaleString()})</p>
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
                          className="text-[10px] text-[#5b9aff] hover:text-white underline"
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

                {/* Upload Box */}
                <div className="mb-6">
                  <label className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-3">
                    Upload Payment Slip / Receipt <span className="text-red-400">*</span>
                  </label>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("tshirt-slip-upload")?.click()}
                    className={`relative cursor-pointer border-2 border-dashed p-8 transition-all duration-200 text-center rounded-sm ${
                      dragOver
                        ? "border-[#00d2ff] bg-[#004491]/10"
                        : paymentSlip
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-outline-variant hover:border-zinc-500 bg-[#0b0c16]"
                    }`}
                  >
                    <input
                      id="tshirt-slip-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    />

                    {paymentSlip ? (
                      <div className="flex flex-col items-center gap-3">
                        {preview ? (
                          <img
                            src={preview}
                            alt="Payment Slip Preview"
                            className="max-h-48 max-w-full object-contain border border-outline-variant rounded"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-emerald-400 text-5xl">
                            description
                          </span>
                        )}
                        <div>
                          <p className="text-white text-sm font-semibold">{paymentSlip.name}</p>
                          <p className="text-zinc-500 text-[10px] mt-0.5">
                            {(paymentSlip.size / 1024).toFixed(1)} KB · Click or drop another to replace
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#004491]/10 border border-[#004491]/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#5b9aff] text-2xl">
                            cloud_upload
                          </span>
                        </div>
                        <div>
                          <p className="text-zinc-300 text-sm font-semibold">
                            Drag &amp; drop your payment receipt here
                          </p>
                          <p className="text-zinc-500 text-[10px] mt-1">
                            or click to browse files · JPG, PNG, WebP, PDF (max 5MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reference Number Field */}
                <div>
                  <label className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                    Payment Reference / Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-984210384 or Deposit Slip Ref"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full bg-[#0b0c16] border border-outline-variant text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] transition-colors placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* Submit Button & Summary Bar */}
              <div className="bg-[#080808] border border-outline-variant p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-bold">
                    Total: {shirtCount} {shirtCount === 1 ? "T-Shirt" : "T-Shirts"} · LKR {(shirtCount * PRICE_PER_SHIRT).toLocaleString()}
                  </p>
                  <p className="text-zinc-500 text-xs">
                    Please verify sizes and contact information before submitting.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#004491] text-white text-xs uppercase tracking-widest font-black hover:bg-[#002d5e] border border-[#004491] hover:shadow-[0_0_20px_rgba(0,68,145,0.4)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Order...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      Submit T-Shirt Pre-Order
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
