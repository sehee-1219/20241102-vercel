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
    error instanceof Error ? error.message : "Something went wrong.";

  if (
    message.includes("relation") ||
    message.includes("schema cache") ||
    message.includes("permission denied")
  ) {
    return "Your Supabase tables or RLS policies are not ready. Run supabase/schema.sql again.";
  }

  return `Save failed. ${message}`;
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
      message: "Enter both a title and body.",
    };
  }

  if (title.length > POST_LIMITS.title) {
    return {
      status: "error",
      message: "Keep the title under 120 characters.",
    };
  }

  if (body.length > POST_LIMITS.body) {
    return {
      status: "error",
      message: "Keep the body under 2000 characters.",
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
        message: "Sign in before creating a post.",
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
      message: "Post created.",
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
      message: "Enter a comment first.",
    };
  }

  if (body.length > COMMENT_LIMITS.body) {
    return {
      status: "error",
      message: "Keep the comment under 800 characters.",
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
        message: "Sign in before leaving a comment.",
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
      message: "Comment added.",
    };
  } catch (error) {
    return {
      status: "error",
      message: getErrorMessage(error),
    };
  }
}
