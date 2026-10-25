"use client";

import { AnimatePresence, m } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { primaryNav, site, type NavGroup } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

function isCurrentPath(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopMenuItem({ item }: { item: NavGroup }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!item.items) {
    return (
      <Link
        href={item.href ?? "#"}
        className={cn(
          "flex min-h-11 items-center rounded-full px-3.5 text-[0.9rem] font-semibold transition-colors hover:bg-mint",
          isCurrentPath(pathname, item.href) && "bg-mint text-brand",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[0.9rem] font-semibold transition-colors hover:bg-mint",
          open && "bg-mint",
          isCurrentPath(pathname, item.href) && "text-brand",
        )}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open ? (
          <m.div
            id={panelId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-[calc(100%+0.7rem)] w-[23rem] -translate-x-1/2 overflow-hidden rounded-[1.4rem] bg-shell p-2 shadow-[0_22px_55px_rgba(7,36,34,0.14)]"
          >
            {item.items.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className="block rounded-[1rem] px-4 py-3.5 transition-colors hover:bg-mint"
              >
                <span className="block text-[0.95rem] font-bold text-ink">{child.label}</span>
                {child.description ? (
                  <span className="mt-0.5 block text-[0.8rem] leading-relaxed text-muted">
                    {child.description}
                  </span>
                ) : null}
              </Link>
            ))}
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onClose();
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
  }, [pathname]);

  return (
    <dialog
      ref={dialogRef}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-shell p-0 text-ink backdrop:bg-ink/40 md:hidden"
      aria-label="Site menu"
    >
      <div className="flex min-h-dvh flex-col">
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/" aria-label="Cynbit home" onClick={onClose}>
            <Logo className="h-8" />
          </Link>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="grid size-11 place-items-center rounded-full bg-mint text-ink"
            aria-label="Close menu"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-8 pt-4">
          <nav aria-label="Mobile navigation" className="grid gap-7">
            {primaryNav.map((group) => (
              <div key={group.label}>
                {group.items ? (
                  <>
                    <p className="mb-2 font-headline text-2xl font-extrabold tracking-[-0.04em]">
                      {group.label}
                    </p>
                    <div className="grid gap-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className="flex min-h-11 items-center rounded-full px-3 text-[1.02rem] font-semibold text-muted transition-colors hover:bg-mint hover:text-ink"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={group.href ?? "#"}
                    onClick={onClose}
                    className="flex min-h-12 items-center justify-between border-b border-ink/10 font-headline text-2xl font-extrabold tracking-[-0.04em]"
                  >
                    {group.label}
                    <span aria-hidden="true" className="text-brand">
                      +
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <ButtonLink href="/contact" size="large" className="w-full" onClick={onClose}>
              Start a project
            </ButtonLink>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
              <a href={`mailto:${site.email}`} className="font-semibold hover:text-brand">
                {site.email}
              </a>
              <a href={`tel:${site.phones[0].replace(/\s/g, "")}`} className="font-semibold hover:text-brand">
                {site.phones[0]}
              </a>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ground">
      <Container className="flex h-[4.7rem] items-center gap-5 md:h-[5.3rem]">
        <Link href="/" aria-label="Cynbit home" className="shrink-0">
          <Logo priority className="h-8 w-auto md:h-9" />
        </Link>

        <nav aria-label="Primary navigation" className="ml-auto hidden items-center lg:flex">
          {primaryNav.map((item) => (
            <DesktopMenuItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="ml-auto hidden lg:block">
          <ButtonLink href="/contact" size="small">
            Start a project
          </ButtonLink>
        </div>

        <button
          type="button"
          className="ml-auto grid size-11 place-items-center rounded-full bg-mint text-ink lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
      </Container>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
