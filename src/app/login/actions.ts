"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function readField(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

function buildRedirect(
  type: "error" | "success",
  message: string,
  tab: "signin" | "signup",
) {
  const params = new URLSearchParams({
    tab,
    [type]: message,
  });

  return `/login?${params.toString()}`;
}

export async function signUp(formData: FormData) {
  const displayName = readField(formData, "displayName");
  const email = readField(formData, "email");
  const password = readField(formData, "password");

  if (!displayName || !email || !password) {
    redirect(buildRedirect("error", "Fill in every field.", "signup"));
  }

  if (password.length < 6) {
    redirect(
      buildRedirect("error", "Use at least 6 characters for the password.", "signup"),
    );
  }

  const supabase = await createClient();
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
      emailRedirectTo: `${origin}/auth/confirm?next=/`,
    },
  });

  if (error) {
    redirect(buildRedirect("error", error.message, "signup"));
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/");
  }

  redirect(
    buildRedirect(
      "success",
      "Check your email and confirm the account before signing in.",
      "signin",
    ),
  );
}

export async function signIn(formData: FormData) {
  const email = readField(formData, "email");
  const password = readField(formData, "password");

  if (!email || !password) {
    redirect(buildRedirect("error", "Enter your email and password.", "signin"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(buildRedirect("error", error.message, "signin"));
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
