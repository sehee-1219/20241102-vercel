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
        Commenting as <strong>{userName}</strong>
      </p>

      <div className="commentGrid">
        <div className="field">
          <label htmlFor={`comment-body-${postId}`}>Comment</label>
          <textarea
            id={`comment-body-${postId}`}
            name="body"
            maxLength={800}
            placeholder="Leave a reply for this post."
            required
            rows={4}
          />
        </div>
      </div>

      <div className="commentActionRow">
        <SubmitButton idleLabel="Post comment" pendingLabel="Saving..." />
        {state.message ? (
          <p className={clsx("statusNote", state.status)}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
