import type { BlogPost } from "./blog";

type WpPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: { sizes?: Record<string, { source_url?: string }> };
    }>;
  };
};

const getRestUrl = (): string | null => {
  if (typeof window === "undefined") return null;
  const theme = window.ChickRocksTheme;
  if (!theme || !theme.restUrl) return null;
  return theme.restUrl.replace(/\/$/, "");
};

const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const mapWpPost = (p: WpPost): BlogPost => {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  const image =
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.source_url ||
    "";
  return {
    slug: p.slug,
    title: stripHtml(p.title?.rendered || ""),
    date: formatDate(p.date),
    image,
    excerpt: stripHtml(p.excerpt?.rendered || ""),
    body: p.content?.rendered || "",
  };
};

export const isWordPressRuntime = () => getRestUrl() !== null;

export const fetchWpPosts = async (perPage = 20): Promise<BlogPost[] | null> => {
  const base = getRestUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/wp/v2/posts?_embed=1&per_page=${perPage}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WpPost[];
    return data.map(mapWpPost);
  } catch {
    return null;
  }
};

export const fetchWpPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const base = getRestUrl();
  if (!base) return null;
  try {
    const res = await fetch(
      `${base}/wp/v2/posts?_embed=1&slug=${encodeURIComponent(slug)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as WpPost[];
    const first = data[0];
    return first ? mapWpPost(first) : null;
  } catch {
    return null;
  }
};
