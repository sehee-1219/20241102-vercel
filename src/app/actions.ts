"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerClient } from "@/lib/supabase";
import type { ActionState } from "@/lib/types";

const POST_LIMITS = {
  author: 40,
  title: 120,
  body: 2000,
};

const COMMENT_LIMITS = {
  author: 40,
  body: 800,
};

function readField(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

function getErrorMessage(error: unknown) {
  const message =
    error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

  if (
    message.includes("relation") ||
    message.includes("schema cache") ||
    message.includes("permission denied")
  ) {
    return "Supabase 테이블 또는 정책이 아직 준비되지 않았습니다. supabase/schema.sql 을 먼저 실행해주세요.";
  }

  return `저장에 실패했습니다. ${message}`;
}

export async function createPost(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authorName = readField(formData, "authorName");
  const title = readField(formData, "title");
  const body = readField(formData, "body");

  if (!authorName || !title || !body) {
    return {
      status: "error",
      message: "이름, 제목, 내용을 모두 입력해주세요.",
    };
  }

  if (authorName.length > POST_LIMITS.author || title.length > POST_LIMITS.title) {
    return {
      status: "error",
      message: "이름은 40자 이하, 제목은 120자 이하로 입력해주세요.",
    };
  }

  if (body.length > POST_LIMITS.body) {
    return {
      status: "error",
      message: "본문은 2000자 이하로 입력해주세요.",
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("posts").insert({
      author_name: authorName,
      title,
      body,
    });

    if (error) {
      throw error;
    }

    revalidatePath("/");

    return {
      status: "success",
      message: "게시글이 등록되었습니다.",
    };
  } catch (error) {
    return {
      status: "error",
      message: getErrorMessage(error),
    };
  }
}

export async function createComment(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const postId = readField(formData, "postId");
  const authorName = readField(formData, "authorName");
  const body = readField(formData, "body");

  if (!postId || !authorName || !body) {
    return {
      status: "error",
      message: "이름과 댓글 내용을 입력해주세요.",
    };
  }

  if (authorName.length > COMMENT_LIMITS.author) {
    return {
      status: "error",
      message: "이름은 40자 이하로 입력해주세요.",
    };
  }

  if (body.length > COMMENT_LIMITS.body) {
    return {
      status: "error",
      message: "댓글은 800자 이하로 입력해주세요.",
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_name: authorName,
      body,
    });

    if (error) {
      throw error;
    }

    revalidatePath("/");

    return {
      status: "success",
      message: "댓글이 등록되었습니다.",
    };
  } catch (error) {
    return {
      status: "error",
      message: getErrorMessage(error),
    };
  }
}
