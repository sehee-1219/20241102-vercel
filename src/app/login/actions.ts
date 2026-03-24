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
    redirect(buildRedirect("error", "모든 항목을 입력하세요.", "signup"));
  }

  if (!isValidUsername(username)) {
    redirect(
      buildRedirect(
        "error",
        "아이디는 3-20자의 영문 소문자, 숫자, 점, 밑줄, 하이픈만 사용할 수 있습니다.",
        "signup",
      ),
    );
  }

  if (password.length < 6) {
    redirect(
      buildRedirect("error", "비밀번호는 최소 6자 이상이어야 합니다.", "signup"),
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
      "이메일 인증 없이 아이디 가입을 쓰려면 Supabase Auth 설정에서 이메일 인증을 꺼야 합니다.",
      "signup",
    ),
  );
}

export async function signIn(formData: FormData) {
  const username = normalizeUsername(readField(formData, "username"));
  const password = readField(formData, "password");

  if (!username || !password) {
    redirect(buildRedirect("error", "아이디와 비밀번호를 입력하세요.", "signin"));
  }

  if (!isValidUsername(username)) {
    redirect(
      buildRedirect(
        "error",
        "회원가입할 때 사용한 아이디를 입력하세요.",
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
