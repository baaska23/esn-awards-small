// Public Supabase Storage bucket that holds every image of the site
// (nominees, team/game logos, the ESN logo, the placeholder).
export const IMAGE_BUCKET_URL =
  "https://xybjtvqolcrypevzyxfp.supabase.co/storage/v1/object/public/esn-awards-2026";

// Resolve an image value (from esn.awards or a literal filename) to a usable <Image src>.
// - Full URLs are used as-is.
// - Plain filenames are loaded from the bucket.
// Callers may pass the value with or without a leading "/".
export function imageSrc(path?: string | null): string {
  const p = (path ?? "").replace(/^\/+/, "");
  if (!p) return `${IMAGE_BUCKET_URL}/placeholder.png`;
  if (/^https?:\/\//i.test(p)) return p;
  return `${IMAGE_BUCKET_URL}/${p}`;
}
