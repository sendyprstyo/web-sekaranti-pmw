'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ADMIN_LOGO_URL,
  ADMIN_QRIS_URL,
  downloadAdminOrderNotaImage,
} from "../lib/admin-nota";
import { AdminOrder, parseOrderLineItems } from "../lib/admin-types";
import { formatRupiah, OPEN_PO_BATCH_LABEL } from "../lib/open-po";

const ADMIN_WA_NUMBER = "6285727033141";

function getDisplayLineItems(order: AdminOrder) {
  return parseOrderLineItems(order).map((item) => ({
    name: item.name,
    qty: item.qty,
  }));
}

export function NotaActiveView({ order }: { order: AdminOrder }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);
  const items = getDisplayLineItems(order);

  const proofWhatsappUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(
    `Halo Admin SEKARANTI, saya ingin mengirimkan bukti pembayaran / konfirmasi pesanan untuk Kode PO *${order.orderCode}* (${order.fullName}) senilai ${formatRupiah(order.totalAmount)}.`,
  )}`;

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadMsg(null);
    try {
      await downloadAdminOrderNotaImage(order);
      setDownloadMsg("Gambar Nota & QRIS berhasil disimpan ke perangkatmu.");
    } catch {
      setDownloadMsg("Gagal mengunduh gambar nota. Silakan screenshot halaman ini.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(49,25,8,0.1)] overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-[#e2d6ce] flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-4">
            <Image
              src={ADMIN_LOGO_URL}
              alt="SEKARANTI Logo"
              width={72}
              height={55}
              className="h-14 w-auto object-contain"
              priority
            />
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#6B1D2F] block">
                {OPEN_PO_BATCH_LABEL}
              </span>
              <h1 className="font-display text-xl sm:text-2xl text-[#311908] font-normal mt-0.5">
                Nota Pemesanan Resmi
              </h1>
              <p className="text-xs text-[#8C7D73]">
                sekaranti.web.id · Admin: +62 857-2703-3141
              </p>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/50 text-left sm:text-right">
            <span className="block text-[9.5px] uppercase tracking-[0.18em] text-[#8C7D73] font-bold">
              Kode Pre-Order
            </span>
            <span className="font-mono text-base font-bold text-[#311908]">
              {order.orderCode}
            </span>
            <span className="block text-[11px] text-[#50443e] mt-0.5">
              {order.timestamp}
            </span>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#e2d6ce] space-y-1">
              <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#8C7D73] block">
                Data Pemesan
              </span>
              <p className="font-semibold text-[#1c1c19]">{order.fullName}</p>
              <p className="text-[#50443e]">+{order.whatsapp}</p>
              <p className="text-xs text-[#50443e]">
                {order.affiliationLabel}
                {order.departmentOrClass ? ` · ${order.departmentOrClass}` : ""}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#e2d6ce] space-y-1">
              <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#8C7D73] block">
                Pengambilan &amp; Bayar
              </span>
              <p className="font-semibold text-[#1c1c19]">
                {order.deliveryMethodLabel}
              </p>
              {order.codSpot && (
                <p className="text-xs text-[#50443e]">
                  Titik COD: {order.codSpot}
                </p>
              )}
              {order.address && (
                <p className="text-xs text-[#50443e]">Alamat: {order.address}</p>
              )}
              <p className="text-xs text-[#50443e]">
                {order.paymentMethodLabel}
              </p>
            </div>
          </div>

          {/* Itemized Breakdown */}
          <div className="rounded-2xl border border-[#e2d6ce] overflow-hidden">
            <div className="px-4 py-3 bg-[#311908] text-white flex items-center justify-between text-[11px] uppercase tracking-[0.16em] font-semibold">
              <span>Rincian Motif (Voal Ultrasoft 110×110 cm)</span>
              <span>Subtotal</span>
            </div>

            <div className="divide-y divide-[#efe7e1]">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="px-4 py-3 flex items-center justify-between text-xs sm:text-sm"
                >
                  <div>
                    <span className="font-medium text-[#1c1c19]">
                      {item.name}
                    </span>
                    <span className="text-[#8C7D73] ml-2">
                      × {item.qty} pcs ({formatRupiah(order.unitPrice)})
                    </span>
                  </div>
                  <span className="font-semibold text-[#1c1c19]">
                    {formatRupiah(item.qty * order.unitPrice)}
                  </span>
                </div>
              ))}
            </div>

            {order.promoCode &&
              order.promoCode !== "-" &&
              order.discountAmount > 0 && (
                <div className="px-4 py-2.5 bg-emerald-50 border-t border-[#e2d6ce] flex items-center justify-between text-xs text-emerald-800 font-medium">
                  <span>Diskon Promo ({order.promoCode})</span>
                  <span>− {formatRupiah(order.discountAmount)}</span>
                </div>
              )}

            <div className="px-4 py-4 bg-[#f3ede4] border-t border-[#D4AF37]/40 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#311908]">
                Total Tagihan ({order.totalQty} pcs)
              </span>
              <span className="font-display text-2xl sm:text-3xl text-[#6B1D2F] font-semibold">
                {formatRupiah(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Wide QRIS Payment Section */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF7F2] border border-[#D4AF37]/45 text-center space-y-3">
            <h2 className="font-display text-xl sm:text-2xl text-[#311908] font-normal">
              Scan QRIS Pembayaran
            </h2>
            <p className="text-xs text-[#50443e] max-w-md mx-auto leading-relaxed">
              Scan QRIS di bawah lewat m-Banking atau e-Wallet sesuai nominal{" "}
              <strong className="text-[#6B1D2F]">
                {formatRupiah(order.totalAmount)}
              </strong>{" "}
              (untuk pembayaran COD dapat dibayar langsung saat ketemuan).
            </p>

            <div className="pt-1 flex justify-center">
              <Image
                src={ADMIN_QRIS_URL}
                alt="QRIS Pembayaran SEKARANTI"
                width={454}
                height={640}
                className="w-full max-w-[340px] sm:max-w-[390px] h-auto rounded-2xl border border-[#e2d6ce] bg-white shadow-sm"
                priority
              />
            </div>

            <p className="text-[11px] text-[#8C7D73] pt-1">
              Tautan nota ini aktif selama pesanan diproses dan otomatis dinonaktifkan saat pesanan berstatus <b>Selesai</b>.
            </p>
          </div>

          {downloadMsg && (
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/40 text-xs text-[#311908] font-medium text-center">
              {downloadMsg}
            </div>
          )}

          {/* Customer Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownload}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-[#311908] hover:bg-[#4A2E1B] disabled:opacity-60 !text-white text-xs uppercase tracking-[0.14em] font-bold border border-[#D4AF37]/40 cursor-pointer"
            >
              <span className="text-white">
                {downloading
                  ? "Menyiapkan Gambar..."
                  : "⬇ Download Nota Gambar (PNG)"}
              </span>
            </button>

            <a
              href={proofWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] !text-white text-xs uppercase tracking-[0.14em] font-bold text-center"
            >
              <span className="text-white">💬 Kirim Bukti Bayar ke Admin</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotaUnavailableCard({
  kind,
  orderCode,
}: {
  kind: "completed" | "cancelled" | "invalid" | "not-found";
  orderCode?: string;
}) {
  const copyMap = {
    completed: {
      badge: "PESANAN SELESAI",
      title: "Link Nota Sudah Dinonaktifkan",
      desc: "Pesanan ini telah berstatus Selesai, sehingga rincian nota dan QRIS pembayaran otomatis ditutup demi keamanan data Anda. Terima kasih telah berbelanja di SEKARANTI!",
    },
    cancelled: {
      badge: "PESANAN DIBATALKAN",
      title: "Link Nota Tidak Aktif",
      desc: "Pesanan untuk nota ini telah dibatalkan sehingga tautan nota tidak lagi dapat diakses.",
    },
    invalid: {
      badge: "TAUTAN TIDAK VALID",
      title: "Akses Nota Ditolak",
      desc: "Tautan nota tidak valid atau rusak. Pastikan kamu membuka link lengkap yang dikirimkan oleh Admin SEKARANTI.",
    },
    "not-found": {
      badge: "TIDAK DITEMUKAN",
      title: "Nota Tidak Ditemukan",
      desc: "Data pesanan untuk tautan ini tidak ditemukan atau sudah dihapus.",
    },
  };

  const info = copyMap[kind];
  const adminWaUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(
    orderCode
      ? `Halo Admin SEKARANTI, saya ingin menanyakan mengenai pesanan dengan Kode PO ${orderCode}.`
      : "Halo Admin SEKARANTI, saya ingin menanyakan tautan nota Open PO saya.",
  )}`;

  return (
    <div className="min-h-screen bg-[#fcf9f4] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#D4AF37]/45 shadow-xl overflow-hidden text-center">
        <div className="bg-gradient-to-br from-[#2D1A0E] via-[#3D2210] to-[#1F1D1A] px-6 py-7 text-white">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37]/60 bg-white mx-auto mb-3">
            <Image
              src={ADMIN_LOGO_URL}
              alt="SEKARANTI Logo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#ffe088] text-[10px] font-bold uppercase tracking-[0.2em]">
            {info.badge}
          </span>
          <h1 className="font-display text-2xl text-white font-normal mt-3">
            {info.title}
          </h1>
          {orderCode && kind !== "invalid" && (
            <p className="font-mono text-xs text-[#ffe088] mt-1">{orderCode}</p>
          )}
        </div>

        <div className="p-7 space-y-5">
          <p className="text-xs sm:text-sm text-[#50443e] leading-relaxed">
            {info.desc}
          </p>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#311908] hover:bg-[#4A2E1B] !text-white text-xs uppercase tracking-[0.16em] font-bold"
            >
              <span className="text-white">Kembali ke Beranda SEKARANTI</span>
            </Link>

            <a
              href={adminWaUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-5 rounded-2xl border border-[#d4c3bb] bg-[#FAF7F2] hover:bg-[#f3ede4] !text-[#311908] text-xs uppercase tracking-[0.14em] font-semibold"
            >
              Hubungi Admin via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
