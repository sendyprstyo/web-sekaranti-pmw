import type { Metadata } from "next";
import { Suspense } from "react";
import { NotaActiveView, NotaUnavailableCard } from "../../../components/nota-view";
import { callAppsScript } from "../../../lib/admin-api";
import { AdminOrder } from "../../../lib/admin-types";
import { verifyNotaSignature } from "../../../lib/nota-token";

export const metadata: Metadata = {
  title: { absolute: "Nota Pemesanan | SEKARANTI" },
  description:
    "Nota resmi dan informasi pembayaran QRIS Open PO Batch 1 SEKARANTI-SMG.",
  robots: { index: false, follow: false },
};

function NotaLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#fcf9f4] flex items-center justify-center px-4">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-[#e2d6ce] shadow-xs text-sm text-[#311908] font-medium">
        <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
        <span>Memuat Nota Pemesanan SEKARANTI...</span>
      </div>
    </div>
  );
}

async function NotaLoader({
  params,
  searchParams,
}: {
  params: Promise<{ orderCode: string }>;
  searchParams: Promise<{ s?: string | string[] }>;
}) {
  const { orderCode: rawCode } = await params;
  const query = await searchParams;
  const orderCode = decodeURIComponent(rawCode).trim();
  const signature = Array.isArray(query.s) ? query.s[0] : query.s;

  if (!verifyNotaSignature(orderCode, signature)) {
    return <NotaUnavailableCard kind="invalid" />;
  }

  const { status, data } = await callAppsScript({
    action: "getOrderForNota",
    orderCode,
  });

  if (data.locked) {
    return (
      <NotaUnavailableCard
        kind={data.status === "Dibatalkan" ? "cancelled" : "completed"}
        orderCode={orderCode}
      />
    );
  }

  if (status !== 200 || !data.ok || !data.order) {
    return <NotaUnavailableCard kind="not-found" orderCode={orderCode} />;
  }

  return <NotaActiveView order={data.order as AdminOrder} />;
}

export default function NotaPage({
  params,
  searchParams,
}: PageProps<"/nota/[orderCode]">) {
  return (
    <Suspense fallback={<NotaLoadingFallback />}>
      <NotaLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}
