export type Comment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export type Post = {
  id: string;
  author_name: string;
  title: string;
  body: string;
  created_at: string;
  comments: Comment[];
};

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialActionState: ActionState = {
  status: "idle",
  message: "",
};
