import type { Metadata } from "next";
import AdminPortal from "../../components/admin-portal";

export const metadata: Metadata = {
  title: { absolute: "Owner Portal Open PO | SEKARANTI" },
  description:
    "Portal manajemen pesanan Open PO Batch 1 SEKARANTI-SMG khusus owner.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPortal />;
}
