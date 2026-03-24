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
        <p className="eyebrow authEyebrow">SIGN IN TO WRITE</p>
        <div className="authPageHeader">
          <div>
            <h1>Access the board</h1>
            <p className="mutedText">
              Create an account with a username and password. Reading stays
              public, but posts and comments require sign-in.
            </p>
          </div>
          <Link className="buttonGhostLink" href="/">
            Back to board
          </Link>
        </div>

        {error ? <p className="statusNote error">{error}</p> : null}
        {success ? <p className="statusNote success">{success}</p> : null}

        <div className="authGrid">
          <section className="panel authPanel">
            <div className="panelHeader">
              <p className="sectionLabel">LOGIN</p>
              <h2>Sign in</h2>
            </div>

            <form action={signIn} className="stack gap16">
              <div className="field">
                <label htmlFor="signin-username">Username</label>
                <input
                  autoCapitalize="none"
                  autoCorrect="off"
                  id="signin-username"
                  name="username"
                  placeholder="your-id"
                  required
                  type="text"
                />
              </div>

              <div className="field">
                <label htmlFor="signin-password">Password</label>
                <input
                  id="signin-password"
                  name="password"
                  placeholder="Your password"
                  required
                  type="password"
                />
              </div>

              <SubmitButton idleLabel="Sign in" pendingLabel="Signing in..." />
            </form>
          </section>

          <section className="panel authPanel">
            <div className="panelHeader">
              <p className="sectionLabel">SIGN UP</p>
              <h2>Create account</h2>
            </div>

            <form action={signUp} className="stack gap16">
              <div className="field">
                <label htmlFor="signup-username">Username</label>
                <input
                  autoCapitalize="none"
                  autoCorrect="off"
                  id="signup-username"
                  maxLength={20}
                  name="username"
                  placeholder="3-20 chars: a-z, 0-9, . _ -"
                  required
                  type="text"
                />
              </div>

              <div className="field">
                <label htmlFor="signup-display-name">Display name</label>
                <input
                  id="signup-display-name"
                  maxLength={40}
                  name="displayName"
                  placeholder="How your posts should appear"
                  required
                  type="text"
                />
              </div>

              <div className="field">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  minLength={6}
                  name="password"
                  placeholder="At least 6 characters"
                  required
                  type="password"
                />
              </div>

              <SubmitButton idleLabel="Create account" pendingLabel="Creating..." />
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
