"use client";

import clsx from "clsx";
import { useActionState, useEffect, useRef } from "react";

import { createComment } from "@/app/actions";
import { initialActionState } from "@/lib/types";
import { SubmitButton } from "@/components/submit-button";

type CommentFormProps = {
  postId: string;
};

export function CommentForm({ postId }: CommentFormProps) {
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

      <div className="commentGrid">
        <div className="field">
          <label htmlFor={`comment-author-${postId}`}>작성자</label>
          <input
            id={`comment-author-${postId}`}
            name="authorName"
            maxLength={40}
            placeholder="댓글 작성자"
            required
            type="text"
          />
        </div>

        <div className="field">
          <label htmlFor={`comment-body-${postId}`}>댓글</label>
          <textarea
            id={`comment-body-${postId}`}
            name="body"
            maxLength={800}
            placeholder="이 글에 대한 의견을 남겨보세요."
            required
            rows={4}
          />
        </div>
      </div>

      <div className="commentActionRow">
        <SubmitButton idleLabel="댓글 남기기" pendingLabel="저장 중..." />
        {state.message ? (
          <p className={clsx("statusNote", state.status)}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
