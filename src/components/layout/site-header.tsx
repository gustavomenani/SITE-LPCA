"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem } from "@/lib/types";

type SiteHeaderProps = {
  brand: string;
  nav: NavItem[];
};

export function SiteHeader({ brand, nav }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <div className="shell">
        <div className="glass-panel flex items-center justify-between gap-4 rounded-[28px] px-4 py-3 md:px-6">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-emerald-700">
            {brand}
          </Link>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm md:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Fechar menu principal" : "Abrir menu principal"}
            onClick={() => setOpen((current) => !current)}
          >
            <span>{open ? "Fechar" : "Menu"}</span>
            <span className="grid gap-1" aria-hidden="true">
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
            </span>
          </button>

          <nav
            id="site-menu"
            className={`${open ? "flex" : "hidden"} absolute inset-x-4 top-[92px] flex-col gap-2 rounded-[28px] border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur md:static md:flex md:flex-row md:items-center md:gap-2 md:border-none md:bg-transparent md:p-0 md:shadow-none`}
            aria-label="Navegação principal"
          >
            {nav.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-emerald-50 hover:text-emerald-700 ${
                    isActive ? "bg-emerald-100 text-emerald-700" : "text-slate-700"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
