"use client";

import { PageStub } from "@/components/page-stub";
import { useI18n } from "@/lib/i18n/provider";

export default function SignInStub() {
  const { t } = useI18n();
  return <PageStub badge="Phase 3" title={t.nav.signin} subtitle="Sign in via Supabase Auth — wired in Phase 3." />;
}
