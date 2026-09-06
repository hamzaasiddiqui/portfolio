"use server";

import { createClient } from "@/lib/supabase/server";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot: a field real visitors never see or fill (hidden from both
  // sighted users and screen readers in the form markup), but that
  // indiscriminate form-filling bots populate. Report success without
  // writing anything, so the bot has no signal to adapt against.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success", message: "Thanks — I'll get back to you soon." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in every field." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, message });

  if (error) {
    return { status: "error", message: "Something went wrong — please try again." };
  }

  return { status: "success", message: "Thanks — I'll get back to you soon." };
}
