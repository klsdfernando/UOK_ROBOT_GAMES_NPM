"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      setError("Please select a JPG, PNG, WebP, or PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be 5MB or less.");
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
      setError("Please enter your WhatsApp contact number.");
      return;
    }

    // Check all shirts have a size selected
    for (let i = 0; i < shirts.length; i++) {
      if (!shirts[i].size) {
        setError(`Please pick a size for Shirt ${i + 1}.`);
        return;
      }
    }

    if (!paymentSlip) {
      setError("Please attach your bank transfer receipt or deposit slip.");
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
        setError(data.message || "Could not submit your order. Please try again.");
      }
    } catch {
      setError("Something went wrong while placing your order. Please try again.");
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
    <div className="min-h-screen bg-[#050507] text-zinc-200 flex flex-col selection:bg-[#004491] selection:text-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Header & Intro */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00d2ff] bg-[#004491]/20 border border-[#004491]/40 px-3 py-1 rounded-full inline-block mb-3">
              Official Merchandise
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
              Pre-Order Your UOK Robot Games 2K26 T-Shirt
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Grab the official event t-shirt for <strong>Rs. 1,900</strong>. Pick your sizes, upload your payment slip, and collect your order on competition day.
            </p>

          </div>

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
            <>
              {/* Official Merchandise Showcase: Flyer & Size Chart (Always Visible) */}
              <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-5 sm:p-7 shadow-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
                  
                  {/* Left Column: Official Event Flyer */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="relative group w-full max-w-[320px] sm:max-w-[360px] rounded-2xl overflow-hidden border border-zinc-700/80 bg-[#12131f] shadow-lg">
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
                    <div className="mt-3 w-full max-w-[320px] sm:max-w-[360px] flex items-center justify-between gap-2 px-0.5">
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

                    <div className="border border-zinc-800/90 rounded-xl overflow-hidden shadow-inner">
                      <table className="w-full text-xs">
                        <thead className="bg-[#12131f] text-zinc-400 uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-zinc-800">
                          <tr>
                            <th className="py-2.5 px-4 text-left font-bold text-white">Size</th>
                            <th className="py-2.5 px-4 text-center font-semibold text-zinc-300">Chest (in)</th>
                            <th className="py-2.5 px-4 text-center font-semibold text-zinc-300">Length (in)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/70 bg-[#07080f]/80 text-zinc-300">
                          <tr className="hover:bg-[#12131f]/60 transition-colors">
                            <td className="py-2 px-4 text-left font-bold text-white">XS</td>
                            <td className="py-2 px-4 text-center font-medium">36&quot;</td>
                            <td className="py-2 px-4 text-center font-medium">26&quot;</td>
                          </tr>
                          <tr className="hover:bg-[#12131f]/60 transition-colors">
                            <td className="py-2 px-4 text-left font-bold text-white">S</td>
                            <td className="py-2 px-4 text-center font-medium">38&quot;</td>
                            <td className="py-2 px-4 text-center font-medium">27&quot;</td>
                          </tr>
                          <tr className="hover:bg-[#12131f]/60 transition-colors">
                            <td className="py-2 px-4 text-left font-bold text-white">M</td>
                            <td className="py-2 px-4 text-center font-medium">40&quot;</td>
                            <td className="py-2 px-4 text-center font-medium">28&quot;</td>
                          </tr>
                          <tr className="hover:bg-[#12131f]/60 transition-colors">
                            <td className="py-2 px-4 text-left font-bold text-white">L</td>
                            <td className="py-2 px-4 text-center font-medium">42&quot;</td>
                            <td className="py-2 px-4 text-center font-medium">29&quot;</td>
                          </tr>
                          <tr className="hover:bg-[#12131f]/60 transition-colors">
                            <td className="py-2 px-4 text-left font-bold text-white">XL</td>
                            <td className="py-2 px-4 text-center font-medium">44&quot;</td>
                            <td className="py-2 px-4 text-center font-medium">30&quot;</td>
                          </tr>
                          <tr className="hover:bg-[#12131f]/60 transition-colors">
                            <td className="py-2 px-4 text-left font-bold text-white">2XL</td>
                            <td className="py-2 px-4 text-center font-medium">46&quot;</td>
                            <td className="py-2 px-4 text-center font-medium">31&quot;</td>
                          </tr>
                          <tr className="hover:bg-[#12131f]/60 transition-colors">
                            <td className="py-2 px-4 text-left font-bold text-white">3XL</td>
                            <td className="py-2 px-4 text-center font-medium">48&quot;</td>
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

              {/* Order Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-950/40 border border-red-500/50 p-4 rounded-sm flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-400 text-lg shrink-0 mt-0.5">error</span>
                  <p className="text-red-200 text-xs leading-relaxed">{error}</p>
                </div>
              )}

              {/* Step 1: Customer Contact Information */}
              <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="mb-5 pb-3 border-b border-zinc-800/70">
                  <h2 className="text-white text-base sm:text-lg font-bold">
                    1. Contact Details
                  </h2>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    We will notify you via WhatsApp when your order is ready for pickup.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-zinc-300 text-xs font-semibold mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kasun Fernando"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(""); }}
                      className="w-full bg-[#12131f] border border-zinc-700/80 rounded-xl text-zinc-100 text-sm px-4 py-2.5 focus:outline-none focus:border-[#00d2ff] transition-colors placeholder:text-zinc-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 text-xs font-semibold mb-2">
                      WhatsApp Number <span className="text-red-400">*</span>
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
                      className="w-full bg-[#12131f] border border-zinc-700/80 rounded-xl text-zinc-100 text-sm px-4 py-2.5 focus:outline-none focus:border-[#00d2ff] transition-colors placeholder:text-zinc-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shirt Quantity Selection */}
              <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800/70">
                  <div>
                    <h2 className="text-white text-base sm:text-lg font-bold">
                      2. Number of T-Shirts
                    </h2>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      How many shirts would you like to order today?
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-zinc-400 self-start sm:self-auto bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                    Up to 5 shirts
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => handleCountChange(cnt)}
                      className={`py-3 px-2 text-center rounded-xl font-semibold transition-all duration-150 cursor-pointer ${
                        shirtCount === cnt
                          ? "bg-[#004491] text-white border border-[#00d2ff]/60 shadow-[0_0_15px_rgba(0,210,255,0.25)]"
                          : "bg-[#12131f] border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      <div className="text-base font-bold">{cnt}</div>
                      <div className="text-[11px] text-zinc-400 font-normal">
                        {cnt === 1 ? "Shirt" : "Shirts"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Size Selection */}
              <div className="bg-[#0b0c16]/90 border border-zinc-800/80 rounded-2xl p-5 sm:p-7 shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-zinc-800/70">
                  <div>
                    <h2 className="text-white text-base sm:text-lg font-bold">
                      3. Select Sizes
                    </h2>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      Pick a size for {shirtCount === 1 ? "your t-shirt" : `each of your ${shirtCount} t-shirts`} (XS to 3XL).
                    </p>
                  </div>
                </div>

                {/* ════════════════════════════════════════════════════════════════
                    MOBILE VIEW (Touch friendly list of shirts)
                   ════════════════════════════════════════════════════════════════ */}
                <div className="block md:hidden">
                  
                  {/* If more than 1 shirt, provide simple tab pills */}
                  {shirtCount > 1 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
                        <span>Select a shirt to configure:</span>
                        <span className="text-[#00d2ff]">
                          {shirts.filter((s) => s.size).length} of {shirtCount} chosen
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
                          All ({shirtCount})
                        </button>

                        {shirts.map((s, idx) => (
                          <button
                            key={idx}
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
                            <div>Shirt {idx + 1}</div>
                            <div className="text-[10px] text-zinc-400 font-normal">
                              {s.size ? s.size : "Pick size"}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── SUB-VIEW 1: SHOW ALL TAB ── */}
                  {shirtCount > 1 && activeMobileTab === "all" ? (
                    <div className="space-y-3 mb-5">
                      {shirts.map((shirt, idx) => {
                        return (
                          <div
                            key={idx}
                            className="bg-[#12131f] border border-zinc-800/90 p-4 rounded-xl"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-white text-sm font-bold">
                                Shirt {idx + 1}
                              </span>
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

                            <div className="grid grid-cols-4 gap-1.5">
                              {SIZES.map((sizeId) => {
                                const isSelected = shirt.size === sizeId;
                                return (
                                  <button
                                    key={sizeId}
                                    type="button"
                                    onClick={() => handleSizeSelect(idx, sizeId)}
                                    className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-[#004491] border-[#00d2ff] text-white shadow-sm"
                                        : "bg-[#0a0b12] border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
                                    }`}
                                  >
                                    {sizeId}
                                  </button>
                                );
                              })}
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
                          <div className="bg-[#12131f] border border-zinc-800/90 p-4 sm:p-5 mb-5 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-white text-sm sm:text-base font-bold">
                                Shirt {targetIdx + 1} Size
                              </h3>
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
                                      if (targetIdx < shirtCount - 1 && !shirts[targetIdx + 1]?.size) {
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

                            {shirtCount > 1 && (
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
                                  View All Shirts
                                </button>

                                <button
                                  type="button"
                                  disabled={targetIdx === shirtCount - 1}
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
                    DESKTOP VIEW (Clean, human-crafted sizing layout: hidden md:block)
                   ════════════════════════════════════════════════════════════════ */}
                <div className="hidden md:block">

                  {shirtCount === 1 ? (
                    /* Single shirt clean selector */
                    <div className="bg-[#12131f] border border-white/[0.06] rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white text-base font-bold">Pick Your Size</h3>
                          <p className="text-zinc-400 text-xs mt-0.5">
                            Select one of the standard sizes below (unisex regular fit).
                          </p>
                        </div>
                        {shirts[0]?.size && (
                          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold">
                            Selected: Size {shirts[0].size}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-7 gap-3">
                        {SIZES.map((sizeId) => {
                          const isSelected = shirts[0]?.size === sizeId;
                          const measurement = SIZE_MEASUREMENTS[sizeId];
                          return (
                            <button
                              key={sizeId}
                              type="button"
                              onClick={() => handleSizeSelect(0, sizeId)}
                              className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                isSelected
                                  ? "bg-[#004491] border-[#00d2ff] text-white shadow-lg shadow-[#004491]/30 scale-[1.02]"
                                  : "bg-[#0c0d17] border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
                              }`}
                            >
                              <span className="text-lg font-bold">{sizeId}</span>
                              {measurement && (
                                <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-zinc-400"}`}>
                                  {measurement}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Multi-shirt clean list */
                    <div className="border border-white/[0.08] bg-[#12131f] rounded-xl overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-zinc-800 bg-[#0c0d17] flex items-center justify-between">
                        <div>
                          <h3 className="text-white text-sm font-bold">Configure All {shirtCount} T-Shirts</h3>
                          <p className="text-zinc-400 text-xs">
                            Select a size for each shirt in the list below.
                          </p>
                        </div>
                        <div className="text-xs text-zinc-400 font-medium">
                          <span className="text-white font-bold">{shirts.filter((s) => s.size).length}</span> of {shirtCount} sized
                        </div>
                      </div>

                      <div className="divide-y divide-zinc-800/80">
                        {shirts.map((shirt, idx) => (
                          <div
                            key={idx}
                            className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.015] transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-[140px]">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                shirt.size
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}>
                                #{idx + 1}
                              </div>
                              <div>
                                <p className="text-white text-sm font-semibold">Shirt {idx + 1}</p>
                                <p className="text-zinc-400 text-xs">
                                  {shirt.size ? `Size ${shirt.size}` : "No size picked yet"}
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
                                        : "bg-[#0c0d17] border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
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
                  )}

                  {/* Desktop Selected Sizes Summary Pills */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-zinc-400 font-medium">Selected summary:</span>
                      {shirts.map((s, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                            s.size
                              ? "bg-[#004491]/20 border-[#004491]/60 text-blue-200"
                              : "bg-amber-950/20 border-amber-500/30 text-amber-300"
                          }`}
                        >
                          <span className="font-semibold">#{idx + 1}:</span>
                          <span>{s.size ? s.size : "None"}</span>
                        </div>
                      ))}
                    </div>
                    {shirts.every((s) => s.size) && (
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        All sizes configured
                      </span>
                    )}
                  </div>

                </div>

              </div>

              {/* Step 4: Payment Instructions & File Upload */}
              <div className="bg-[#0d0e18] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#004491]/30 border border-[#004491]/50 flex items-center justify-center text-[#5b9aff] text-xs font-bold">
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

                {/* Bank Account Info Card */}
                <div className="mb-6 bg-[#12131f] border border-white/[0.06] p-5 sm:p-6 rounded-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800 mb-4">
                    <div>
                      <span className="text-xs font-semibold text-[#5b9aff]">
                        Direct Bank Transfer or Online Deposit
                      </span>
                      <h3 className="text-white text-lg font-bold mt-0.5">People&apos;s Bank</h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-zinc-400">Total Payable</p>
                      <p className="text-2xl font-bold text-emerald-400 font-mono">
                        LKR {(shirtCount * PRICE_PER_SHIRT).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-medium">({shirtCount} × LKR {PRICE_PER_SHIRT.toLocaleString()})</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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

                {/* Upload Box */}
                <div className="mb-6">
                  <label className="block text-zinc-300 text-xs font-semibold mb-2.5">
                    Payment Slip / Receipt <span className="text-red-400">*</span>
                  </label>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("tshirt-slip-upload")?.click()}
                    className={`relative cursor-pointer border-2 border-dashed p-6 sm:p-8 transition-all duration-200 text-center rounded-xl ${
                      dragOver
                        ? "border-[#00d2ff] bg-[#004491]/15"
                        : paymentSlip
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-zinc-700 hover:border-zinc-500 bg-[#12131f]"
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
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={preview}
                            alt="Payment Slip Preview"
                            className="max-h-48 max-w-full object-contain border border-zinc-700 rounded-lg shadow-sm"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-emerald-400 text-5xl">
                            description
                          </span>
                        )}
                        <div>
                          <p className="text-white text-sm font-semibold">{paymentSlip.name}</p>
                          <p className="text-zinc-400 text-xs mt-0.5">
                            {(paymentSlip.size / 1024).toFixed(1)} KB · Click or drag another file to replace
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#004491]/15 border border-[#004491]/40 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#5b9aff] text-2xl">
                            cloud_upload
                          </span>
                        </div>
                        <div>
                          <p className="text-zinc-200 text-sm font-semibold">
                            Click to browse or drag &amp; drop your receipt
                          </p>
                          <p className="text-zinc-400 text-xs mt-1">
                            Accepted formats: JPG, PNG, WebP, PDF (max 5MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reference Number Field */}
                <div>
                  <label className="block text-zinc-300 text-xs font-semibold mb-2">
                    Payment Reference / Transaction ID <span className="text-zinc-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-984210384 or Deposit Slip Reference"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full bg-[#12131f] border border-zinc-800 rounded-xl text-zinc-200 text-sm px-4 py-3 focus:outline-none focus:border-[#004491] focus:ring-1 focus:ring-[#004491] transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Submit Button & Summary Bar */}
              <div className="bg-[#0d0e18] border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-white text-base font-bold">
                    Total: {shirtCount} {shirtCount === 1 ? "T-Shirt" : "T-Shirts"} · LKR {(shirtCount * PRICE_PER_SHIRT).toLocaleString()}
                  </p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Please make sure sizes and WhatsApp contact number are correct before submitting.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#004491] hover:bg-[#003570] text-white text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#004491]/25"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Order...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">shopping_bag</span>
                      Submit T-Shirt Pre-Order
                    </>
                  )}
                </button>
              </div>

              </form>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
