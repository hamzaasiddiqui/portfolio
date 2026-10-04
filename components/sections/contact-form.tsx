"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/lib/actions/contact";

const initialState: ContactFormState = { status: "idle" };

const FIELD =
  "w-full border-b border-border bg-transparent py-2 text-body text-foreground outline-none transition-colors duration-200 ease-apple placeholder:text-muted-foreground/50 focus:border-accent";

const LABEL = "font-label text-meta text-muted-foreground uppercase";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  return (
    <form action={formAction} className="relative flex flex-col gap-7">
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div data-reveal="fade" className="flex flex-col gap-2">
        <label htmlFor="contact-name" className={LABEL}>
          Name
        </label>
        <input id="contact-name" name="name" type="text" autoComplete="name" required className={FIELD} />
      </div>

      <div data-reveal="fade" className="flex flex-col gap-2">
        <label htmlFor="contact-email" className={LABEL}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          className={FIELD}
        />
      </div>

      <div data-reveal="fade" className="flex flex-col gap-2">
        <label htmlFor="contact-message" className={LABEL}>
          Message
        </label>
        <textarea id="contact-message" name="message" rows={4} required className={`resize-none ${FIELD}`} />
      </div>

      <button
        type="submit"
        data-reveal
        disabled={isPending}
        className="group flex w-fit items-center gap-2 font-label text-meta text-foreground uppercase transition-colors duration-200 ease-apple hover:text-accent-ink disabled:pointer-events-none disabled:opacity-50"
      >
        {isPending ? "Sending" : "Send message"}
        <span
          aria-hidden="true"
          className="transition-transform duration-200 ease-apple group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </button>

      <p aria-live="polite" className="font-label text-meta text-muted-foreground uppercase">
        {state.status !== "idle" ? state.message : null}
      </p>
    </form>
  );
}
