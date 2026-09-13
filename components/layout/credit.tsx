/**
 * The head scan is CC BY 3.0, which requires visible attribution. Set as a
 * corner micro-label so it reads as part of the layout's mono register rather
 * than as a disclaimer. Remove it only if the model is replaced.
 */
export function ModelCredit() {
  return (
    <a
      href="https://www.ir-ltd.net/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[calc(var(--gutter)+1.25rem)] z-(--z-content) font-mono text-meta text-muted-foreground/60 uppercase transition-colors duration-200 ease-apple hover:text-accent-ink lg:bottom-(--gutter)"
      style={{ left: "calc(var(--sidebar-offset) + 2 * var(--gutter))" }}
    >
      Head scan &mdash; Lee Perry-Smith, CC BY
    </a>
  );
}
