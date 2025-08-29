"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useVariantStore } from "@/store/variant";

type Variant = { color: string; images: string[] };

export interface ColorSwatchesProps {
  productId: string;
  variants: Variant[];
  className?: string;
}

function firstValidImage(images: string[]) {
  return images.find((s) => typeof s === "string" && s.trim().length > 0);
}

export default function ColorSwatches({ productId, variants, className = "" }: ColorSwatchesProps) {
  const setSelected = useVariantStore((s) => s.setSelected);
  const selected = useVariantStore((s) => s.getSelected(productId, 0));

  return (
    <div className={`flex flex-wrap gap-3 ${className}`} role="listbox" aria-label="Choose color">
      {variants.map((v, i) => {
        const src = firstValidImage(v.images);
        if (!src) return null;
        const isActive = selected === i;
        return (
          <button
            key={`${v.color}-${i}`}
            onClick={() => setSelected(productId, i)}
            aria-label={`Color ${v.color}`}
            aria-selected={isActive}
            role="option"
            className={`relative h-[72px] w-[120px] overflow-hidden rounded-lg ring-1 ring-light-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] ${
              isActive ? "ring-[--color-dark-500]" : "hover:ring-dark-500"
            }`}
          >
            <Image src={src} alt={v.color} fill sizes="120px" className="object-cover" />
            {isActive && (
              <span className="absolute right-1 top-1 rounded-full bg-light-100 p-1">
                <Check className="h-4 w-4 text-dark-900" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
