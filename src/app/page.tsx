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
            ? `${viewerName} (@${viewerUsername}) 님 로그인 중`
            : "읽기 전용 모드"}
        </div>

        {viewer ? (
          <form action={signOut}>
            <button className="buttonGhost" type="submit">
              로그아웃
            </button>
          </form>
        ) : (
          <Link className="buttonGhostLink" href="/login">
            로그인 / 회원가입
          </Link>
        )}
      </div>

      <section className="heroCard">
        <p className="eyebrow">SUPABASE 회원 게시판</p>
        <div className="heroRow">
          <div className="heroCopy">
            <h1>Signal Board</h1>
            <p className="heroBody">
              게시글과 댓글은 로그인한 사용자만 작성할 수 있고, 게시판 읽기는
              누구나 가능합니다. 아이디와 비밀번호로 로그인한 뒤 바로 글을
              남길 수 있습니다.
            </p>
          </div>

          <div className="heroStats">
            <div className="statCard">
              <span className="statLabel">게시글</span>
              <strong>{posts.length}</strong>
            </div>
            <div className="statCard">
              <span className="statLabel">댓글</span>
              <strong>{totalComments}</strong>
            </div>
            <div className="statCard">
              <span className="statLabel">상태</span>
              <strong>{viewer ? "로그인됨" : "읽기 전용"}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="contentGrid">
        <aside className="sidebarStack">
          <section className="panel featuredPanel">
            <div className="panelHeader">
              <p className="sectionLabel">계정</p>
              <h2>{viewer ? "새 글 작성" : "먼저 로그인하세요"}</h2>
            </div>

            {viewerName ? (
              <PostForm userName={viewerName} />
            ) : (
              <div className="stack gap16">
                <p className="mutedText">
                  게시글과 댓글을 작성하려면 아이디와 비밀번호로 로그인해야 합니다.
                </p>
                <Link className="buttonGhostLink buttonGhostLinkFill" href="/login">
                  로그인 화면 열기
                </Link>
              </div>
            )}
          </section>

          <section className="panel compactPanel">
            <div className="panelHeader">
              <p className="sectionLabel">안내</p>
              <h2>설정 메모</h2>
            </div>
            <p className="mutedText">
              이 업데이트를 반영한 뒤에는 <code>supabase/schema.sql</code> 을
              다시 실행해야 합니다. 게시글과 댓글에 로그인 사용자 연결과
              권한 정책이 포함되어 있습니다.
            </p>
            <p className="mutedText">
              아이디 전용 가입을 쓰려면 Supabase Auth 설정에서 이메일 인증을
              꺼야 합니다.
            </p>
          </section>
        </aside>

        <section className="feedStack">
          {loadError ? (
            <section className="panel warningPanel">
              <div className="panelHeader">
                <p className="sectionLabel">알림</p>
                <h2>게시판 스키마가 아직 준비되지 않았습니다</h2>
              </div>
              <p className="mutedText">
                현재 읽기 오류: <code>{loadError}</code>
              </p>
              <p className="mutedText">
                Supabase SQL Editor에서 <code>supabase/schema.sql</code> 을 다시
                실행해 인증용 스키마와 RLS 정책을 반영하세요.
              </p>
            </section>
          ) : null}

          {posts.length === 0 ? (
            <section className="panel emptyPanel">
              <p className="sectionLabel">빈 게시판</p>
              <h2>아직 게시글이 없습니다</h2>
              <p className="mutedText">
                {viewer
                  ? "로그인된 상태입니다. 왼쪽에서 첫 게시글을 작성해보세요."
                  : "먼저 로그인한 뒤 왼쪽에서 첫 게시글을 작성해보세요."}
              </p>
            </section>
          ) : null}

          {posts.map((post) => (
            <article className="panel postPanel" key={post.id}>
              <div className="postTopRow">
                <div>
                  <p className="sectionLabel">게시글</p>
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
                  <div className="commentCard commentEmpty">아직 댓글이 없습니다.</div>
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
                  <p className="mutedText">이 글에 댓글을 남기려면 로그인하세요.</p>
                  <Link className="buttonGhostLink" href="/login">
                    로그인 화면으로
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
