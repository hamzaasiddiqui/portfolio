import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const LINK_CLASS =
  "text-foreground underline decoration-border decoration-1 underline-offset-4 transition-colors duration-200 ease-apple hover:text-accent-ink hover:decoration-accent";

function parse(text: string): ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(<Fragment key={cursor}>{text.slice(cursor, match.index)}</Fragment>);
    }

    nodes.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_CLASS}
      >
        {match[1]}
      </a>
    );

    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    nodes.push(<Fragment key={cursor}>{text.slice(cursor)}</Fragment>);
  }

  return nodes;
}

export function RichText({ text }: { text: string }) {
  return <>{parse(text)}</>;
}

export function RichTextBlock({ text, className }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          <RichText text={paragraph} />
        </p>
      ))}
    </div>
  );
}
