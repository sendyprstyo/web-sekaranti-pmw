'use client';

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ADMIN_LOGO_URL,
  ADMIN_QRIS_URL,
  downloadAdminOrderNotaImage,
  shareAdminOrderNotaImage,
} from "../lib/admin-nota";
import {
  ADMIN_ORDER_STATUSES,
  AdminDashboardPayload,
  AdminOrder,
  AdminOrderStatus,
  AdminOwnerRecord,
  AdminStats,
  AdminUser,
  buildAdminCustomerWhatsappUrl,
  resolveOrderNotaUrl,
  STATUS_BADGE_CLASSES,
} from "../lib/admin-types";
import { formatRupiah } from "../lib/open-po";

const DELIVERY_FILTER_OPTIONS = [
  "COD Kampus Polines (Tembalang)",
  "COD Area Tembalang / Kota Semarang",
  "Antar Alamat Kota Semarang",
];

type DashboardFetchResult =
  | { kind: "unauthorized" }
  | { kind: "error"; message: string }
  | { kind: "success"; payload: AdminDashboardPayload; fetchedAt: string };

async function fetchDashboardData(): Promise<DashboardFetchResult> {
  try {
    const res = await fetch("/api/admin/orders", { cache: "no-store" });
    if (res.status === 401) {
      return { kind: "unauthorized" };
    }

    const data = (await res.json()) as Partial<AdminDashboardPayload> & {
      ok?: boolean;
      message?: string;
    };

    if (!res.ok || !data.ok || !data.user) {
      return {
        kind: "error",
        message: data.message || "Gagal memuat daftar PO.",
      };
    }

    return {
      kind: "success",
      payload: data as AdminDashboardPayload,
      fetchedAt:
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB",
    };
  } catch {
    return { kind: "error", message: "Gagal memuat data dashboard." };
  }
}

function AdminLoginView({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setErrorMsg(data.message || "Email atau password salah.");
        return;
      }

      setPassword("");
      onLoginSuccess();
    } catch {
      setErrorMsg("Gangguan jaringan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(107,29,47,0.08),transparent_45%),#fcf9f4]">
      <div className="w-full max-w-[430px] bg-white rounded-3xl border border-[#D4AF37]/45 shadow-[0_24px_60px_rgba(49,25,8,0.12)] overflow-hidden">
        <div className="bg-gradient-to-br from-[#2D1A0E] via-[#3D2210] to-[#1F1D1A] px-7 py-7 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/45 text-[#ffe088] text-[10px] font-bold tracking-[0.2em] uppercase">
            <span>✦</span>
            <span>SEKARANTI-SMG · OWNER PORTAL</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-white font-normal mt-3">
            Management Open PO
          </h1>
          <p className="text-xs text-[#F2EDE4]/80 mt-1 leading-relaxed">
            Portal khusus owner SEKARANTI untuk memantau pesanan, COD Polines, dan nota Batch 1.
          </p>
        </div>

        <div className="p-7">
          {errorMsg && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800"
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-login-email"
                className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#311908] mb-1.5"
              >
                Email Admin / Owner
              </label>
              <input
                id="admin-login-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email owner"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c3bb] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#311908] text-sm text-[#1c1c19]"
              />
            </div>

            <div>
              <label
                htmlFor="admin-login-password"
                className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#311908] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-3.5 py-2.5 pr-16 rounded-xl border border-[#d4c3bb] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#311908] text-sm text-[#1c1c19]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold !text-[#8C7D73] hover:!text-[#311908] cursor-pointer"
                >
                  {showPassword ? "Tutup" : "Lihat"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#311908] hover:bg-[#4A2E1B] disabled:opacity-60 !text-white text-xs uppercase tracking-[0.18em] font-bold border border-[#D4AF37]/35 shadow-sm transition-colors cursor-pointer"
            >
              <span className="text-white">
                {loading ? "Memeriksa..." : "Masuk ke Dashboard"}
              </span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#e2d6ce] flex items-center justify-between text-xs text-[#8C7D73]">
            <Link href="/" className="hover:text-[#311908] transition-colors">
              ← Beranda SEKARANTI
            </Link>
            <Link
              href="/open-po"
              className="hover:text-[#311908] transition-colors"
            >
              Form Open PO →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStatsGrid({
  stats,
  lastUpdated,
}: {
  stats: AdminStats;
  lastUpdated: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
      <div className="bg-white rounded-2xl border border-[#e2d6ce] p-4 shadow-xs">
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-[#8C7D73] font-bold">
          Order Aktif / Total
        </span>
        <div className="font-display text-3xl text-[#311908] mt-1 leading-tight">
          {stats.activeOrders} / {stats.totalOrders}
        </div>
        <p className="text-xs text-[#50443e] mt-1">
          {stats.pendingOrders} perlu konfirmasi
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2d6ce] p-4 shadow-xs">
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-[#8C7D73] font-bold">
          Total Hijab (Aktif)
        </span>
        <div className="font-display text-3xl text-[#311908] mt-1 leading-tight">
          {stats.totalQty} pcs
        </div>
        <p className="text-xs text-[#50443e] mt-1">
          {stats.codPolinesCount} order COD Kampus Polines
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2d6ce] p-4 shadow-xs">
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-[#8C7D73] font-bold">
          Estimasi Omzet Aktif
        </span>
        <div className="font-display text-3xl text-[#311908] mt-1 leading-tight">
          {formatRupiah(stats.totalRevenue)}
        </div>
        <p className="text-xs text-[#50443e] mt-1">
          {stats.promoUsedCount} order pakai BERSAMASEKARANTI
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2d6ce] p-4 shadow-xs">
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-[#8C7D73] font-bold">
          Terakhir Diperbarui
        </span>
        <div className="font-display text-2xl text-[#311908] mt-2 leading-tight">
          {lastUpdated || "-"}
        </div>
        <p className="text-xs text-[#50443e] mt-1">
          Data live dari Google Sheets
        </p>
      </div>
    </div>
  );
}

function AdminOrderDetailModal({
  order,
  busyDelete,
  onClose,
  onSendNotaLinkWhatsapp,
  onCopyNotaLink,
  onDownloadImage,
  onShareImage,
  onDelete,
}: {
  order: AdminOrder;
  busyDelete: boolean;
  onClose: () => void;
  onSendNotaLinkWhatsapp: (order: AdminOrder) => void;
  onCopyNotaLink: (order: AdminOrder) => void;
  onDownloadImage: (order: AdminOrder) => void;
  onShareImage: (order: AdminOrder) => void;
  onDelete: (orderCode: string) => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detail PO ${order.orderCode}`}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#1F1D1A]/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-[#D4AF37]/45 max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#e2d6ce] mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={ADMIN_LOGO_URL}
              alt="SEKARANTI Logo"
              width={56}
              height={42}
              className="h-11 w-auto rounded-lg border border-[#e2d6ce] bg-white object-contain"
            />
            <div>
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#8C7D73] font-bold block">
                Detail &amp; Nota Pemesanan PO
              </span>
              <h3 className="font-display text-2xl text-[#311908] leading-tight">
                {order.orderCode}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-[#e2d6ce] bg-white hover:bg-[#FAF7F2] !text-[#311908] text-xs font-semibold cursor-pointer"
          >
            ✕ Tutup
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#e2d6ce] space-y-1">
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#8C7D73] font-bold block">
              Pemesan
            </span>
            <p className="font-semibold text-[#1c1c19] text-sm">
              {order.fullName}
            </p>
            <p className="text-[#50443e]">+{order.whatsapp}</p>
            <p className="text-[#50443e]">
              {order.affiliationLabel}
              {order.departmentOrClass ? ` · ${order.departmentOrClass}` : ""}
            </p>
            <p className="text-[11px] text-[#8C7D73] pt-0.5">
              {order.timestamp}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#e2d6ce] space-y-1">
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#8C7D73] font-bold block">
              Pengambilan &amp; Bayar
            </span>
            <p className="font-semibold text-[#1c1c19] text-sm">
              {order.deliveryMethodLabel}
            </p>
            {order.codSpot && (
              <p className="text-[#50443e]">Titik COD: {order.codSpot}</p>
            )}
            {order.address && (
              <p className="text-[#50443e]">Alamat: {order.address}</p>
            )}
            <p className="text-[#50443e]">Bayar: {order.paymentMethodLabel}</p>
            <p className="text-[#311908] font-semibold">
              Status: {order.status}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#e2d6ce] mb-3.5 text-xs space-y-1.5">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#8C7D73] font-bold block">
            Rincian Motif ({order.totalQty} pcs)
          </span>
          <p className="text-[#1c1c19]">
            Puspa Raras: <b>{order.qtyPuspaRaras}</b> · Sekar Wengi:{" "}
            <b>{order.qtySekarWengi}</b> · Taman Sari Sekar:{" "}
            <b>{order.qtyTamanSariSekar}</b> · Tirta Sekar:{" "}
            <b>{order.qtyTirtaSekar}</b>
          </p>
          <p className="text-[#50443e]">
            Harga Satuan: {formatRupiah(order.unitPrice)} · Kode Diskon:{" "}
            <b>{order.promoCode || "-"}</b>
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#e2d6ce] mb-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e2d6ce]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#8C7D73] font-bold block">
                Total Tagihan
              </span>
              <div className="font-display text-3xl text-[#6B1D2F] font-semibold mt-0.5">
                {formatRupiah(order.totalAmount)}
              </div>
            </div>
            <p className="text-xs text-[#50443e] max-w-xs leading-relaxed">
              Logo SEKARANTI, rincian tagihan, dan gambar QRIS di bawah otomatis masuk ke dalam file <b>Nota Gambar (PNG)</b> siap scan.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Image
              src={ADMIN_QRIS_URL}
              alt="QRIS Pembayaran SEKARANTI"
              width={420}
              height={592}
              className="w-full max-w-[320px] sm:max-w-[360px] h-auto rounded-2xl border border-[#D4AF37]/40 bg-white shadow-xs"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-3 border-t border-[#e2d6ce]">
          <button
            type="button"
            onClick={() => onSendNotaLinkWhatsapp(order)}
            className="flex-1 min-w-[200px] py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] !text-white text-xs uppercase tracking-[0.08em] font-bold cursor-pointer shadow-xs"
          >
            <span className="text-white">📲 Kirim Link Nota ke WA</span>
          </button>

          <button
            type="button"
            onClick={() => onCopyNotaLink(order)}
            className="py-3 px-4 rounded-xl border border-[#d4c3bb] bg-[#FAF7F2] hover:bg-[#f3ede4] !text-[#311908] text-xs font-bold cursor-pointer"
          >
            🔗 Salin Link Nota
          </button>

          <button
            type="button"
            onClick={() => onDownloadImage(order)}
            className="py-3 px-4 rounded-xl bg-[#311908] hover:bg-[#4A2E1B] !text-white text-xs font-bold border border-[#D4AF37]/40 cursor-pointer"
          >
            <span className="text-white">⬇ Nota Gambar</span>
          </button>

          <button
            type="button"
            onClick={() => onShareImage(order)}
            className="py-3 px-4 rounded-xl bg-[#6B1D2F] hover:bg-[#531423] !text-white text-xs font-bold cursor-pointer"
          >
            <span className="text-white">📤 Share Gambar</span>
          </button>

          <button
            type="button"
            disabled={busyDelete}
            onClick={() => onDelete(order.orderCode)}
            className="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 !text-rose-800 text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            🗑 Hapus PO
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminSecurityModal({
  owners,
  onClose,
  onSuccessToast,
  onOwnersUpdated,
}: {
  owners: AdminOwnerRecord[];
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
  onOwnersUpdated: () => void;
}) {
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPw, setAddPw] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "changePassword",
          currentPassword: curPw,
          newPassword: newPw,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        onSuccessToast(data.message || "Gagal mengubah password.");
        return;
      }
      setCurPw("");
      setNewPw("");
      onSuccessToast(data.message || "Password berhasil diperbarui.");
    } finally {
      setBusy(false);
    }
  };

  const handleAddOwner = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "addOwner",
          name: addName,
          email: addEmail,
          password: addPw,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        onSuccessToast(data.message || "Gagal menambah owner.");
        return;
      }
      setAddName("");
      setAddEmail("");
      setAddPw("");
      onSuccessToast(data.message || "Owner baru berhasil ditambahkan.");
      onOwnersUpdated();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tim Owner dan Keamanan"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#1F1D1A]/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-[#D4AF37]/45 max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#e2d6ce]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#8C7D73] font-bold block">
              Keamanan Portal
            </span>
            <h3 className="font-display text-2xl text-[#311908]">
              Tim Owner &amp; Password
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-[#e2d6ce] bg-white hover:bg-[#FAF7F2] !text-[#311908] text-xs font-semibold cursor-pointer"
          >
            ✕ Tutup
          </button>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#311908] block">
            Daftar Owner Terdaftar
          </span>
          {owners.map((own) => (
            <div
              key={own.email}
              className="p-3 rounded-xl bg-[#FAF7F2] border border-[#e2d6ce] flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <p className="font-bold text-[#311908]">{own.name}</p>
                <p className="text-[#8C7D73]">{own.email}</p>
              </div>
              <div className="text-right text-[11px] text-[#8C7D73]">
                <span className="block">Login terakhir:</span>
                <span>{own.lastLogin || "-"}</span>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleChangePassword}
          className="pt-4 border-t border-[#e2d6ce] space-y-3"
        >
          <span className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#311908] block">
            Ubah Password Akun Saya
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="password"
              required
              value={curPw}
              onChange={(e) => setCurPw(e.target.value)}
              placeholder="Password saat ini"
              className="px-3.5 py-2.5 rounded-xl border border-[#e2d6ce] bg-[#FAF7F2] text-sm"
            />
            <input
              type="password"
              required
              minLength={6}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Password baru (min 6)"
              className="px-3.5 py-2.5 rounded-xl border border-[#e2d6ce] bg-[#FAF7F2] text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 px-4 rounded-xl bg-[#311908] hover:bg-[#4A2E1B] !text-white text-xs uppercase tracking-[0.14em] font-bold cursor-pointer disabled:opacity-60"
          >
            <span className="text-white">Simpan Password Baru</span>
          </button>
        </form>

        <form
          onSubmit={handleAddOwner}
          className="pt-4 border-t border-[#e2d6ce] space-y-2.5"
        >
          <span className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#311908] block">
            Tambah Akun Owner Baru
          </span>
          <input
            type="text"
            required
            minLength={2}
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            placeholder="Nama owner"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2d6ce] bg-[#FAF7F2] text-sm"
          />
          <input
            type="email"
            required
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            placeholder="Email owner"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2d6ce] bg-[#FAF7F2] text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            value={addPw}
            onChange={(e) => setAddPw(e.target.value)}
            placeholder="Password awal (min 6 karakter)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2d6ce] bg-[#FAF7F2] text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 px-4 rounded-xl bg-[#311908] hover:bg-[#4A2E1B] !text-white text-xs uppercase tracking-[0.14em] font-bold cursor-pointer disabled:opacity-60"
          >
            <span className="text-white">Tambah Owner</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminPortal() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    activeOrders: 0,
    pendingOrders: 0,
    totalQty: 0,
    totalRevenue: 0,
    promoUsedCount: 0,
    codPolinesCount: 0,
  });
  const [owners, setOwners] = useState<AdminOwnerRecord[]>([]);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [lastUpdated, setLastUpdated] = useState("-");
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [busyDelete, setBusyDelete] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const applyDashboardResult = useCallback(
    (result: DashboardFetchResult) => {
      if (result.kind === "unauthorized") {
        setUser(null);
        setOrders([]);
      } else if (result.kind === "error") {
        showToast(result.message);
      } else {
        setUser(result.payload.user);
        setOrders(result.payload.orders || []);
        if (result.payload.stats) setStats(result.payload.stats);
        setOwners(result.payload.owners || []);
        setSpreadsheetUrl(result.payload.spreadsheetUrl || "");
        setLastUpdated(result.fetchedAt);
      }
      setAuthChecked(true);
    },
    [showToast],
  );

  const loadDashboard = useCallback(async () => {
    setRefreshing(true);
    const result = await fetchDashboardData();
    applyDashboardResult(result);
    setRefreshing(false);
  }, [applyDashboardResult]);

  useEffect(() => {
    let active = true;
    fetchDashboardData().then((result) => {
      if (active) {
        applyDashboardResult(result);
      }
    });
    return () => {
      active = false;
    };
  }, [applyDashboardResult]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDetailOrder(null);
        setSecurityOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (methodFilter && o.deliveryMethodLabel !== methodFilter) return false;
      if (q) {
        const hay = `${o.orderCode} ${o.fullName} ${o.whatsapp} ${o.departmentOrClass} ${o.itemsSummary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, searchQuery, statusFilter, methodFilter]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    setUser(null);
    setOrders([]);
  };

  const handleStatusChange = async (
    orderCode: string,
    newStatus: AdminOrderStatus,
  ) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, newStatus }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        unauthorized?: boolean;
        message?: string;
      };
      if (res.status === 401 || data.unauthorized) {
        setUser(null);
        return;
      }
      if (!res.ok || !data.ok) {
        showToast(data.message || "Gagal memperbarui status.");
        return;
      }
      showToast(`Status ${orderCode} → ${newStatus}`);
      await loadDashboard();
    } catch {
      showToast("Gangguan jaringan saat mengubah status.");
    }
  };

  const handleDeleteOrder = async (orderCode: string) => {
    if (
      !window.confirm(
        `Yakin ingin menghapus pesanan ${orderCode} secara permanen dari Google Sheets?`,
      )
    ) {
      return;
    }

    setBusyDelete(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        unauthorized?: boolean;
        message?: string;
      };
      if (res.status === 401 || data.unauthorized) {
        setUser(null);
        return;
      }
      if (!res.ok || !data.ok) {
        showToast(data.message || "Gagal menghapus pesanan.");
        return;
      }
      setDetailOrder(null);
      showToast(data.message || `Pesanan ${orderCode} berhasil dihapus.`);
      await loadDashboard();
    } catch {
      showToast("Gangguan jaringan saat menghapus pesanan.");
    } finally {
      setBusyDelete(false);
    }
  };

  const handleDownloadImage = async (order: AdminOrder) => {
    try {
      await downloadAdminOrderNotaImage(order);
      showToast(`Nota gambar ${order.orderCode} berhasil didownload!`);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Gagal membuat Nota gambar.",
      );
    }
  };

  const handleShareImage = async (order: AdminOrder) => {
    try {
      const result = await shareAdminOrderNotaImage(order);
      if (result.mode === "shared") {
        showToast("Nota gambar siap dikirim via WhatsApp!");
      } else {
        showToast(
          result.copied
            ? "Nota gambar didownload & disalin ke clipboard (tinggal Ctrl+V di WA Web)."
            : "Nota gambar berhasil didownload ke perangkatmu.",
        );
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      showToast("Gagal membagikan nota gambar.");
    }
  };

  const handleSendNotaLinkWhatsapp = (order: AdminOrder) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : undefined;
    window.open(
      buildAdminCustomerWhatsappUrl(order, origin),
      "_blank",
      "noopener,noreferrer",
    );
    showToast("Chat WA pembeli dibuka dengan Link Nota & QRIS otomatis!");
  };

  const handleCopyNotaLink = async (order: AdminOrder) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : undefined;
    const url = resolveOrderNotaUrl(order, origin);
    if (!url) {
      showToast("Link nota belum tersedia. Klik Refresh terlebih dahulu.");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link Nota disalin! (Otomatis nonaktif saat status Selesai)");
    } catch {
      showToast("Gagal menyalin link nota.");
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#fcf9f4] flex items-center justify-center px-4">
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-[#e2d6ce] shadow-xs text-sm text-[#311908] font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>Memeriksa sesi Owner Portal...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLoginView onLoginSuccess={loadDashboard} />;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] pb-16">
      {/* Topbar */}
      <header className="sticky top-0 z-20 bg-[#fcf9f4]/95 backdrop-blur-md border-b border-[#e2d6ce]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37] bg-white flex-shrink-0">
              <Image
                src={ADMIN_LOGO_URL}
                alt="SEKARANTI"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-display text-lg sm:text-xl text-[#311908] leading-tight">
                SEKARANTI · Open PO Batch 1
              </h1>
              <p className="text-[11px] text-[#8C7D73]">
                Dashboard Management Daftar Pesanan &amp; Nota
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[#f3ede4] border border-[#e2d6ce] text-xs font-semibold text-[#311908]">
              {user.name} ({user.email})
            </span>

            {spreadsheetUrl && (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl border border-[#e2d6ce] bg-white hover:bg-[#f3ede4] !text-[#311908] text-xs font-semibold transition-colors"
              >
                Buka Google Sheets ↗
              </a>
            )}

            <button
              type="button"
              onClick={() => setSecurityOpen(true)}
              className="px-3 py-2 rounded-xl border border-[#e2d6ce] bg-white hover:bg-[#f3ede4] !text-[#311908] text-xs font-semibold cursor-pointer"
            >
              Tim &amp; Keamanan
            </button>

            <button
              type="button"
              disabled={refreshing}
              onClick={loadDashboard}
              className="px-3 py-2 rounded-xl border border-[#e2d6ce] bg-white hover:bg-[#f3ede4] !text-[#311908] text-xs font-semibold cursor-pointer disabled:opacity-60"
            >
              {refreshing ? "Memuat..." : "↻ Refresh"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 !text-rose-800 text-xs font-semibold cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <AdminStatsGrid stats={stats} lastUpdated={lastUpdated} />

        {/* Orders Table Panel */}
        <div className="bg-white rounded-3xl border border-[#e2d6ce] shadow-sm overflow-hidden">
          <div className="p-4 bg-[#fdfbf8] border-b border-[#e2d6ce] grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-2.5 items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Kode PO, Nama, No. WA, atau Prodi..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2d6ce] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:border-[#311908] text-sm"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter Status"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2d6ce] bg-[#FAF7F2] focus:bg-white focus:outline-none text-sm"
            >
              <option value="">Semua Status</option>
              {ADMIN_ORDER_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              aria-label="Filter Metode Pengambilan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2d6ce] bg-[#FAF7F2] focus:bg-white focus:outline-none text-sm"
            >
              <option value="">Semua Metode</option>
              {DELIVERY_FILTER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <span className="text-xs font-semibold text-[#8C7D73] px-1">
              {filteredOrders.length} order
            </span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-12 px-4 text-center text-sm text-[#8C7D73]">
              Belum ada pesanan yang cocok dengan filter saat ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[940px]">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#e2d6ce] text-left text-[10.5px] uppercase tracking-[0.14em] text-[#8C7D73] font-bold">
                    <th className="py-3 px-4">Kode PO &amp; Waktu</th>
                    <th className="py-3 px-4">Pemesan</th>
                    <th className="py-3 px-4">Pesanan Motif</th>
                    <th className="py-3 px-4">Total &amp; Promo</th>
                    <th className="py-3 px-4">Metode &amp; Lokasi</th>
                    <th className="py-3 px-4">Status &amp; Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efe7e1] text-[13px]">
                  {filteredOrders.map((o) => {
                    const locationText = o.codSpot
                      ? `Titik: ${o.codSpot}`
                      : o.address
                        ? `Alamat: ${o.address}`
                        : "Koordinasi via WA";

                    return (
                      <tr key={o.orderCode} className="hover:bg-[#fcf9f5]">
                        <td className="py-3.5 px-4 align-top">
                          <span className="inline-block font-mono text-xs font-bold text-[#311908] bg-[#f3ede4] border border-[#e2d6ce] px-2 py-0.5 rounded-lg">
                            {o.orderCode}
                          </span>
                          <div className="text-[11px] text-[#8C7D73] mt-1.5">
                            {o.timestamp}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <strong className="text-[#1c1c19]">
                            {o.fullName}
                          </strong>
                          <div className="text-xs text-[#50443e]">
                            +{o.whatsapp}
                          </div>
                          <div className="text-[11px] text-[#8C7D73]">
                            {o.affiliationLabel}
                            {o.departmentOrClass
                              ? ` · ${o.departmentOrClass}`
                              : ""}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <div>{o.itemsSummary}</div>
                          <div className="text-[11px] text-[#8C7D73] mt-1">
                            Total: {o.totalQty} pcs
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <strong className="text-[#6B1D2F]">
                            {formatRupiah(o.totalAmount)}
                          </strong>
                          {o.promoCode && o.promoCode !== "-" && (
                            <div>
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                {o.promoCode}
                              </span>
                            </div>
                          )}
                          <div className="text-[11px] text-[#8C7D73] mt-1">
                            {o.paymentMethodLabel}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <strong className="text-[#1c1c19]">
                            {o.deliveryMethodLabel}
                          </strong>
                          <div className="text-xs text-[#50443e] mt-1 max-w-[220px]">
                            {locationText}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleStatusChange(
                                o.orderCode,
                                e.target.value as AdminOrderStatus,
                              )
                            }
                            aria-label={`Ubah status ${o.orderCode}`}
                            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer min-w-[140px] ${
                              STATUS_BADGE_CLASSES[o.status] ||
                              "bg-[#FAF7F2] border-[#e2d6ce]"
                            }`}
                          >
                            {ADMIN_ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>

                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <button
                              type="button"
                              onClick={() => setDetailOrder(o)}
                              className="px-2.5 py-1.5 rounded-lg border border-[#e2d6ce] bg-white hover:bg-[#f3ede4] !text-[#311908] text-[11.5px] font-semibold cursor-pointer"
                            >
                              Detail
                            </button>

                            <a
                              href={buildAdminCustomerWhatsappUrl(
                                o,
                                typeof window !== "undefined"
                                  ? window.location.origin
                                  : undefined,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] !text-white text-[11.5px] font-semibold"
                            >
                              <span className="text-white">Kirim Link WA</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(o.orderCode)}
                              className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 !text-rose-700 text-[11.5px] font-semibold cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {detailOrder && (
        <AdminOrderDetailModal
          order={detailOrder}
          busyDelete={busyDelete}
          onClose={() => setDetailOrder(null)}
          onSendNotaLinkWhatsapp={handleSendNotaLinkWhatsapp}
          onCopyNotaLink={handleCopyNotaLink}
          onDownloadImage={handleDownloadImage}
          onShareImage={handleShareImage}
          onDelete={handleDeleteOrder}
        />
      )}

      {securityOpen && (
        <AdminSecurityModal
          owners={owners}
          onClose={() => setSecurityOpen(false)}
          onSuccessToast={showToast}
          onOwnersUpdated={loadDashboard}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-60 px-4 py-3 rounded-xl bg-[#311908] text-white text-xs font-semibold shadow-xl border border-[#D4AF37]/45">
          {toast}
        </div>
      )}
    </div>
  );
}
