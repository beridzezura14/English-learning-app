"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    window.gtag?.("config", "G-R8YSPHSBK8", {
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname]);

  return null;
}