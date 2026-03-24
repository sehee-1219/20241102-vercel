import type { User } from "@supabase/supabase-js";

const USERNAME_PATTERN = /^[a-z0-9]{3,20}$/;
const CURRENT_INTERNAL_EMAIL_DOMAIN = "signalboardapp.com";
const LEGACY_INTERNAL_EMAIL_DOMAINS = [
  "users.signal-board.local",
  "users.signal-board.example.com",
];

function trimValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string) {
  return USERNAME_PATTERN.test(value);
}

export function buildInternalEmail(username: string) {
  return `${username}@${CURRENT_INTERNAL_EMAIL_DOMAIN}`;
}

export function getCandidateEmails(username: string) {
  return [
    `${username}@${CURRENT_INTERNAL_EMAIL_DOMAIN}`,
    ...LEGACY_INTERNAL_EMAIL_DOMAINS.map((domain) => `${username}@${domain}`),
  ];
}

export function getUsername(user: User) {
  const metadataUsername =
    trimValue(user.user_metadata?.username) ||
    trimValue(user.user_metadata?.user_name);

  if (metadataUsername) {
    return normalizeUsername(metadataUsername);
  }

  for (const domain of [
    CURRENT_INTERNAL_EMAIL_DOMAIN,
    ...LEGACY_INTERNAL_EMAIL_DOMAINS,
  ]) {
    if (user.email?.endsWith(`@${domain}`)) {
      return user.email.replace(`@${domain}`, "");
    }
  }

  return "member";
}

export function getDisplayName(user: User) {
  const displayName =
    trimValue(user.user_metadata?.display_name) ||
    trimValue(user.user_metadata?.name);

  if (displayName) {
    return displayName;
  }

  return getUsername(user);
}
