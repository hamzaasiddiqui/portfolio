// The gradient band overlaps the sidebar's vertical extent (measured from the
// wireframe: footer starts at 89% viewport height, sidebar runs to 96%), so
// it must render at a lower z-index than the sidebar and span the full
// width — the sidebar floats on top of it, not beside it.
export function Footer() {
  return (
    <footer
      className="pointer-events-none fixed inset-x-0 bottom-0 z-(--z-footer) h-32 bg-linear-to-t from-background via-background/70 to-transparent"
      aria-hidden="true"
    />
  );
}

export function Copyright() {
  const year = new Date().getFullYear();
  return (
    <p
      className="pointer-events-auto fixed bottom-6 z-(--z-content) font-mono text-meta text-muted-foreground/80"
      style={{ left: "calc(var(--sidebar-offset) + 1.5rem)" }}
    >
      Copyright &copy; {year}
    </p>
  );
}
