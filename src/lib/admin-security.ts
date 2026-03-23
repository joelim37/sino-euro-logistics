import { createClient } from "@supabase/supabase-js";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const WINDOW_MINUTES = 15;
const KEY_PREFIX = "admin_login_guard:";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(url, key);
}

function normalizeIdentifier(identifier?: string | null) {
  return (identifier || "unknown").trim().toLowerCase().replace(/[^a-z0-9@._:-]/g, "_");
}

function getKey(identifier?: string | null) {
  return `${KEY_PREFIX}${normalizeIdentifier(identifier)}`;
}

interface GuardRecord {
  attempts: number;
  firstAttemptAt?: string;
  lockedUntil?: string;
  lastAttemptAt?: string;
}

async function getRecord(identifier?: string | null): Promise<GuardRecord> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", getKey(identifier))
    .maybeSingle();

  if (!data?.value) return { attempts: 0 };

  try {
    return JSON.parse(data.value) as GuardRecord;
  } catch {
    return { attempts: 0 };
  }
}

async function setRecord(identifier: string | null | undefined, record: GuardRecord) {
  const supabase = getSupabaseAdmin();
  await supabase.from("site_config").upsert({
    key: getKey(identifier),
    value: JSON.stringify(record),
    updated_at: new Date().toISOString(),
  }, { onConflict: "key" });
}

export async function getLoginGuardStatus(identifier?: string | null) {
  const record = await getRecord(identifier);
  const now = Date.now();
  const lockedUntil = record.lockedUntil ? new Date(record.lockedUntil).getTime() : 0;
  const firstAttemptAt = record.firstAttemptAt ? new Date(record.firstAttemptAt).getTime() : 0;

  if (lockedUntil && lockedUntil > now) {
    return {
      locked: true,
      remainingSeconds: Math.max(0, Math.ceil((lockedUntil - now) / 1000)),
      attempts: record.attempts || 0,
    };
  }

  if (firstAttemptAt && now - firstAttemptAt > WINDOW_MINUTES * 60 * 1000) {
    await clearLoginGuard(identifier);
    return { locked: false, remainingSeconds: 0, attempts: 0 };
  }

  return { locked: false, remainingSeconds: 0, attempts: record.attempts || 0 };
}

export async function recordLoginFailure(identifier?: string | null) {
  const nowIso = new Date().toISOString();
  const now = Date.now();
  const current = await getRecord(identifier);
  const firstAttemptAt = current.firstAttemptAt ? new Date(current.firstAttemptAt).getTime() : 0;
  const expired = !firstAttemptAt || now - firstAttemptAt > WINDOW_MINUTES * 60 * 1000;
  const attempts = expired ? 1 : (current.attempts || 0) + 1;

  const record: GuardRecord = {
    attempts,
    firstAttemptAt: expired ? nowIso : current.firstAttemptAt || nowIso,
    lastAttemptAt: nowIso,
  };

  if (attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = new Date(now + LOCK_MINUTES * 60 * 1000).toISOString();
  }

  await setRecord(identifier, record);

  return {
    locked: Boolean(record.lockedUntil),
    attempts,
    remainingSeconds: record.lockedUntil
      ? Math.ceil((new Date(record.lockedUntil).getTime() - now) / 1000)
      : 0,
    maxAttempts: MAX_ATTEMPTS,
    lockMinutes: LOCK_MINUTES,
  };
}

export async function clearLoginGuard(identifier?: string | null) {
  const supabase = getSupabaseAdmin();
  await supabase.from("site_config").delete().eq("key", getKey(identifier));
}

export const adminLoginGuardConfig = {
  maxAttempts: MAX_ATTEMPTS,
  lockMinutes: LOCK_MINUTES,
  windowMinutes: WINDOW_MINUTES,
};
