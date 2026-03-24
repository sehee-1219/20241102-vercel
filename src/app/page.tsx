import Link from "next/link";

import { signOut } from "@/app/login/actions";
import { CommentForm } from "@/components/comment-form";
import { PostForm } from "@/components/post-form";
import { formatTimestamp, getBoardSnapshot, getViewer } from "@/lib/board";
import { getDisplayName, getUsername } from "@/lib/user";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { posts, loadError } = await getBoardSnapshot();
  const viewer = await getViewer();
  const viewerName = viewer ? getDisplayName(viewer) : null;
  const viewerUsername = viewer ? getUsername(viewer) : null;
  const totalComments = posts.reduce(
    (count, post) => count + post.comments.length,
    0,
  );

  return (
    <main className="pageShell">
      <div className="topBar">
        <div className="identityPill">
          {viewerName && viewerUsername
            ? `Signed in as ${viewerName} (@${viewerUsername})`
            : "Read-only mode"}
        </div>

        {viewer ? (
          <form action={signOut}>
            <button className="buttonGhost" type="submit">
              Log out
            </button>
          </form>
        ) : (
          <Link className="buttonGhostLink" href="/login">
            Sign in or sign up
          </Link>
        )}
      </div>

      <section className="heroCard">
        <p className="eyebrow">SUPABASE MEMBER BOARD</p>
        <div className="heroRow">
          <div className="heroCopy">
            <h1>Signal Board</h1>
            <p className="heroBody">
              Posts and comments now run through authenticated Supabase sessions.
              Reading stays open, but writing is available only after sign-in.
            </p>
          </div>

          <div className="heroStats">
            <div className="statCard">
              <span className="statLabel">POSTS</span>
              <strong>{posts.length}</strong>
            </div>
            <div className="statCard">
              <span className="statLabel">COMMENTS</span>
              <strong>{totalComments}</strong>
            </div>
            <div className="statCard">
              <span className="statLabel">MODE</span>
              <strong>{viewer ? "SIGNED IN" : "READ ONLY"}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="contentGrid">
        <aside className="sidebarStack">
          <section className="panel featuredPanel">
            <div className="panelHeader">
              <p className="sectionLabel">ACCOUNT</p>
              <h2>{viewer ? "Write a post" : "Sign in first"}</h2>
            </div>

            {viewerName ? (
              <PostForm userName={viewerName} />
            ) : (
              <div className="stack gap16">
                <p className="mutedText">
                  Use your username and password before creating posts and comments.
                </p>
                <Link className="buttonGhostLink buttonGhostLinkFill" href="/login">
                  Open auth page
                </Link>
              </div>
            )}
          </section>

          <section className="panel compactPanel">
            <div className="panelHeader">
              <p className="sectionLabel">SETUP</p>
              <h2>Deployment notes</h2>
            </div>
            <p className="mutedText">
              Re-run <code>supabase/schema.sql</code> after pulling this update.
              The schema now adds authenticated posting policies and user-linked
              columns for posts and comments.
            </p>
            <p className="mutedText">
              For username-only signup, disable Email Confirmations in Supabase
              Auth settings.
            </p>
          </section>
        </aside>

        <section className="feedStack">
          {loadError ? (
            <section className="panel warningPanel">
              <div className="panelHeader">
                <p className="sectionLabel">NOTICE</p>
                <h2>Your board schema is not ready</h2>
              </div>
              <p className="mutedText">
                Current read error: <code>{loadError}</code>
              </p>
              <p className="mutedText">
                Run <code>supabase/schema.sql</code> again in the Supabase SQL
                Editor so the auth-aware schema and RLS policies are updated.
              </p>
            </section>
          ) : null}

          {posts.length === 0 ? (
            <section className="panel emptyPanel">
              <p className="sectionLabel">EMPTY BOARD</p>
              <h2>No posts yet</h2>
              <p className="mutedText">
                {viewer
                  ? "You are signed in. Publish the first post from the left panel."
                  : "Sign in first, then publish the first post from the left panel."}
              </p>
            </section>
          ) : null}

          {posts.map((post) => (
            <article className="panel postPanel" key={post.id}>
              <div className="postTopRow">
                <div>
                  <p className="sectionLabel">POST</p>
                  <h2>{post.title}</h2>
                </div>
                <div className="postMeta">
                  <span>{post.author_name}</span>
                  <span>{formatTimestamp(post.created_at)}</span>
                </div>
              </div>

              <p className="postBody">{post.body}</p>

              <div className="commentHeader">
                <h3>Comments {post.comments.length}</h3>
              </div>

              <div className="commentStack">
                {post.comments.length === 0 ? (
                  <div className="commentCard commentEmpty">No comments yet.</div>
                ) : null}

                {post.comments.map((comment) => (
                  <div className="commentCard" key={comment.id}>
                    <div className="commentMeta">
                      <strong>{comment.author_name}</strong>
                      <span>{formatTimestamp(comment.created_at)}</span>
                    </div>
                    <p>{comment.body}</p>
                  </div>
                ))}
              </div>

              {viewerName ? (
                <CommentForm postId={post.id} userName={viewerName} />
              ) : (
                <div className="noticeCard">
                  <p className="mutedText">Sign in to comment on this post.</p>
                  <Link className="buttonGhostLink" href="/login">
                    Go to auth page
                  </Link>
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
