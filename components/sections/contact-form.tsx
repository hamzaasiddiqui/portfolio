"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/lib/actions/contact";

const initialState: ContactFormState = { status: "idle" };

const inputClasses =
  "rounded-xl border border-transparent bg-muted/50 px-4 py-3 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring/40";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  return (
    <form action={formAction} className="mt-10 flex max-w-md flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="font-mono text-meta text-muted-foreground uppercase">
          Name
        </label>
        <input id="contact-name" name="name" type="text" autoComplete="name" required className={inputClasses} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="font-mono text-meta text-muted-foreground uppercase">
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
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="font-mono text-meta text-muted-foreground uppercase">
          Message
        </label>
        <textarea id="contact-message" name="message" rows={5} required className={`resize-none ${inputClasses}`} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 inline-flex w-fit items-center self-start rounded-full bg-foreground px-6 py-3 font-sans text-sm font-medium text-background shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Send Message"}
      </button>

      <p aria-live="polite" className="text-body text-muted-foreground">
        {state.status !== "idle" ? state.message : null}
      </p>
    </form>
  );
}
