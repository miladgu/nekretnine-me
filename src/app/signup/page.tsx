"use client";

import { PageStub } from "@/components/page-stub";
import { useI18n } from "@/lib/i18n/provider";

export default function SignUpStub() {
  const { t } = useI18n();
  return (
    <PageStub
      badge="Phase 3"
      title={t.nav.signup}
      subtitle="Sign up as a private user or as an agency. Wired in Phase 3."
    />
  );
}
