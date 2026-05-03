"use client";

import { PageStub } from "@/components/page-stub";
import { useI18n } from "@/lib/i18n/provider";

export default function AccountStub() {
  const { t } = useI18n();
  return <PageStub badge="Phase 3" title={t.nav.account} subtitle="Profile, preferences, language. Behind auth." />;
}
