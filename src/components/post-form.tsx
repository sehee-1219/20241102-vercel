"use client";

import clsx from "clsx";
import { useActionState, useEffect, useRef } from "react";

import { createPost } from "@/app/actions";
import { initialActionState } from "@/lib/types";
import { SubmitButton } from "@/components/submit-button";

export function PostForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createPost, initialActionState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="stack gap16">
      <div className="field">
        <label htmlFor="post-author">작성자</label>
        <input
          id="post-author"
          name="authorName"
          maxLength={40}
          placeholder="닉네임 또는 이름"
          required
          type="text"
        />
      </div>

      <div className="field">
        <label htmlFor="post-title">제목</label>
        <input
          id="post-title"
          name="title"
          maxLength={120}
          placeholder="무슨 이야기를 남길까요?"
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
          placeholder="공지, 일상, 질문, 회고를 자유롭게 남겨보세요."
          required
          rows={8}
        />
      </div>

      <SubmitButton idleLabel="게시글 올리기" pendingLabel="등록 중..." />

      {state.message ? (
        <p className={clsx("statusNote", state.status)}>{state.message}</p>
      ) : null}
    </form>
  );
}
