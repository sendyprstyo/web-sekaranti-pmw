import Image from "next/image";
import Link from "next/link";
import FloatingNavbar from "./floating-navbar";
import { INSTAGRAM_URL, whatsappHref } from "../lib/collections";

export function SiteHeader() {
  return <FloatingNavbar />;
}

export { default as SiteFooter } from "./site-footer";
