import type { Metadata } from "next";
import { Suspense } from "react";
import OpenPoForm from "../../components/open-po-form";
import { OPEN_PO_BATCH_LABEL } from "../../lib/open-po";

export const metadata: Metadata = {
  title: { absolute: `${OPEN_PO_BATCH_LABEL} | SEKARANTI` },
  description:
    "Form pemesanan resmi OPEN PO BATCH 1 SEKARANTI-SMG. Pilih motif hijab Voal Ultrasoft favoritmu, atur COD Kampus Polines atau area Semarang, dan konfirmasi langsung ke admin.",
  alternates: { canonical: "/open-po" },
};

function OpenPoFallback() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-28 pb-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <div className="h-52 rounded-3xl bg-[#ebe8e3] animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 h-96 rounded-3xl bg-white/70 border border-[#d4c3bb]/40 animate-pulse" />
        <div className="lg:col-span-4 h-72 rounded-3xl bg-white/70 border border-[#d4c3bb]/40 animate-pulse" />
      </div>
    </div>
  );
}

export default function OpenPoPage() {
  return (
    <Suspense fallback={<OpenPoFallback />}>
      <OpenPoForm />
    </Suspense>
  );
}
