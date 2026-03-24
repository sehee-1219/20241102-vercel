"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  buildInternalEmail,
  isValidUsername,
  normalizeUsername,
} from "@/lib/user";

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
  const username = normalizeUsername(readField(formData, "username"));
  const displayName = readField(formData, "displayName");
  const password = readField(formData, "password");

  if (!username || !displayName || !password) {
    redirect(buildRedirect("error", "Fill in every field.", "signup"));
  }

  if (!isValidUsername(username)) {
    redirect(
      buildRedirect(
        "error",
        "Use 3-20 lowercase letters, numbers, dots, underscores, or hyphens for the username.",
        "signup",
      ),
    );
  }

  if (password.length < 6) {
    redirect(
      buildRedirect("error", "Use at least 6 characters for the password.", "signup"),
    );
  }

  const supabase = await createClient();
  const email = buildInternalEmail(username);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName,
      },
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
      "error",
      "Disable Email Confirmations in Supabase Auth settings to use username signup without email verification.",
      "signup",
    ),
  );
}

export async function signIn(formData: FormData) {
  const username = normalizeUsername(readField(formData, "username"));
  const password = readField(formData, "password");

  if (!username || !password) {
    redirect(buildRedirect("error", "Enter your username and password.", "signin"));
  }

  if (!isValidUsername(username)) {
    redirect(
      buildRedirect(
        "error",
        "Use the username you signed up with.",
        "signin",
      ),
    );
  }

  const supabase = await createClient();
  const email = buildInternalEmail(username);
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
