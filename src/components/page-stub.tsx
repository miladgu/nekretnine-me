import { Container } from "./container";

export function PageStub({
  title,
  subtitle,
  body,
  badge,
}: {
  title: string;
  subtitle?: string;
  body?: React.ReactNode;
  badge?: string;
}) {
  return (
    <Container className="py-16">
      <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface p-10 text-center">
        {badge && (
          <div className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            {badge}
          </div>
        )}
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">{subtitle}</p>}
        {body && <div className="mt-6">{body}</div>}
      </div>
    </Container>
  );
}
