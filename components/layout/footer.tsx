export function Copyright() {
  const year = new Date().getFullYear();
  return (
    <p className="pointer-events-none fixed right-(--gutter) bottom-(--gutter) z-(--z-content) font-mono text-meta text-muted-foreground uppercase">
      &copy; {year}
    </p>
  );
}
