"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Global Sonner toaster wrapper.
 * Rich colors + top-right positioning for a consistent look in both themes.
 */
export function Toaster() {
  return <SonnerToaster position="bottom-right" />;
}
