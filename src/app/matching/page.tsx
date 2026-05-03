"use client";

import { PageStub } from "@/components/page-stub";
import { useI18n } from "@/lib/i18n/provider";

export default function MatchingStub() {
  const { t } = useI18n();
  return (
    <PageStub
      badge="Phase 4"
      title={t.matching.title}
      subtitle={t.matching.sub}
      body={
        <p className="text-xs text-muted-soft">
          Buyer profile → Claude extracts preferences → embedding match → ranked results with explanations
        </p>
      }
    />
  );
}
