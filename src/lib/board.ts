import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { Comment, Post } from "@/lib/types";

type PostRow = Omit<Post, "comments"> & {
  comments?: Comment[] | null;
};

export async function getBoardSnapshot() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
          id,
          user_id,
          author_name,
          title,
          body,
          created_at,
          comments (
            id,
            user_id,
            author_name,
            body,
            created_at
          )
        `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const posts = ((data ?? []) as PostRow[]).map((post) => ({
      ...post,
      comments: [...(post.comments ?? [])].sort((left, right) =>
        left.created_at.localeCompare(right.created_at),
      ),
    }));

    return {
      posts,
      loadError: null as string | null,
    };
  } catch (error) {
    return {
      posts: [] as Post[],
      loadError:
        error instanceof Error ? error.message : "Could not load board data.",
    };
  }
}

export async function getViewer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user as User | null;
}

export function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
