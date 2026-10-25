"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { NEWSLETTER_SEEN_KEY } from "@/lib/forms";

const NewsletterModal = dynamic(
  () => import("@/components/forms/newsletter-modal").then((module) => module.NewsletterModal),
  { ssr: false },
);

export function NewsletterLoader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function openModal() {
      window.localStorage.setItem(NEWSLETTER_SEEN_KEY, "1");
      setOpen(true);
    }

    window.addEventListener("cynbit:newsletter", openModal);

    const seen = window.localStorage.getItem(NEWSLETTER_SEEN_KEY);
    const timer = seen ? null : window.setTimeout(openModal, 18_000);

    return () => {
      window.removeEventListener("cynbit:newsletter", openModal);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return open ? <NewsletterModal open onClose={() => setOpen(false)} /> : null;
}
