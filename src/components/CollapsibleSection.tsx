"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface CollapsibleSectionProps {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  rightMeta?: React.ReactNode;
  className?: string;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  rightMeta,
  className = "",
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`border-b border-light-300 ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
        aria-expanded={open}
      >
        <span className="text-body-medium text-dark-900">{title}</span>
        <span className="flex items-center gap-2">
          {rightMeta}
          <ChevronDown
            className={`h-5 w-5 text-dark-900 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </span>
      </button>
      {open && (
        <div className="pb-6">
          {children ? <div className="text-body text-dark-700">{children}</div> : null}
        </div>
      )}
    </section>
  );
}
