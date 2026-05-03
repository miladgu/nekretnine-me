"use client";

import { PageStub } from "@/components/page-stub";
import { useI18n } from "@/lib/i18n/provider";

export default function PostListingStub() {
  const { t } = useI18n();
  return (
    <PageStub
      badge="Phase 3"
      title={t.nav.post}
      subtitle="New listing wizard — works for both private sellers and agencies. Needs auth, then Supabase storage for images."
    />
  );
}
