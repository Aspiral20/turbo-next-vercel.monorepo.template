'use client'
import { redirect } from 'next/navigation';
import { routing } from "@/i18n/routing";

export default function BootstrapPage() {
  return redirect(`/${routing.defaultLocale}`);
}
