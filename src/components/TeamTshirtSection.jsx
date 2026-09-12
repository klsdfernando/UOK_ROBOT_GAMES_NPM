"use client";

import { useState, useEffect } from "react";

const NORMAL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const KIDS_SIZES = ["2XS", "XS", "S", "M", "L", "XL", "2XL"];

const TABLE_SIZE_ROWS = [
  { id: "2XS", label: "2XS", isKidsOnly: true },
  { id: "XS", label: "XS" },
  { id: "S", label: "S" },
  { id: "M", label: "M" },
  { id: "L", label: "L" },
  { id: "XL", label: "XL" },
  { id: "2XL", label: "2XL" },
  { id: "3XL", label: "3XL", isNormalOnly: true },
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

const KIDS_MEASUREMENTS = {
  "2XS": 'Chest 26" · L 18"',
  XS: 'Chest 28" · L 20"',
  S: 'Chest 30" · L 22"',
  M: 'Chest 32" · L 23"',
  L: 'Chest 34" · L 24"',
  XL: 'Chest 35" · L 25"',
  "2XL": 'Chest 36" · L 26"',
};

const PRICE_PER_SHIRT = 1800; // LKR

export default function TeamTshirtSection({ team }) {
  // Extract team members from Phase 2 data
  const phase2Members = team.phases?.["2"]?.data?.members || [];

  // Build initial roster
  const [roster, setRoster] = useState(() => {
    if (phase2Members.length > 0) {
      return phase2Members.map((m, idx) => ({
        id: `member-${idx}`,
        name: m.fullName?.trim() || (idx === 0 ? team.leaderName || "Leader" : `Member ${idx + 1}`),
        contact: m.contactNumber || "",
        role: idx === 0 ? "Leader" : "Member",
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

  // Shirts configuration mapped to selected students:
  // [{ memberId, memberName, memberRole, category: "Normal Size", size: "" }]
  const [shirts, setShirts] = useState(() => {
    return selectedStudents.map((m) => ({
      memberId: m.id,
      memberName: m.name,
      memberRole: m.role,
      category: "Normal Size",
      size: "",
    }));
  });

  // Sync shirts array when selected students change, preserving existing size/category
  useEffect(() => {
    setShirts((prev) => {
      return selectedStudents.map((student) => {
        const existing = prev.find((p) => p.memberId === student.id);
        if (existing) {
          return {
            ...existing,
            memberName: student.name,
            memberRole: student.role,
          };
        }
        return {
          memberId: student.id,
          memberName: student.name,
          memberRole: student.role,
          category: "Normal Size",
          size: "",
        };
      });
    });
  }, [roster]);

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

  // Past team orders
  const [pastOrders, setPastOrders] = useState([]);
  const [loadingPastOrders, setLoadingPastOrders] = useState(false);
  const [showPastOrders, setShowPastOrders] = useState(false);

  // Fetch past orders for this team
  const fetchPastOrders = async () => {
    if (!team.id) return;
    setLoadingPastOrders(true);
    try {
      const res = await fetch(`/api/tshirt?teamId=${encodeURIComponent(team.id)}`);
      const data = await res.json();
      if (data.success && data.orders) {
        setPastOrders(data.orders);
      }
    } catch {
      // Ignore
    } finally {
      setLoadingPastOrders(false);
    }
  };

  useEffect(() => {
    fetchPastOrders();
  }, [team.id]);

  // Toggle member selection
  const toggleMemberSelection = (id) => {
    setError("");
    setRoster((prev) => {
      const currentSelectedCount = prev.filter((m) => m.selected).length;
      return prev.map((m) => {
        if (m.id === id) {
          if (!m.selected && currentSelectedCount >= 5) {
            setError("Maximum 5 T-shirts per order. To buy more, place another order.");
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
          if (count < 5) {
            count++;
            return { ...m, selected: true };
          }
          return { ...m, selected: false };
        });
      });
      if (roster.length > 5) {
        setError("Selected first 5 members (maximum 5 per order form).");
      }
    } else {
      setRoster((prev) => prev.map((m) => ({ ...m, selected: false })));
    }
  };

  // Add extra student/supporter
  const handleAddExtraStudent = () => {
    if (!extraStudentName.trim()) return;
    if (roster.length >= 10) {
      setError("Roster limit reached.");
      return;
    }
    const currentSelected = roster.filter((m) => m.selected).length;
    const canSelect = currentSelected < 5;

    const newMember = {
      id: `extra-${Date.now()}`,
      name: extraStudentName.trim(),
      contact: "",
      role: "Extra / Supporter",
      selected: canSelect,
    };

    setRoster((prev) => [...prev, newMember]);
    setExtraStudentName("");
    setShowAddExtra(false);
    if (!canSelect) {
      setError("Added to roster. Max 5 shirts can be selected at once.");
    }
  };

  // Update category for a specific shirt
  const handleCategoryChange = (index, category) => {
    setShirts((prev) => {
      const updated = [...prev];
      const current = updated[index];
      if (!current) return prev;
      let newSize = current.size;

      // Reset size if incompatible with new category
      if (category === "Normal Size" && current.size === "2XS") {
        newSize = "";
      } else if (category === "Kids Size" && current.size === "3XL") {
        newSize = "";
      }

      updated[index] = { ...current, category, size: newSize };
      return updated;
    });
  };

  // Update size for a specific shirt
  const handleSizeSelect = (shirtIndex, sizeId) => {
    const shirt = shirts[shirtIndex];
    if (!shirt) return;

    let newCategory = shirt.category;
    if (sizeId === "2XS" && shirt.category !== "Kids Size") {
      newCategory = "Kids Size";
    } else if (sizeId === "3XL" && shirt.category !== "Normal Size") {
      newCategory = "Normal Size";
    }

    setShirts((prev) => {
      const updated = [...prev];
      updated[shirtIndex] = {
        ...updated[shirtIndex],
        category: newCategory,
        size: sizeId,
      };
      return updated;
    });
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
    navigator.clipboard?.writeText("000812345678");
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
        fetchPastOrders();
      } else {
        setError(data.message || "Failed to submit team order. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setPaymentSlip(null);
    setPreview(null);
    setReferenceNumber("");
    setError("");
    setOrderResult(null);
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
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
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

            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Equip <strong className="text-white font-bold">{team.teamName}</strong> with official arena jerseys. Select which students want a shirt, customize sizes, and submit your team&apos;s slip in one unified order.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded bg-[#004491]/20 text-[#00d2ff] border border-[#004491]/40">
                Team: {team.teamName}
              </span>
              <button
                type="button"
                onClick={() => setShowSizeChart(!showSizeChart)}
                className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded border border-outline-variant hover:border-[#00d2ff] bg-[#0b0c16] text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">straighten</span>
                {showSizeChart ? "Hide Size Chart" : "Size Measurements"}
              </button>

              {pastOrders.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPastOrders(!showPastOrders)}
                  className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">receipt_long</span>
                  {showPastOrders ? "Hide Orders" : `Past Orders (${pastOrders.length})`}
                </button>
              )}
            </div>
          </div>

          {/* Quick Price Card */}
          <div className="bg-[#0b0c16]/80 border border-outline-variant p-4 sm:p-5 rounded-xl text-center shrink-0 w-full sm:w-auto">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
              Official Arena Jersey
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              LKR {PRICE_PER_SHIRT.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">
              Per T-Shirt · Adults &amp; Kids
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[#00d2ff] text-xs font-bold uppercase tracking-widest mb-2">
                Normal / Adult Sizes
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-zinc-300 border border-zinc-800">
                  <thead className="bg-[#0b0c16] text-zinc-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-2 border-b border-zinc-800">Size</th>
                      <th className="p-2 border-b border-zinc-800">Chest (in)</th>
                      <th className="p-2 border-b border-zinc-800">Length (in)</th>
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

            <div>
              <p className="text-[#5b9aff] text-xs font-bold uppercase tracking-widest mb-2">
                Kids Sizes
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-zinc-300 border border-zinc-800">
                  <thead className="bg-[#0b0c16] text-zinc-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-2 border-b border-zinc-800">Size</th>
                      <th className="p-2 border-b border-zinc-800">Chest (in)</th>
                      <th className="p-2 border-b border-zinc-800">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    <tr><td className="p-2 font-bold text-[#00d2ff]">2XS (Kids)</td><td className="p-2">26&quot;</td><td className="p-2">18&quot;</td></tr>
                    <tr><td className="p-2 font-bold text-white">XS</td><td className="p-2">28&quot;</td><td className="p-2">20&quot;</td></tr>
                    <tr><td className="p-2 font-bold text-white">S</td><td className="p-2">30&quot;</td><td className="p-2">22&quot;</td></tr>
                    <tr><td className="p-2 font-bold text-white">M</td><td className="p-2">32&quot;</td><td className="p-2">23&quot;</td></tr>
                    <tr><td className="p-2 font-bold text-white">L</td><td className="p-2">34&quot;</td><td className="p-2">24&quot;</td></tr>
                    <tr><td className="p-2 font-bold text-white">XL</td><td className="p-2">35&quot;</td><td className="p-2">25&quot;</td></tr>
                    <tr><td className="p-2 font-bold text-white">2XL</td><td className="p-2">36&quot;</td><td className="p-2">26&quot;</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Past Orders Section ─── */}
      {showPastOrders && pastOrders.length > 0 && (
        <div className="bg-[#080808] border border-outline-variant p-6 rounded-sm relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-lg">receipt_long</span>
              Past Orders for {team.teamName}
            </h3>
            <button
              type="button"
              onClick={() => setShowPastOrders(false)}
              className="text-zinc-500 hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="space-y-4">
            {pastOrders.map((ord) => (
              <div
                key={ord.orderId || ord.id}
                className="bg-[#0b0c16] border border-outline-variant p-4 rounded-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Order ID</span>
                    <span className="text-sm font-mono font-bold text-[#00d2ff]">{ord.orderId || ord.id}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-zinc-400">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : ""}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {ord.status || "Received"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  {ord.shirts?.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center text-zinc-300">
                      <span>
                        {s.memberName ? (
                          <strong className="text-white">{s.memberName}</strong>
                        ) : (
                          `Shirt #${idx + 1}`
                        )}
                        <span className="text-zinc-500 ml-1.5 text-[11px]">({s.category})</span>
                      </span>
                      <span className="font-mono text-[#00d2ff] bg-[#004491]/20 px-2 py-0.5 rounded border border-[#004491]/30">
                        Size {s.size}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800/60 flex justify-between items-center text-xs font-bold text-white">
                  <span>Total Paid ({ord.shirtCount} {ord.shirtCount === 1 ? "shirt" : "shirts"})</span>
                  <span className="text-emerald-400">LKR {(ord.shirtCount * PRICE_PER_SHIRT).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Order Result Screen ─── */}
      {orderResult ? (
        <div className="relative bg-[#080808] border border-outline-variant p-8 sm:p-12 text-center rounded-sm">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500" />
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
            Team Order Placed!
          </h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Thank you, <strong className="text-white">{contactName}</strong>. Your team&apos;s T-shirt pre-order has been registered with Order ID:
          </p>

          <div className="inline-block bg-[#0b0c16] border border-[#004491]/40 px-6 py-3 rounded mb-8">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Order Reference ID</p>
            <p className="text-lg font-mono font-bold text-[#00d2ff]">{orderResult.orderId}</p>
          </div>

          <div className="bg-[#0b0c16] border border-outline-variant p-5 max-w-lg mx-auto text-left mb-8">
            <p className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-3 border-b border-zinc-800 pb-2">
              Team Order Breakdown ({orderResult.order?.shirtCount} {orderResult.order?.shirtCount === 1 ? "Shirt" : "Shirts"})
            </p>
            <div className="space-y-2 text-xs">
              {orderResult.order?.shirts?.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <div>
                    <span className="text-white font-semibold">
                      {s.memberName || `Shirt #${i + 1}`}
                    </span>
                    {s.memberRole && (
                      <span className="text-zinc-500 text-[10px] ml-1.5">({s.memberRole})</span>
                    )}
                  </div>
                  <span className="text-[#00d2ff] font-mono bg-[#004491]/15 px-2 py-0.5 rounded border border-[#004491]/30">
                    {s.category} · Size {s.size}
                  </span>
                </div>
              ))}
              <div className="border-t border-zinc-800 pt-2 flex justify-between items-center text-sm font-bold text-white mt-2">
                <span>Total Amount</span>
                <span className="text-emerald-400">
                  LKR {(orderResult.order?.shirtCount * PRICE_PER_SHIRT).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-[#004491] text-white text-xs uppercase tracking-widest font-bold hover:bg-[#002d5e] border border-[#004491] transition-all cursor-pointer"
            >
              Place Another Order
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowPastOrders(true);
              }}
              className="px-6 py-3 border border-outline-variant text-zinc-300 hover:text-white hover:border-zinc-500 text-xs uppercase tracking-widest font-bold transition-all cursor-pointer"
            >
              View Order History
            </button>
          </div>
        </div>
      ) : (
        /* ─── Order Form ─── */
        <form onSubmit={handleSubmit} className="space-y-8">
          
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
                    Tick the team members who want to purchase an official jersey (Max 5 per order form)
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

                  <div className="text-right shrink-0">
                    {member.selected ? (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                        Purchasing Jersey ✓
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-500 italic">
                        Not ordering
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add extra student button & inline form */}
            {!showAddExtra ? (
              <button
                type="button"
                onClick={() => setShowAddExtra(true)}
                className="text-xs uppercase tracking-widest font-bold text-[#5b9aff] hover:text-white flex items-center gap-1.5 border border-[#004491]/30 hover:border-[#004491] bg-[#004491]/10 px-3.5 py-2 rounded transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                + Add Another Student / Supporter Shirt
              </button>
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
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                  Selected Count:
                </span>
                <span className="text-sm font-mono font-bold text-[#00d2ff]">
                  {selectedStudents.length} {selectedStudents.length === 1 ? "Student" : "Students"}
                </span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-400 text-xs font-semibold">
                  Total: LKR {(selectedStudents.length * PRICE_PER_SHIRT).toLocaleString()}
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
              STEP 3: CATEGORY & SIZE SELECTION FOR SELECTED STUDENTS
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
                      Configure Category (Normal vs Kids) and Size for your {shirts.length} selected {shirts.length === 1 ? "student" : "students"}
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
                        className="w-full bg-[#080808] border border-outline-variant text-white text-xs sm:text-sm font-bold px-3.5 py-2.5 appearance-none focus:outline-none focus:border-[#00d2ff] transition-colors cursor-pointer rounded-sm"
                      >
                        <option value="all">
                          Show All Students ({shirts.length}) — Tab Overview &amp; Sizing
                        </option>
                        {shirts.map((s, idx) => (
                          <option key={idx} value={idx.toString()}>
                            #{idx + 1}: {s.memberName} — {s.category} {s.size ? `[Size ${s.size}] ✓` : "(Size required)"}
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
                          key={idx}
                          type="button"
                          onClick={() => setActiveMobileTab(idx.toString())}
                          className={`flex-1 min-w-[75px] py-2 px-1 text-center text-xs font-bold uppercase transition-all rounded-sm border shrink-0 cursor-pointer ${
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
                      const sizes = shirt.category === "Normal Size" ? NORMAL_SIZES : KIDS_SIZES;
                      const measurements = shirt.category === "Normal Size" ? SIZE_MEASUREMENTS : KIDS_MEASUREMENTS;

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
                              <p className="text-zinc-500 text-[10px] mt-0.5">
                                Category: {shirt.category}
                              </p>
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

                          {/* Category Switcher */}
                          <div className="mb-3">
                            <p className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold mb-1.5">
                              1. Select Category
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => handleCategoryChange(idx, "Normal Size")}
                                className={`py-2 px-2 text-center rounded text-xs font-bold uppercase border transition-all cursor-pointer ${
                                  shirt.category === "Normal Size"
                                    ? "bg-[#004491] border-[#00d2ff] text-white shadow-[0_0_8px_rgba(0,210,255,0.3)]"
                                    : "bg-[#080808] border-outline-variant text-zinc-400 hover:text-white"
                                }`}
                              >
                                Normal Size (Adult)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCategoryChange(idx, "Kids Size")}
                                className={`py-2 px-2 text-center rounded text-xs font-bold uppercase border transition-all cursor-pointer ${
                                  shirt.category === "Kids Size"
                                    ? "bg-[#004491] border-[#00d2ff] text-white shadow-[0_0_8px_rgba(0,210,255,0.3)]"
                                    : "bg-[#080808] border-outline-variant text-zinc-400 hover:text-white"
                                }`}
                              >
                                Kids Size (Youth)
                              </button>
                            </div>
                          </div>

                          {/* Size Selection Grid */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold">
                                2. Choose Size
                              </p>
                              {shirt.size && (
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {measurements[shirt.size]}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-4 gap-1.5">
                              {sizes.map((sizeId) => {
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

                      const sizes = shirt.category === "Normal Size" ? NORMAL_SIZES : KIDS_SIZES;
                      const measurements = shirt.category === "Normal Size" ? SIZE_MEASUREMENTS : KIDS_MEASUREMENTS;

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
                                Step 1: Category · Step 2: Size
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

                          {/* 1. Category Switcher */}
                          <div className="mb-5">
                            <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                              1. Select Category
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => handleCategoryChange(targetIdx, "Normal Size")}
                                className={`py-3 px-3 rounded text-center border transition-all cursor-pointer ${
                                  shirt.category === "Normal Size"
                                    ? "bg-[#004491]/35 border-[#00d2ff] text-white shadow-[0_0_12px_rgba(0,68,145,0.4)]"
                                    : "bg-[#080808] border-outline-variant text-zinc-400 hover:text-white"
                                }`}
                              >
                                <p className="text-xs font-bold uppercase">Normal Size</p>
                                <p className="text-[10px] text-zinc-500 mt-0.5">Adult (XS – 3XL)</p>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCategoryChange(targetIdx, "Kids Size")}
                                className={`py-3 px-3 rounded text-center border transition-all cursor-pointer ${
                                  shirt.category === "Kids Size"
                                    ? "bg-[#004491]/35 border-[#00d2ff] text-white shadow-[0_0_12px_rgba(0,68,145,0.4)]"
                                    : "bg-[#080808] border-outline-variant text-zinc-400 hover:text-white"
                                }`}
                              >
                                <p className="text-xs font-bold uppercase">Kids Size</p>
                                <p className="text-[10px] text-zinc-500 mt-0.5">Youth (2XS – 2XL)</p>
                              </button>
                            </div>
                          </div>

                          {/* 2. Size Options Grid */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                                2. Choose Size
                              </p>
                              {shirt.size && (
                                <span className="text-[11px] font-bold text-emerald-400">
                                  Selected: {shirt.size} ✓
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {sizes.map((sizeId) => {
                                const isSelected = shirt.size === sizeId;
                                const measurement = measurements[sizeId];

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
                  DESKTOP MATRIX TABLE VIEW (Strictly hidden on mobile: hidden md:block)
                 ════════════════════════════════════════════════════════════════ */}
              <div className="hidden md:block">
                
                {/* Desktop Legend */}
                <div className="flex flex-wrap items-center gap-3 text-xs mb-5 pb-3 border-b border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-zinc-400 text-[10px] uppercase font-bold">
                    <span className="w-2.5 h-2.5 bg-[#00d2ff] rounded-sm inline-block" /> Selected
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-bold">
                    <span className="w-2.5 h-2.5 border border-zinc-700 bg-zinc-900 rounded-sm inline-block" /> Available
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-600 text-[10px] uppercase font-bold">
                    <span className="text-zinc-600 font-bold">—</span> Inactive
                  </span>
                </div>

                {/* Category Selector Cards */}
                <div className="mb-6 bg-[#0b0c16] border border-outline-variant p-4 sm:p-5 rounded-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                      Category per Student
                    </p>
                    <span className="text-zinc-500 text-[10px]">
                      {shirts.length} {shirts.length === 1 ? "Student Selected" : "Students Selected"}
                    </span>
                  </div>

                  <div
                    className={`grid gap-3 transition-all duration-300 ${
                      shirts.length === 1
                        ? "grid-cols-1 w-full"
                        : shirts.length === 2
                          ? "grid-cols-1 sm:grid-cols-2"
                          : shirts.length === 3
                            ? "grid-cols-1 sm:grid-cols-3"
                            : shirts.length === 4
                              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                    }`}
                  >
                    {shirts.map((shirt, idx) => (
                      <div
                        key={shirt.memberId || idx}
                        className="bg-[#080808] border border-outline-variant p-4 rounded-sm hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="truncate min-w-0">
                            <p className="text-[#00d2ff] text-xs font-bold uppercase truncate">
                              {shirt.memberName}
                            </p>
                            <span className="text-[9px] uppercase font-semibold text-zinc-500">
                              {shirt.memberRole || `Shirt #${idx + 1}`}
                            </span>
                          </div>
                          <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[#004491]/15 text-[#5b9aff] border border-[#004491]/30 shrink-0">
                            {shirt.category}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 mt-3">
                          <label
                            className={`flex items-center gap-2 px-2.5 py-1.5 border rounded cursor-pointer transition-all ${
                              shirt.category === "Normal Size"
                                ? "bg-[#004491]/25 border-[#00d2ff] text-white shadow-[0_0_10px_rgba(0,68,145,0.35)]"
                                : "border-zinc-800 bg-[#0b0c16] text-zinc-400 hover:text-white"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`team-category-${shirt.memberId || idx}`}
                              value="Normal Size"
                              checked={shirt.category === "Normal Size"}
                              onChange={() => handleCategoryChange(idx, "Normal Size")}
                              className="accent-[#00d2ff] cursor-pointer"
                            />
                            <span className="text-[11px] font-semibold">Normal (Adult)</span>
                          </label>

                          <label
                            className={`flex items-center gap-2 px-2.5 py-1.5 border rounded cursor-pointer transition-all ${
                              shirt.category === "Kids Size"
                                ? "bg-[#004491]/25 border-[#00d2ff] text-white shadow-[0_0_10px_rgba(0,68,145,0.35)]"
                                : "border-zinc-800 bg-[#0b0c16] text-zinc-400 hover:text-white"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`team-category-${shirt.memberId || idx}`}
                              value="Kids Size"
                              checked={shirt.category === "Kids Size"}
                              onChange={() => handleCategoryChange(idx, "Kids Size")}
                              className="accent-[#00d2ff] cursor-pointer"
                            />
                            <span className="text-[11px] font-semibold">Kids Size</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
                              <span className={row.id === "2XS" ? "text-[#00d2ff]" : ""}>
                                {row.label}
                              </span>
                              {shirts.length === 1 && (
                                <span className="text-[10px] text-zinc-600 font-normal normal-case hidden sm:inline">
                                  {row.isKidsOnly ? "(Kids only)" : row.isNormalOnly ? "(Adult only)" : ""}
                                </span>
                              )}
                            </div>
                          </td>

                          {shirts.map((shirt, idx) => {
                            const isCompatible =
                              shirt.category === "Normal Size"
                                ? NORMAL_SIZES.includes(row.id)
                                : KIDS_SIZES.includes(row.id);

                            const isSelected = shirt.size === row.id;

                            return (
                              <td
                                key={shirt.memberId || idx}
                                className={`p-3 border-l border-outline-variant transition-colors ${
                                  !isCompatible
                                    ? "bg-black/30 text-zinc-600 hover:bg-[#004491]/10 cursor-pointer group/cell"
                                    : isSelected
                                      ? "bg-[#004491]/20 cursor-pointer"
                                      : "hover:bg-[#004491]/10 cursor-pointer"
                                }`}
                                onClick={() => handleSizeSelect(idx, row.id)}
                              >
                                {isCompatible ? (
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
                                ) : (
                                  <span className="text-zinc-600 group-hover/cell:text-zinc-400 text-xs select-none">
                                    —
                                  </span>
                                )}
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
                        <span className="text-zinc-400">{s.category}</span>
                        <span className="text-zinc-600">·</span>
                        {s.size ? (
                          <span className="font-bold text-[#00d2ff] uppercase">{s.size}</span>
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
                    <h3 className="text-white text-base font-bold mt-0.5">Bank of Ceylon (BOC)</h3>
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
                    <p className="text-zinc-200 font-semibold">ECSC - University of Kelaniya</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-0.5">Account Number</p>
                    <div className="flex items-center gap-2">
                      <p className="text-zinc-200 font-mono font-bold">000812345678</p>
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
                    <p className="text-zinc-200 font-semibold">Kelaniya Branch (BOC)</p>
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
