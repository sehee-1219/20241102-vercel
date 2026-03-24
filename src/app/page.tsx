import { CommentForm } from "@/components/comment-form";
import { PostForm } from "@/components/post-form";
import { formatTimestamp, getBoardSnapshot } from "@/lib/board";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { posts, loadError } = await getBoardSnapshot();
  const totalComments = posts.reduce(
    (count, post) => count + post.comments.length,
    0,
  );

  return (
    <main className="pageShell">
      <section className="heroCard">
        <p className="eyebrow">SUPABASE COMMUNITY BOARD</p>
        <div className="heroRow">
          <div className="heroCopy">
            <h1>Signal Board</h1>
            <p className="heroBody">
              공지, 기록, 회고, 짧은 대화를 한 화면에 쌓아두는 게시판입니다.
              새 글을 남기고 각 글 아래에서 댓글로 대화를 이어갈 수 있습니다.
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
              <strong>PUBLIC</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="contentGrid">
        <aside className="sidebarStack">
          <section className="panel featuredPanel">
            <div className="panelHeader">
              <p className="sectionLabel">WRITE</p>
              <h2>새 글 작성</h2>
            </div>
            <PostForm />
          </section>

          <section className="panel compactPanel">
            <div className="panelHeader">
              <p className="sectionLabel">SETUP</p>
              <h2>현재 연결 상태</h2>
            </div>
            <p className="mutedText">
              Supabase URL과 anon key는 연결해두었습니다. 아직 테이블을 만들지
              않았다면 <code>supabase/schema.sql</code> 을 먼저 실행하세요.
            </p>
          </section>
        </aside>

        <section className="feedStack">
          {loadError ? (
            <section className="panel warningPanel">
              <div className="panelHeader">
                <p className="sectionLabel">NOTICE</p>
                <h2>게시판 테이블이 아직 준비되지 않았습니다</h2>
              </div>
              <p className="mutedText">
                현재 읽기 오류: <code>{loadError}</code>
              </p>
              <p className="mutedText">
                Supabase SQL Editor에서 <code>supabase/schema.sql</code> 파일의
                내용을 실행하면 바로 연결됩니다.
              </p>
            </section>
          ) : null}

          {posts.length === 0 ? (
            <section className="panel emptyPanel">
              <p className="sectionLabel">EMPTY BOARD</p>
              <h2>첫 게시글을 남겨보세요</h2>
              <p className="mutedText">
                테이블 생성이 끝났다면 왼쪽 폼으로 첫 글을 작성할 수 있습니다.
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
                <h3>댓글 {post.comments.length}</h3>
              </div>

              <div className="commentStack">
                {post.comments.length === 0 ? (
                  <div className="commentCard commentEmpty">
                    아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
                  </div>
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

              <CommentForm postId={post.id} />
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
