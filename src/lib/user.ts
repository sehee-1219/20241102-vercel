import type { User } from "@supabase/supabase-js";

function trimValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getDisplayName(user: User) {
  const displayName =
    trimValue(user.user_metadata?.display_name) ||
    trimValue(user.user_metadata?.name);

  if (displayName) {
    return displayName;
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "Member";
}
