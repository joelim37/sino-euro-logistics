const DEFAULT_ADMIN_BASE_PATH = "/portal-se-eu-7k9x2m";

function normalizeAdminBasePath(path: string) {
  if (!path) return DEFAULT_ADMIN_BASE_PATH;

  const trimmed = path.trim();
  if (!trimmed) return DEFAULT_ADMIN_BASE_PATH;

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, "") || DEFAULT_ADMIN_BASE_PATH;
}

export const ADMIN_BASE_PATH = normalizeAdminBasePath(
  process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || DEFAULT_ADMIN_BASE_PATH
);

export function toAdminPath(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${ADMIN_BASE_PATH}${normalizedPath === "/" ? "" : normalizedPath}`;
}
