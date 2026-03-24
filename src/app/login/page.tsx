import Link from "next/link";

import { SubmitButton } from "@/components/submit-button";

import { signIn, signUp } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const error = getValue(params.error);
  const success = getValue(params.success);

  return (
    <main className="authPageShell">
      <section className="authPageCard">
        <p className="eyebrow authEyebrow">로그인 후 글 작성 가능</p>
        <div className="authPageHeader">
          <div>
            <h1>게시판 접속</h1>
            <p className="mutedText">
              아이디와 비밀번호로 계정을 만들 수 있습니다. 게시판 읽기는
              누구나 가능하지만, 글과 댓글 작성은 로그인 후에만 가능합니다.
            </p>
          </div>
          <Link className="buttonGhostLink" href="/">
            게시판으로 돌아가기
          </Link>
        </div>

        {error ? <p className="statusNote error">{error}</p> : null}
        {success ? <p className="statusNote success">{success}</p> : null}

        <div className="authGrid">
          <section className="panel authPanel">
            <div className="panelHeader">
              <p className="sectionLabel">로그인</p>
              <h2>로그인</h2>
            </div>

            <form action={signIn} className="stack gap16">
              <div className="field">
                <label htmlFor="signin-username">아이디</label>
                <input
                  autoCapitalize="none"
                  autoCorrect="off"
                  id="signin-username"
                  name="username"
                  placeholder="아이디를 입력하세요"
                  required
                  type="text"
                />
              </div>

              <div className="field">
                <label htmlFor="signin-password">비밀번호</label>
                <input
                  id="signin-password"
                  name="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                  type="password"
                />
              </div>

              <SubmitButton idleLabel="로그인" pendingLabel="로그인 중..." />
            </form>
          </section>

          <section className="panel authPanel">
            <div className="panelHeader">
              <p className="sectionLabel">회원가입</p>
              <h2>계정 만들기</h2>
            </div>

            <form action={signUp} className="stack gap16">
              <div className="field">
                <label htmlFor="signup-username">아이디</label>
                <input
                  autoCapitalize="none"
                  autoCorrect="off"
                  id="signup-username"
                  maxLength={20}
                  name="username"
                  placeholder="3-20자: 영문 소문자, 숫자, . _ -"
                  required
                  type="text"
                />
              </div>

              <div className="field">
                <label htmlFor="signup-display-name">표시 이름</label>
                <input
                  id="signup-display-name"
                  maxLength={40}
                  name="displayName"
                  placeholder="게시판에 표시될 이름"
                  required
                  type="text"
                />
              </div>

              <div className="field">
                <label htmlFor="signup-password">비밀번호</label>
                <input
                  id="signup-password"
                  minLength={6}
                  name="password"
                  placeholder="최소 6자 이상"
                  required
                  type="password"
                />
              </div>

              <SubmitButton idleLabel="회원가입" pendingLabel="계정 생성 중..." />
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
