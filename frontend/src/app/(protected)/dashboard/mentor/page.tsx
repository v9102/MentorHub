"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  User, BarChart2, CreditCard,
  Eye, EyeOff, Plus, Trash2, Edit3, Check, X,
  Download, Share2, Copy, Twitter, Linkedin,
  MapPin, Globe, Briefcase, FileText, ChevronLeft, ChevronRight,
  TrendingUp, Clock, Activity, Zap, DollarSign, Hash, ArrowUpRight, Camera, Star, Video, Calendar
} from "lucide-react";
import { PremiumAreaChart } from "@/shared/ui/PremiumAreaChart";
import { PremiumDonutChart } from "@/shared/ui/PremiumDonutChart";
import { PremiumBarChart } from "@/shared/ui/PremiumBarChart";
import { PremiumLineChart } from "@/shared/ui/PremiumLineChart";
import { ProfileBanner } from "@/shared/ui/ProfileBanner";
import { useMentorOnboarding } from "@/shared/lib/context/MentorOnboardingContext";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const sessionsOverTime = [
  { date: "Jan", value: 12 }, { date: "Feb", value: 18 }, { date: "Mar", value: 24 },
  { date: "Apr", value: 15 }, { date: "May", value: 31 }, { date: "Jun", value: 27 },
  { date: "Jul", value: 42 },
];

const deviceBreakdown = [
  { name: "Desktop", value: 52 }, { name: "Mobile", value: 33 },
  { name: "Tablet", value: 10 }, { name: "Other", value: 5 },
];

const paymentMethodBreakdown = [
  { name: "UPI", value: 61200 }, { name: "Card", value: 38400 },
  { name: "Bank", value: 24800 }, { name: "Wallet", value: 12600 },
];

const paymentTrends = [
  { date: "Jan", value: 8200 }, { date: "Feb", value: 14500 }, { date: "Mar", value: 10800 },
  { date: "Apr", value: 19200 }, { date: "May", value: 24600 }, { date: "Jun", value: 18900 },
  { date: "Jul", value: 31400 },
];

const recentTransactions = [
  { id: "TXN001", student: "Arjun Sharma", amount: 2500, method: "UPI", status: "success", date: "23 Feb 2026" },
  { id: "TXN002", student: "Priya Nair", amount: 2500, method: "Card", status: "success", date: "22 Feb 2026" },
  { id: "TXN003", student: "Rahul Gupta", amount: 1800, method: "Bank", status: "pending", date: "21 Feb 2026" },
  { id: "TXN004", student: "Sneha Pillai", amount: 2500, method: "UPI", status: "success", date: "20 Feb 2026" },
  { id: "TXN005", student: "Vikram Singh", amount: 2500, method: "Wallet", status: "failed", date: "19 Feb 2026" },
  { id: "TXN006", student: "Ananya Patel", amount: 1800, method: "UPI", status: "success", date: "18 Feb 2026" },
];

async function exportToExcel(filename: string, data: any[], headers: string[]) {
  const { utils, writeFile } = await import("xlsx");
  const ws = utils.json_to_sheet([
    headers.reduce((acc: any, h, i) => { acc[h] = h; return acc; }, {}),
    ...data,
  ]);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Data");
  writeFile(wb, `${filename}.xlsx`);
}

const D = {
  bg: "#F8FAFC", // Slate-50 equivalent
  surface: "#FFFFFF",
  border: "#E2E8F0", // border-border-subtle slate-200
  borderAccent: "#CBD5E1",
  text: "#0F172A", // Slate-900
  muted: "#64748B", // Slate-500
  accent: "#2563EB", // Blue-600
  accentHover: "#1D4ED8", // Blue-700
  accentDim: "#EFF6FF", // Blue-50
  success: "#10B981", // Emerald-500
  warning: "#F59E0B", // Amber-500
  danger: "#EF4444", // Red-500
};

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "sessions", label: "Sessions", icon: BarChart2 },
  { id: "payments", label: "Payments", icon: CreditCard },
];

import QRCode from "react-qr-code";

function QRPlaceholder({ value = "https://mentomania.com/profile" }: { value?: string }) {
  return (
    <div style={{ padding: "8px", background: "#FFFFFF", borderRadius: "8px" }}>
      <QRCode
        value={value}
        size={90}
        fgColor="#2563EB"
        bgColor="#FFFFFF"
        level="M"
      />
    </div>
  );
}

function SharePopover({ onClose }: { onClose: () => void }) {
  const profileUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
  };

  const shareLinks = [
    { icon: Twitter, label: "X (Twitter)", color: "#1DA1F2", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=Check+out+my+Mentomania+profile!` },
    { icon: Linkedin, label: "LinkedIn", color: "#0A66C2", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: -10, y: "-50%" }}
      animate={{ opacity: 1, scale: 1, x: 0, y: "-50%" }}
      exit={{ opacity: 0, scale: 0.95, x: -10, y: "-50%" }}
      style={{
        position: "absolute", top: "50%", left: "calc(100% + 16px)", transform: "translateY(-50%)",
        background: "#FFFFFF",
        border: `1px solid ${D.border}`, borderRadius: 14, padding: "16px 18px",
        minWidth: 220, zIndex: 100,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <p style={{ fontSize: 11, color: D.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Share Profile</p>
      <button
        onClick={handleCopy}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          background: D.accentDim, border: `1px solid ${D.border}`, borderRadius: 8,
          padding: "8px 12px", color: D.accent, fontSize: 13, fontWeight: 500, cursor: "pointer",
          marginBottom: 8, transition: "all 0.2s",
        }}
      >
        <Copy size={16} color={D.accent} /> Copy Link
      </button>
      {shareLinks.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            background: "transparent", border: `1px solid ${D.border}`, borderRadius: 8,
            padding: "8px 12px", color: D.text, fontSize: 13, fontWeight: 500,
            marginBottom: 6, textDecoration: "none", transition: "border-color 0.2s",
          }}
        >
          <s.icon size={16} color={s.color} /> {s.label}
        </a>
      ))}
    </motion.div>
  );
}

function ProfileAvatar({ initials, profilePhoto }: { initials: string, profilePhoto?: string | null }) {
  const [hovered, setHovered] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hoverContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowShare(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const profileUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div
      style={{ position: "relative", zIndex: 50 }}
      ref={hoverContainerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowShare(false); }}
    >
      <div style={{ position: "relative", display: "inline-block" }} ref={popoverRef}>
        <div
          style={{
            width: 144, height: 144, position: "relative", cursor: "pointer",
            borderRadius: "50%", overflow: "hidden", border: "4px solid #FFFFFF",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
            background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
            zIndex: 20
          }}
        >
          {/* Front: Image or Initials */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 36, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>{initials}</span>
            )}
          </div>
        </div>

        {/* Share Icon Overlay - Always Visible */}
        <motion.button
          whileHover={{ x: 4, scale: 1.1 }}
          onClick={(e) => { e.stopPropagation(); setShowShare((v) => !v); }}
          onMouseEnter={() => setShowShare(true)}
          style={{
            position: "absolute", bottom: 2, right: 2, width: 36, height: 36,
            background: "#FFFFFF", borderRadius: "50%", border: `1px solid ${D.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 30
          }}
        >
          <Share2 size={16} color={D.accent} />
        </motion.button>

        {/* Dropdown Card on Hover */}
        <motion.div
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 0 : -10,
            y: "-50%",
            scale: hovered ? 1 : 0.95
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            pointerEvents: hovered ? "auto" : "none",
            position: "absolute", top: "50%", left: "calc(100% + 20px)",
            background: "#FFFFFF", border: `1px solid ${D.border}`,
            borderRadius: 16, padding: "16px", minWidth: 160, zIndex: 100,
            boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12
          }}
        >
          {/* Left Caret Arrow */}
          <div
            style={{
              position: "absolute", top: "50%", left: -7, transform: "translateY(-50%) rotate(45deg)",
              width: 14, height: 14, background: "#FFFFFF",
              borderLeft: `1px solid ${D.border}`, borderBottom: `1px solid ${D.border}`,
              borderTopRightRadius: 2, zIndex: 1
            }}
          />

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <QRPlaceholder />
            </div>
            <p style={{ fontSize: 11, color: D.text, marginTop: 4, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Scan or Click</p>
          </div>

          <div style={{ width: "100%", height: 1, background: "#F1F5F9", margin: "2px 0" }} />

          <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={() => navigator.clipboard.writeText(profileUrl)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: D.accentDim, border: `1px solid ${D.border}`, borderRadius: 8,
                padding: "8px 12px", color: D.accent, fontSize: 13, fontWeight: 500, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Copy size={14} /> Copy Link
            </button>
            <div className="flex w-full gap-2">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=Check+out+my+Mentomania+profile!`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: `1px solid ${D.border}`, borderRadius: 8,
                  padding: "8px", color: "#1DA1F2", cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <Twitter size={16} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: `1px solid ${D.border}`, borderRadius: 8,
                  padding: "8px", color: "#0A66C2", cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Legacy Share Popover (Keep for explicit click if needed, though redundant now) */}
        <AnimatePresence>
          {showShare && !hovered && <SharePopover onClose={() => setShowShare(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}


function EditableField({ label, value, icon: Icon, multiline = false, onSave }: {
  label: string;
  value: string;
  icon: any;
  multiline?: boolean;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const confirm = () => { onSave(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  return (
    <div style={{
      padding: "14px 16px",
      background: editing ? D.bg : "transparent",
      borderRadius: 10,
      border: `1px solid ${editing ? D.border : "transparent"}`,
      transition: "all 0.2s",
      cursor: editing ? "default" : "pointer",
    }} onClick={() => !editing && setEditing(true)}
      onMouseEnter={(e) => { if (!editing) (e.currentTarget as HTMLElement).style.background = D.bg }}
      onMouseLeave={(e) => { if (!editing) (e.currentTarget as HTMLElement).style.background = "transparent" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Icon size={14} color={D.muted} />
        <span style={{ fontSize: 11, color: D.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</span>
      </div>
      {editing ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          {multiline ? (
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={{
                flex: 1, background: "#FFFFFF", border: `1px solid ${D.borderAccent}`, borderRadius: 6, padding: "8px 12px", outline: "none",
                fontSize: 14, color: D.text, resize: "none",
                minHeight: 60, lineHeight: 1.5,
              }}
            />
          ) : (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") confirm(); if (e.key === "Escape") cancel(); }}
              style={{
                flex: 1, background: "#FFFFFF", border: `1px solid ${D.borderAccent}`, borderRadius: 6, padding: "8px 12px", outline: "none",
                fontSize: 14, color: D.text,
              }}
            />
          )}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button onClick={confirm} style={{ background: D.accent, border: "none", borderRadius: 6, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = D.accentHover)} onMouseLeave={(e) => (e.currentTarget.style.background = D.accent)}>
              <Check size={16} color="#fff" />
            </button>
            <button onClick={cancel} style={{ background: "#FFFFFF", border: `1px solid ${D.border}`, borderRadius: 6, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = D.bg)} onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}>
              <X size={16} color={D.muted} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, color: draft ? D.text : D.muted, fontWeight: draft ? 500 : 400 }}>
            {draft || `Add ${label.toLowerCase()}…`}
          </span>
          <Edit3 size={14} color={D.muted} style={{ opacity: 0.5 }} />
        </div>
      )}
    </div>
  );
}


type PaymentMethod = {
  id: string;
  type: "upi" | "bank";
  label: string;
  value: string;
  secondary?: string;
};

function PaymentCard({ pm, onDelete }: { pm: PaymentMethod; onDelete: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const mask = (s: string) => s.replace(/./g, "•").slice(0, -4) + s.slice(-4);

  return (
    <div style={{
      background: D.surface, border: `1px solid ${D.border}`, borderRadius: 12, padding: "16px 18px",
      display: "flex", alignItems: "center", gap: 16, position: "relative",
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = D.borderAccent; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(0,0,0,0.05)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = D.border; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: D.accentDim,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <CreditCard size={20} color={D.accent} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, color: D.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{pm.type === "upi" ? "UPI ID" : "Bank Account"}</p>
        <p style={{ fontSize: 14, color: D.text, fontWeight: 600 }}>
          {revealed ? pm.value : mask(pm.value)}
        </p>
        {pm.secondary && (
          <p style={{ fontSize: 12, color: D.muted, marginTop: 2 }}>
            IFSC: {revealed ? pm.secondary : mask(pm.secondary)}
          </p>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => setRevealed((v) => !v)}
          style={{ background: "#FFFFFF", border: `1px solid ${D.border}`, borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = D.bg)} onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
        >
          {revealed ? <EyeOff size={16} color={D.muted} /> : <Eye size={16} color={D.muted} />}
        </button>
        <button
          onClick={onDelete}
          style={{ background: "#FFFFFF", border: `1px solid ${D.border}`, borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s, border-color 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget.style.background = "#FEF2F2"); (e.currentTarget.style.borderColor = "#FECACA"); }}
          onMouseLeave={(e) => { (e.currentTarget.style.background = "#FFFFFF"); (e.currentTarget.style.borderColor = D.border); }}
        >
          <Trash2 size={16} color={D.danger} />
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent = D.accent, bgHighlight = D.accentDim, trend }: {
  label: string; value: string; icon: any; accent?: string; bgHighlight?: string; trend?: string;
}) {
  return (
    <div style={{
      background: D.surface, border: `1px solid ${D.border}`, borderRadius: 16,
      padding: "20px 24px", transition: "all 0.25s",
      position: "relative", overflow: "hidden",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = D.borderAccent; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = D.border; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: bgHighlight, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={accent} />
        </div>
        {trend && (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, color: D.success, background: "#ECFDF5", padding: "4px 8px", borderRadius: 6 }}>
            <ArrowUpRight size={12} strokeWidth={2.5} /> {trend}
          </span>
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        <p style={{ fontSize: 13, color: D.muted, marginBottom: 4, fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: 32, color: D.text, letterSpacing: "-0.03em", fontWeight: 700 }}>{value}</p>
      </div>
    </div>
  );
}

function DashCard({ title, subtitle, action, children }: {
  title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 16, padding: "24px 24px 20px", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, color: D.text, margin: 0, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 13, color: D.muted, marginTop: 4 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ExportBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
        background: "#FFFFFF", border: `1px solid ${D.border}`, borderRadius: 8,
        fontSize: 13, fontWeight: 500, color: D.text, cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = D.borderAccent; (e.currentTarget as HTMLElement).style.background = D.bg; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = D.border; (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; }}
    >
      <Download size={14} /> Export .xlsx
    </button>
  );
}

function StatusBadge({ status }: { status: "success" | "pending" | "failed" }) {
  const cfg = {
    success: { color: D.success, bg: "#ECFDF5", border: "#A7F3D0", label: "Success" },
    pending: { color: D.warning, bg: "#FEF3C7", border: "#FDE68A", label: "Pending" },
    failed: { color: D.danger, bg: "#FEF2F2", border: "#FECACA", label: "Failed" },
  }[status];
  return (
    <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: "4px 10px", borderRadius: 6 }}>
      {cfg.label}
    </span>
  );
}

function ProfileTab({ mentorData }: { mentorData: any }) {
  const { user, isLoaded } = useUser();
  const firstName = user?.firstName || mentorData?.basicInfo?.firstName || "Mentor";
  const lastName = user?.lastName || mentorData?.basicInfo?.lastName || "";
  const initials = firstName ? `${firstName.charAt(0)}${lastName?.charAt(0) || ''}`.toUpperCase() : "M";
  const profilePhoto = user?.imageUrl || mentorData?.basicInfo?.profilePhoto || null;

  const [showShare, setShowShare] = useState(false);

  // Better mapping from onboarding context
  const defaultDesignation = [mentorData?.basicInfo?.currentRole, mentorData?.basicInfo?.currentOrganisation].filter(Boolean).join(" at ") || mentorData?.professionalInfo?.college || "";
  const defaultBio = mentorData?.expertise?.specializations || "";

  const [fields, setFields] = useState({
    name: user?.fullName || `${firstName} ${lastName}`.trim(),
    bio: defaultBio,
    designation: defaultDesignation,
    location: "",
    website: "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: user?.primaryPhoneNumber?.phoneNumber || ""
  });

  useEffect(() => {
    if (isLoaded && user) {
      setFields((prev) => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.primaryEmailAddress?.emailAddress || prev.email,
        phone: user.primaryPhoneNumber?.phoneNumber || prev.phone,
        bio: prev.bio === "" ? defaultBio : prev.bio,
        designation: prev.designation === "" ? defaultDesignation : prev.designation
      }));
    }
  }, [isLoaded, user, defaultBio, defaultDesignation]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "upi", label: "Primary UPI", value: "mentor@upi" },
    { id: "2", type: "bank", label: "Savings Account", value: "1234567890123456", secondary: "SBIN0001234" },
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPm, setNewPm] = useState({ type: "upi" as "upi" | "bank", value: "", secondary: "" });

  const addPayment = () => {
    if (!newPm.value) return;
    setPaymentMethods((prev) => [...prev, { id: Date.now().toString(), type: newPm.type, label: newPm.type === "upi" ? "UPI ID" : "Bank Account", value: newPm.value, secondary: newPm.secondary }]);
    setNewPm({ type: "upi", value: "", secondary: "" });
    setShowAddPayment(false);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Wide Header Banner Card ── */}
      <ProfileBanner
        initials={initials}
        name={fields.name}
        role={fields.designation}
        email={fields.email}
        phone={fields.phone}
        isEditable={true}
        onEditCover={() => { }}
        onEditProfile={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
        avatarChildren={<ProfileAvatar initials={initials} profilePhoto={profilePhoto} />}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Bio Section */}
        <div className="flex flex-col gap-6" id="about-section">
          <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 16, padding: 28, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}>
            <h4 style={{ fontSize: 18, fontWeight: 600, color: D.text, margin: "0 0 20px" }}>About</h4>
            <div className="flex flex-col gap-3">
              <EditableField label="Full Name" value={fields.name} icon={User} onSave={(v) => setFields((f) => ({ ...f, name: v }))} />
              <EditableField label="Bio" value={fields.bio} icon={FileText} multiline onSave={(v) => setFields((f) => ({ ...f, bio: v }))} />
              <EditableField label="Designation" value={fields.designation} icon={Briefcase} onSave={(v) => setFields((f) => ({ ...f, designation: v }))} />
              <EditableField label="Location" value={fields.location} icon={MapPin} onSave={(v) => setFields((f) => ({ ...f, location: v }))} />
              <EditableField label="Website" value={fields.website} icon={Globe} onSave={(v) => setFields((f) => ({ ...f, website: v }))} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Upcoming Session */}
          <div className="bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-slate-200 hover:shadow-floating hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">Upcoming Session</h3>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full tracking-wide">
                Confirmed
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0 border border-blue-100">
                A
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-900 leading-none mb-1.5">Alex Johnson</p>
                <p className="text-xs font-medium text-slate-500">React Architecture Review</p>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="flex-1 bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl text-center">
                <p className="text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Date</p>
                <p className="text-sm font-bold text-slate-800">Today</p>
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl text-center">
                <p className="text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Time</p>
                <p className="text-sm font-bold text-slate-800">4:00 PM</p>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold py-3 rounded-xl transition-all shadow-sm active:scale-[0.98]">
              Join Meeting Room
            </button>
          </div>

          {/* Payment Methods */}
          <div style={{ background: D.surface, border: `1px solid ${D.border}`, borderRadius: 16, padding: 28, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}>
            <div className="flex items-center justify-between mb-6">
              <h4 style={{ fontSize: 18, fontWeight: 600, color: D.text, margin: 0 }}>Payment Info</h4>
              <button
                onClick={() => setShowAddPayment((v) => !v)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: D.accentDim, border: `1px solid ${D.borderAccent}`, borderRadius: 8, fontSize: 13, color: D.accent, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}
              >
                <Plus size={14} strokeWidth={2.5} /> Add New
              </button>
            </div>

            <AnimatePresence>
              {showAddPayment && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden", marginBottom: 20 }}
                >
                  <div style={{ background: D.bg, border: `1px solid ${D.borderAccent}`, borderRadius: 12, padding: 20 }}>
                    <div className="flex gap-2 mb-4">
                      {(["upi", "bank"] as const).map((t) => (
                        <button key={t} onClick={() => setNewPm((v) => ({ ...v, type: t }))}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm font-semibold cursor-pointer transition-all uppercase tracking-wide"
                          style={{ borderColor: newPm.type === t ? D.accent : D.border, background: newPm.type === t ? D.accentDim : "#FFFFFF", color: newPm.type === t ? D.accent : D.muted }}>
                          {t === "upi" ? "UPI" : "Bank Account"}
                        </button>
                      ))}
                    </div>
                    <input placeholder={newPm.type === "upi" ? "UPI ID (e.g. you@upi)" : "Account Number"} value={newPm.value} onChange={(e) => setNewPm((v) => ({ ...v, value: e.target.value }))} className="w-full px-3 py-3 bg-white border rounded-lg text-sm outline-none mb-3" style={{ borderColor: D.borderAccent, color: D.text }} />
                    {newPm.type === "bank" && (
                      <input placeholder="IFSC Code" value={newPm.secondary} onChange={(e) => setNewPm((v) => ({ ...v, secondary: e.target.value }))} className="w-full px-3 py-3 bg-white border rounded-lg text-sm outline-none mb-3" style={{ borderColor: D.borderAccent, color: D.text }} />
                    )}
                    <div className="flex gap-3">
                      <button onClick={addPayment} className="flex-1 py-3 border-none rounded-lg text-sm font-semibold text-white cursor-pointer transition-colors" style={{ background: D.accent }} onMouseEnter={(e) => (e.currentTarget.style.background = D.accentHover)} onMouseLeave={(e) => (e.currentTarget.style.background = D.accent)}>Save Payment Method</button>
                      <button onClick={() => setShowAddPayment(false)} className="px-5 py-3 bg-white border rounded-lg text-sm font-medium cursor-pointer" style={{ borderColor: D.border, color: D.muted }}>Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-4">
              {paymentMethods.map((pm) => (
                <PaymentCard key={pm.id} pm={pm} onDelete={() => setPaymentMethods((prev) => prev.filter((p) => p.id !== pm.id))} />
              ))}
              {paymentMethods.length === 0 && (
                <div className="text-center py-8 text-sm" style={{ color: D.muted }}>
                  No payment methods added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Popover */}
      <AnimatePresence>
        {showShare && <SharePopover onClose={() => setShowShare(false)} />}
      </AnimatePresence>
    </div>
  );
}


function SessionsTab() {
  const exportSessions = async () => {
    await exportToExcel("session_data", sessionsOverTime.map((d) => ({ Month: d.date, Sessions: d.value })), ["Month", "Sessions"]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Total Sessions" value="169" icon={Activity} trend="+14%" />
        <StatCard label="Avg. Duration" value="48 min" icon={Clock} accent="#8B5CF6" bgHighlight="#F5F3FF" trend="+5%" />
        <StatCard label="Avg. Rating" value="4.9" icon={Star} accent="#F59E0B" bgHighlight="#FFFBEB" trend="Top 10%" />
        <StatCard label="Peak Hour" value="7 – 9 PM" icon={Zap} accent="#10B981" bgHighlight="#ECFDF5" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <DashCard
          title="Sessions Over Time"
          subtitle="Monthly session count"
          action={<ExportBtn onClick={exportSessions} />}
        >
          <div className="mt-6">
            <PremiumAreaChart data={sessionsOverTime} color={D.accent} height={280} />
          </div>
        </DashCard>
        <DashCard title="Device Breakdown" subtitle="How students connect">
          <div className="mt-6">
            <PremiumDonutChart data={deviceBreakdown} height={280} />
          </div>
        </DashCard>
      </div>
    </div>
  );
}


function PaymentsTab() {
  const exportPayments = async () => {
    await exportToExcel(
      "payment_data",
      recentTransactions.map((t) => ({
        "Transaction ID": t.id, "Student": t.student, "Amount (₹)": t.amount,
        "Method": t.method, "Status": t.status, "Date": t.date,
      })),
      ["Transaction ID", "Student", "Amount (₹)", "Method", "Status", "Date"]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Revenue" value="₹1,37,000" icon={DollarSign} trend="+22%" />
        <StatCard label="Transactions" value="58" icon={Hash} accent="#10B981" bgHighlight="#ECFDF5" trend="+8%" />
        <StatCard label="Avg. Transaction" value="₹2,362" icon={TrendingUp} accent="#8B5CF6" bgHighlight="#F5F3FF" trend="+4%" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DashCard title="Payment Methods" subtitle="Revenue by channel" action={<ExportBtn onClick={exportPayments} />}>
          <div className="mt-6">
            <PremiumBarChart data={paymentMethodBreakdown} color={D.accent} height={260} valuePrefix="₹" />
          </div>
        </DashCard>
        <DashCard title="Revenue Trend" subtitle="Monthly earnings (₹)">
          <div className="mt-6">
            <PremiumLineChart data={paymentTrends} color="#10B981" height={260} valuePrefix="₹" />
          </div>
        </DashCard>
      </div>
      <DashCard title="Recent Transactions" subtitle="Latest payment activity">
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: `1px solid ${D.border}` }}>
                {["ID", "Student", "Amount", "Method", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: D.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.id} className="transition-colors border-b" style={{ borderColor: D.border }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = D.bg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-4 py-4 text-sm font-medium" style={{ color: D.muted }}>{t.id}</td>
                  <td className="px-4 py-4 text-sm font-semibold" style={{ color: D.text }}>{t.student}</td>
                  <td className="px-4 py-4 text-sm font-bold" style={{ color: D.text }}>₹{t.amount.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm" style={{ color: D.muted }}>{t.method}</td>
                  <td className="px-4 py-4"><StatusBadge status={t.status as any} /></td>
                  <td className="px-4 py-4 text-sm" style={{ color: D.muted }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashCard>
    </div>
  );
}

export default function MentorDashboardPage() {
  const { data } = useMentorOnboarding();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const tabVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: D.bg, color: D.text }}>
      <nav className={`w-full ${isSidebarCollapsed ? "md:w-[88px]" : "md:w-[240px]"} shrink-0 sticky top-0 z-20 flex flex-row md:flex-col gap-2 p-4 md:py-9 ${isSidebarCollapsed ? "md:px-3" : "md:px-5"} md:h-screen overflow-x-auto hide-scrollbar transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}
        style={{ background: D.surface, borderRight: `1px solid ${D.border}`, borderBottom: `1px solid ${D.border}` }}>

        {/* Logo & Toggle */}
        <div className={`hidden md:flex items-center ${isSidebarCollapsed ? "flex-col justify-center gap-5 pt-2" : "justify-between"} pb-8 mb-4 px-2`} style={{ borderBottom: `1px solid ${D.border}` }}>
          {!isSidebarCollapsed ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
              <Link href="/" className="flex items-center -ml-2" style={{ textDecoration: "none" }}>
                <Image
                  src="/logo.png"
                  alt="MentoMania Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain -mt-1"
                />
                <span className="font-bold text-[22px] text-gray-900 -ml-1.5 pt-1" style={{ letterSpacing: "-0.02em" }}>
                  ento<span className="text-blue-600">Mania</span>
                </span>
              </Link>
              <p style={{ fontSize: 12, color: D.muted, marginTop: 4, fontWeight: 600, paddingLeft: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Dashboard</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center shrink-0">
              <Image src="/logo.png" alt="Mentomania Logo" width={38} height={38} className="object-contain" />
            </motion.div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center shrink-0"
            style={{ color: D.muted }}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all relative whitespace-nowrap ${isSidebarCollapsed ? "md:justify-center md:px-0" : ""}`}
              style={{
                background: isActive ? D.accentDim : "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = D.bg }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent" }}
            >
              {/* Active bar */}
              {isActive && (
                <motion.span layoutId="activeTab" style={{
                  position: "absolute", left: isSidebarCollapsed ? -12 : -20, top: "25%", height: "50%", width: 4,
                  background: D.accent, borderRadius: "0 4px 4px 0",
                }} className="hidden md:block transition-all duration-300" />
              )}
              <tab.icon size={20} color={isActive ? D.accent : D.muted} strokeWidth={isActive ? 2.5 : 2} />

              {!isSidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                  fontSize: 15, fontWeight: isActive ? 600 : 500,
                  color: isActive ? D.accent : D.muted,
                }}>
                  {tab.label}
                </motion.span>
              )}
            </button>
          );
        })}

        {/* Bottom: Resume */}
        <div className={`hidden md:flex mt-auto ${isSidebarCollapsed ? "justify-center" : ""}`}>
          <a
            href="#"
            download
            className={`flex items-center gap-2.5 py-3 ${isSidebarCollapsed ? "px-3" : "px-4"} bg-white border rounded-xl text-sm font-medium transition-all`}
            style={{
              borderColor: D.border, color: D.text, textDecoration: "none",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = D.borderAccent; e.currentTarget.style.background = D.bg; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = D.border; e.currentTarget.style.background = "#FFFFFF"; }}
          >
            <Download size={18} color={D.muted} /> {!isSidebarCollapsed && "Download Resume"}
          </a>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="flex-1 w-full min-w-0 p-4 sm:p-8 md:p-12 overflow-y-auto">
        {/* Page Header */}
        <div className="mb-8 md:mb-10">
          <p style={{ fontSize: 13, fontWeight: 600, color: D.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {currentTab?.label}
          </p>
          <h1 className="text-[32px] md:text-[36px] font-bold m-0" style={{ color: D.text, letterSpacing: "-0.02em" }}>
            {activeTab === "profile" && `Your Profile`}
            {activeTab === "sessions" && `Session Analytics`}
            {activeTab === "payments" && `Payment Analytics`}
          </h1>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={tabVariants} initial="hidden" animate="show" exit="exit">
            {activeTab === "profile" && <ProfileTab mentorData={data} />}
            {activeTab === "sessions" && <SessionsTab />}
            {activeTab === "payments" && <PaymentsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
