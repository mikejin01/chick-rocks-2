import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";
import { DEMO_POSTS, type BlogPost } from "@/lib/data/blog";
import { fetchWpPosts, isWordPressRuntime } from "@/lib/data/blog-wp";

const buildBlogLd = (posts: BlogPost[]) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Chick Rocks Blog",
  url: `${SITE.URL}/blog`,
  description:
    "Halal food guides, Astoria eats, fried chicken stories and the latest from the Chick Rocks kitchen.",
  publisher: { "@type": "Organization", name: SITE.NAME, logo: `${SITE.URL}/logo.webp` },
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    image: p.image,
    datePublished: p.date,
    url: `${SITE.URL}/blog/${p.slug}`,
    author: { "@type": "Organization", name: SITE.NAME },
  })),
});

const blogCrumbsLd = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
]);

const Blog = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;

  const [posts, setPosts] = useState<BlogPost[]>(DEMO_POSTS);
  const [loading, setLoading] = useState(isWordPressRuntime());

  useEffect(() => {
    let cancelled = false;
    if (!isWordPressRuntime()) return;
    setLoading(true);
    fetchWpPosts(24).then((wpPosts) => {
      if (cancelled) return;
      if (wpPosts && wpPosts.length > 0) setPosts(wpPosts);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Halal Food & Fried Chicken Blog | Chick Rocks"
        description="Halal food guides, Astoria eats, fried chicken explainers, recipes and news from Chick Rocks — the halal fried chicken spot in Astoria and Flushing, NY."
        path="/blog"
        keywords="halal food blog nyc, halal fried chicken blog, astoria food blog, queens halal guide"
        jsonLd={[buildBlogLd(posts), blogCrumbsLd]}
      />
      <Navbar />

      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-4">
          <MediaEdit
            id="blog_page_hero_logo"
            isEditing={isEditing}
            value={getDraftValue("blog_page_hero_logo", `${base}logo.webp`)}
            onChange={(v) => updateDraft("blog_page_hero_logo", v)}
          >
            <img
              src={getDraftValue("blog_page_hero_logo", `${base}logo.webp`)}
              alt="Chick Rocks halal fried chicken logo"
              className="h-20 md:h-24 w-auto brightness-0 invert"
            />
          </MediaEdit>
          <InlineEdit
            id="blog_page_title"
            as="h1"
            className="text-4xl md:text-5xl font-heading tracking-wider uppercase block"
            isEditing={isEditing}
            value={getDraftValue("blog_page_title", "The Chick Rocks Blog")}
            onChange={(v) => updateDraft("blog_page_title", v)}
          />
          <InlineEdit
            id="blog_page_hero_subtext"
            as="p"
            className="text-base md:text-md opacity-90 max-w-2xl mx-auto block"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "blog_page_hero_subtext",
              "Halal food stories, fried chicken favorites, and the latest from Astoria and Flushing."
            )}
            onChange={(v) => updateDraft("blog_page_hero_subtext", v)}
          />
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-16">
        {loading && posts.length === 0 ? (
          <p className="text-center text-muted-foreground">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {posts.map((post, index) => {
              const resolvedImg =
                post.image && !post.image.startsWith("http") ? `${base}${post.image}` : post.image;
              return (
                <article key={post.slug} className="group">
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="overflow-hidden rounded-2xl mb-5 bg-muted">
                      {resolvedImg ? (
                        <img
                          src={resolvedImg}
                          alt={post.title}
                          loading={index < 2 ? "eager" : "lazy"}
                          className="block w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-56 bg-muted" />
                      )}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                      Blog Post
                    </p>
                    <h2 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">
                      {post.date}
                    </p>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
