"use client";

import clsx from "clsx";
import { useActionState, useEffect, useRef } from "react";

import { createComment } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { initialActionState } from "@/lib/types";

type CommentFormProps = {
  postId: string;
  userName: string;
};

export function CommentForm({ postId, userName }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createComment, initialActionState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="commentForm">
      <input name="postId" type="hidden" value={postId} />

      <p className="helperText">
        <strong>{userName}</strong> 이름으로 댓글 작성 중
      </p>

      <div className="commentGrid">
        <div className="field">
          <label htmlFor={`comment-body-${postId}`}>댓글</label>
          <textarea
            id={`comment-body-${postId}`}
            name="body"
            maxLength={800}
            placeholder="이 게시글에 대한 의견을 남겨보세요."
            required
            rows={4}
          />
        </div>
      </div>

      <div className="commentActionRow">
        <SubmitButton idleLabel="댓글 등록" pendingLabel="등록 중..." />
        {state.message ? (
          <p className={clsx("statusNote", state.status)}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
