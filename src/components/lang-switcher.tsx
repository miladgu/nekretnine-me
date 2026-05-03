"use client";

import { LOCALES, LOCALE_LABEL } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LangSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex gap-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={cn(
            "rounded-md px-2 py-1 text-[11px] font-semibold transition-colors",
            locale === l
              ? "bg-brand-700 text-white"
              : "bg-line-soft text-muted hover:bg-line",
          )}
        >
          {LOCALE_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
