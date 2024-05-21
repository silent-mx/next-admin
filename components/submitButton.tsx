"use client";

import { Button } from "@nextui-org/button";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending} className={className}>
      {children}
    </Button>
  );
}
