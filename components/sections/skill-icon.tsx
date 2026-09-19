import { skillIconPath } from "@/lib/icons/skill-icons";
import { cn } from "@/lib/utils";

export function SkillIcon({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const path = skillIconPath(slug);

  if (!path) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-sm border border-current font-label text-[0.625rem] leading-none font-medium",
          className
        )}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-5 shrink-0 fill-current", className)}
    >
      <path d={path} />
    </svg>
  );
}
