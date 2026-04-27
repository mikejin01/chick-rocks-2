import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo, { breadcrumbLd, SITE } from "@/components/Seo";
import { DEMO_POSTS, type BlogPost as BlogPostType } from "@/lib/data/blog";
import { fetchWpPostBySlug, isWordPressRuntime } from "@/lib/data/blog-wp";

type LoadState = "loading" | "ok" | "not_found";

const BlogPost = () => {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(() =>
    DEMO_POSTS.find((p) => p.slug === slug) ?? null
  );
  const [state, setState] = useState<LoadState>(() => {
    if (!slug) return "not_found";
    if (isWordPressRuntime()) return "loading";
    return DEMO_POSTS.some((p) => p.slug === slug) ? "ok" : "not_found";
  });

  useEffect(() => {
    let cancelled = false;
    if (!isWordPressRuntime()) return;
    if (!slug) {
      setState("not_found");
      return;
    }
    setState("loading");
    fetchWpPostBySlug(slug).then((wpPost) => {
      if (cancelled) return;
      if (wpPost) {
        setPost(wpPost);
        setState("ok");
      } else {
        const fallback = DEMO_POSTS.find((p) => p.slug === slug) ?? null;
        setPost(fallback);
        setState(fallback ? "ok" : "not_found");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const postUrl = `${SITE.URL}/blog/${slug}`;

  if (state === "not_found") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Seo
          title="Post Not Found | Chick Rocks Blog"
          description="That blog post doesn't exist. Head back to the Chick Rocks blog for halal fried chicken guides and updates."
          path={`/blog/${slug}`}
          noIndex
        />
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-24 max-w-3xl text-center space-y-4">
          <h1 className="text-4xl font-heading uppercase text-foreground">Post Not Found</h1>
          <p className="text-muted-foreground">
            Sorry, that blog post isn't available. It may have been moved or unpublished.
          </p>
          <div>
            <Link
              to="/blog"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (state === "loading" || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Seo
          title="Loading… | Chick Rocks Blog"
          description="Loading blog post."
          path={`/blog/${slug}`}
          noIndex
        />
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-24 max-w-3xl text-center">
          <p className="text-muted-foreground">Loading post…</p>
        </main>
        <Footer />
      </div>
    );
  }

  const postLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image || undefined,
    datePublished: post.date,
    url: postUrl,
    mainEntityOfPage: postUrl,
    author: { "@type": "Organization", name: SITE.NAME, url: SITE.URL },
    publisher: {
      "@type": "Organization",
      name: SITE.NAME,
      logo: { "@type": "ImageObject", url: `${SITE.URL}/logo.webp` },
    },
  };

  const crumbsLd = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title={`${post.title} | Chick Rocks Blog`}
        description={
          post.excerpt ||
          `${post.title} — from the Chick Rocks halal fried chicken blog in Astoria, NY.`
        }
        path={`/blog/${post.slug}`}
        type="article"
        image={post.image || undefined}
        imageAlt={post.title}
        jsonLd={[postLd, crumbsLd]}
      />
      <Navbar />

      <article className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-primary">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        <header className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Blog Post
          </p>
          <h1 className="text-3xl md:text-4xl font-heading uppercase text-foreground leading-tight">
            {post.title}
          </h1>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            {post.date}
          </p>
        </header>

        {post.image && (
          <figure className="mb-10 overflow-hidden rounded-2xl bg-muted">
            <img
              src={post.image}
              alt={post.title}
              loading="eager"
              className="block w-full h-auto max-h-[480px] object-cover"
            />
          </figure>
        )}

        <div
          className="prose prose-neutral max-w-none text-foreground leading-relaxed space-y-5 [&_p]:mb-5 [&_h2]:text-2xl [&_h2]:font-heading [&_h2]:uppercase [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline [&_img]:rounded-xl [&_img]:my-6"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/blog"
            className="text-primary font-semibold hover:underline"
          >
            ← Back to all posts
          </Link>
          <a
            href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            Order Halal Fried Chicken
          </a>
        </footer>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
