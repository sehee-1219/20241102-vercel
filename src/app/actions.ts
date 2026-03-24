"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";
import { getDisplayName } from "@/lib/user";

const POST_LIMITS = {
  title: 120,
  body: 2000,
};

const COMMENT_LIMITS = {
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
    return "Supabase 테이블 또는 권한 정책이 준비되지 않았습니다. supabase/schema.sql 을 다시 실행하세요.";
  }

  return `저장에 실패했습니다. ${message}`;
}

export async function createPost(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = readField(formData, "title");
  const body = readField(formData, "body");

  if (!title || !body) {
    return {
      status: "error",
      message: "제목과 내용을 모두 입력하세요.",
    };
  }

  if (title.length > POST_LIMITS.title) {
    return {
      status: "error",
      message: "제목은 120자 이하로 입력하세요.",
    };
  }

  if (body.length > POST_LIMITS.body) {
    return {
      status: "error",
      message: "내용은 2000자 이하로 입력하세요.",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        status: "error",
        message: "게시글을 작성하려면 먼저 로그인하세요.",
      };
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      author_name: getDisplayName(user),
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
  const body = readField(formData, "body");

  if (!postId || !body) {
    return {
      status: "error",
      message: "댓글 내용을 입력하세요.",
    };
  }

  if (body.length > COMMENT_LIMITS.body) {
    return {
      status: "error",
      message: "댓글은 800자 이하로 입력하세요.",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        status: "error",
        message: "댓글을 작성하려면 먼저 로그인하세요.",
      };
    }

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      author_name: getDisplayName(user),
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

export async function deletePost(formData: FormData) {
  const postId = readField(formData, "postId");

  if (!postId) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase.from("posts").delete().eq("id", postId).eq("user_id", user.id);

  revalidatePath("/");
}

export async function deleteComment(formData: FormData) {
  const commentId = readField(formData, "commentId");

  if (!commentId) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  revalidatePath("/");
}
