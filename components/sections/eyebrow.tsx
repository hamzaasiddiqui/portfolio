// Reserves the wireframe's "currently viewing" indicator slot per-section.
// Ticket 2 replaces this with a single fixed, IntersectionObserver-driven
// label that tracks scroll across all sections — this static version keeps
// each section visually correct without depending on client JS.
export function Eyebrow({ children }: { children: string }) {
  return (
    <p className="mb-4 font-mono text-meta text-muted-foreground uppercase">{children}</p>
  );
}
