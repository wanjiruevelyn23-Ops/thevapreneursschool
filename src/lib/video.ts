/**
 * Lesson videos are embedded only from known providers; anything else is shown
 * as an external link. Returns an embeddable https URL or null.
 */
export function videoEmbedUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\./, "");
  const id = (v: string | null | undefined) => (v && /^[\w-]+$/.test(v) ? v : null);

  if (host === "youtube.com" || host === "m.youtube.com") {
    const v = id(url.searchParams.get("v")) ?? id(url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1]);
    return v ? `https://www.youtube-nocookie.com/embed/${v}` : null;
  }
  if (host === "youtu.be") {
    const v = id(url.pathname.slice(1));
    return v ? `https://www.youtube-nocookie.com/embed/${v}` : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const v = url.pathname.match(/(\d+)/)?.[1];
    return v ? `https://player.vimeo.com/video/${v}` : null;
  }
  if (host === "loom.com") {
    const v = id(url.pathname.match(/^\/(?:share|embed)\/([\w-]+)/)?.[1]);
    return v ? `https://www.loom.com/embed/${v}` : null;
  }
  if (host === "drive.google.com") {
    const v = id(url.pathname.match(/\/file\/d\/([\w-]+)/)?.[1]);
    return v ? `https://drive.google.com/file/d/${v}/preview` : null;
  }
  return null;
}

/** Returns a safe https URL for opening a non-embedded video link externally. */
export function safeVideoLink(raw: string | undefined | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
