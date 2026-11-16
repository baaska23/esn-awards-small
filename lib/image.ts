// Resolve an image path stored in esn.awards to a usable <Image src>.
// - Full URLs (e.g. Supabase Storage public URLs) are used as-is.
// - Plain filenames are served from public/ under the /mea basePath.
// Callers may pass the value with or without a leading "/".
export function imageSrc(path?: string | null): string {
  const p = (path ?? "").replace(/^\/+/, "");
  if (!p) return "/mea/placeholder.png";
  if (/^https?:\/\//i.test(p)) return p;
  return `/mea/${p}`;
}
