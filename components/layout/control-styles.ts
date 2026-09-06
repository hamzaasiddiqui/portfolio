/**
 * Chrome is deliberately near-invisible: no borders, fills, blurs or shadows
 * on controls. A control is its glyph or its label, in muted ink, and it
 * comes forward in the accent colour on hover/focus. Focus rings come from
 * the global :focus-visible rule in globals.css.
 */
export const ICON_BUTTON =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 ease-apple hover:text-accent";

export const META_LINK =
  "font-mono text-meta uppercase text-muted-foreground transition-colors duration-200 ease-apple hover:text-accent";
