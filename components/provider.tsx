"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

/**
 * @see https://nextui.org/docs/guide/installation#provider-setup
 */
export function NextUiProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push} locale="zh-Hans">
      {children}
    </NextUIProvider>
  );
}
