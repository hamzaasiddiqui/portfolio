"use client";

import { Fragment, useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { cn } from "@/lib/utils";
import type { Tables } from "@/lib/supabase/database.types";

const BADGE_SPRING = { stiffness: 400, damping: 30, mass: 0.4 };

/**
 * One project, as a row: a small picture on the left, the copy on the right.
 * The whole row is the link (the title anchor's ::after covers it), so the
 * hover state belongs to the row, not to the picture.
 */
export function ProjectCard({ project }: { project: Tables<"projects"> }) {
  const href = project.url ?? project.repo_url;
  const showSource = Boolean(project.repo_url && project.url);
  const reduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);

  // The "open" badge rides the cursor in picture pixels, and only exists
  // while the cursor is actually over the picture, not the copy beside it.
  const badgeX = useSpring(useMotionValue(0), BADGE_SPRING);
  const badgeY = useSpring(useMotionValue(0), BADGE_SPRING);
  const badgeScale = useSpring(useMotionValue(0), { stiffness: 320, damping: 24 });

  const onPointerMove = (event: PointerEvent<HTMLLIElement>) => {
    // Touch never hovers: a finger dragging past a row is a scroll.
    if (event.pointerType !== "mouse" || reduceMotion) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const overPicture = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    badgeX.set(x);
    badgeY.set(y);
    badgeScale.set(overPicture ? 1 : 0);
  };

  const onPointerLeave = () => badgeScale.set(0);

  return (
    <li
      // The picture is a thumbnail, not a hero: it sits in a narrow first
      // column and the copy takes the rest of the row.
      className="group/card relative grid grid-cols-1 gap-x-8 gap-y-5 border-b border-border py-7 first:pt-0 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center lg:grid-cols-[11rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)]"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* The row's bottom hairline fills with accent, left to right, on
          hover — laid over the border rather than replacing it. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-apple group-hover/card:scale-x-100"
      />

      {project.image_url ? (
        <div ref={frameRef} className="relative w-full max-w-48 overflow-hidden rounded-md sm:max-w-none">
          <ParallaxImage
            src={project.image_url}
            alt=""
            sizes="(min-width: 1280px) 13rem, (min-width: 1024px) 11rem, (min-width: 640px) 9rem, 12rem"
            drift={6}
            className="aspect-16/10 w-full"
            imageClassName="brightness-[0.92] transition-[scale,filter] duration-700 ease-apple group-hover/card:scale-[1.06] group-hover/card:brightness-100"
          />

          {/* Corner brackets: four hairline L's that sit just inside the
              edges and slide out to the corners on hover. */}
          {(
            [
              "top-0 left-0 border-t border-l",
              "top-0 right-0 border-t border-r",
              "bottom-0 left-0 border-b border-l",
              "bottom-0 right-0 border-b border-r",
            ] as const
          ).map((corner) => (
            <span
              key={corner}
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute size-3 border-accent opacity-0 transition-[opacity,translate] duration-500 ease-apple group-hover/card:opacity-100",
                corner,
                corner.includes("left") ? "translate-x-2" : "-translate-x-2",
                corner.includes("top") ? "translate-y-2" : "-translate-y-2",
                "group-hover/card:translate-x-0 group-hover/card:translate-y-0"
              )}
            />
          ))}

          {/* Centred on the cursor: the springs put its top-left at the
              pointer and the translate pulls it back by half its own size. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-background"
            style={{ x: badgeX, y: badgeY, scale: badgeScale }}
          >
            <ArrowUpRight size={18} weight="bold" />
          </motion.div>
        </div>
      ) : null}

      <div className="flex flex-col">
        <h3 data-reveal className="font-display text-h2 font-medium">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1 rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <RollingTitle text={project.title} />
              <ArrowUpRight
                size={18}
                weight="bold"
                aria-hidden="true"
                className="mt-1 shrink-0 transition-[translate,color] duration-300 ease-apple group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-accent"
              />
            </a>
          ) : (
            <RollingTitle text={project.title} />
          )}
        </h3>

        {project.description ? (
          <p data-reveal className="mt-3 max-w-2xl text-body text-pretty text-muted-foreground">
            {project.description}
          </p>
        ) : null}

        {project.tags.length > 0 || showSource ? (
          <div
            data-reveal
            className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-label text-meta text-muted-foreground uppercase"
          >
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
            {showSource ? (
              <a
                href={project.repo_url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="relative transition-colors duration-200 ease-apple hover:text-accent-ink"
              >
                Source
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

/**
 * The title, one letter at a time, each rolling up out of view while an
 * accent copy rolls in beneath it — a wave that runs left to right on hover.
 *
 * Screen readers get the plain string once; the animated letters are
 * decoration. Each letter's clip box is padded above and below and pulled
 * back with a negative margin, so ascenders and descenders survive the
 * display face's tight line-height without changing the line's rhythm.
 */
function RollingTitle({ text }: { text: string }) {
  const words = text.split(" ");
  let letterIndex = 0;

  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          // The space lives *between* word boxes, not inside one: trailing
          // whitespace inside an inline-block is collapsed away.
          <Fragment key={wordIndex}>
            {wordIndex > 0 ? " " : null}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((letter, i) => {
                const delay = `${letterIndex++ * 14}ms`;
                return (
                  <span
                    key={i}
                    className="relative inline-block my-[-0.15em] overflow-hidden py-[0.15em]"
                  >
                    <span
                      className="block transition-transform duration-500 ease-apple group-hover/card:translate-y-[-120%]"
                      style={{ transitionDelay: delay }}
                    >
                      {letter}
                    </span>
                    <span
                      className="absolute top-[0.15em] left-0 block translate-y-[120%] text-accent transition-transform duration-500 ease-apple group-hover/card:translate-y-0"
                      style={{ transitionDelay: delay }}
                    >
                      {letter}
                    </span>
                  </span>
                );
              })}
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  );
}
