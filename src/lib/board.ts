import { getSupabaseServerClient } from "@/lib/supabase";
import type { Comment, Post } from "@/lib/types";

type PostRow = Omit<Post, "comments"> & {
  comments?: Comment[] | null;
};

export async function getBoardSnapshot() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
          id,
          author_name,
          title,
          body,
          created_at,
          comments (
            id,
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
        error instanceof Error ? error.message : "게시판 데이터를 불러오지 못했습니다.",
    };
  }
}

export function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
