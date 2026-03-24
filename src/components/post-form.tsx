"use client";

import clsx from "clsx";
import { useActionState, useEffect, useRef } from "react";

import { createPost } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { initialActionState } from "@/lib/types";

type PostFormProps = {
  userName: string;
};

export function PostForm({ userName }: PostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createPost, initialActionState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="stack gap16">
      <p className="helperText">
        <strong>{userName}</strong> 이름으로 작성 중
      </p>

      <div className="field">
        <label htmlFor="post-title">제목</label>
        <input
          id="post-title"
          name="title"
          maxLength={120}
          placeholder="어떤 내용을 올릴까요?"
          required
          type="text"
        />
      </div>

      <div className="field">
        <label htmlFor="post-body">내용</label>
        <textarea
          id="post-body"
          name="body"
          maxLength={2000}
          placeholder="공지, 질문, 후기, 일상 등 자유롭게 작성하세요."
          required
          rows={8}
        />
      </div>

      <SubmitButton idleLabel="게시글 등록" pendingLabel="등록 중..." />

      {state.message ? (
        <p className={clsx("statusNote", state.status)}>{state.message}</p>
      ) : null}
    </form>
  );
}
