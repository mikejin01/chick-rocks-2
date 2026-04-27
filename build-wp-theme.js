#!/usr/bin/env node
/**
 * Build pipeline: React/Vite bundle → WordPress theme folder.
 *
 * Usage:
 *   node build-wp-theme.js
 *
 * Output:
 *   wordpress-theme/                   — the theme (rsync/deploy this)
 *   wordpress-theme-upload/chick-rocks.zip  — uploadable via WP Admin → Themes
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import url from "url";
import archiver from "archiver";

const THEME_SLUG = "chick-rocks";
const THEME_NAME = "Chick Rocks";
const THEME_URI = "https://chickrocks.com/";
const AUTHOR = "Chick Rocks";
const VERSION = "1.0.0";

const GLOBAL_NAME = "ChickRocksTheme";
const REST_NAMESPACE = "chick-rocks/v1";

const FRONTEND_OUT = "dist";
const BUILD_CMD = "npm run build";

const WP_PAGES = [
  { title: "Home", slug: "home", front: true },
  { title: "Menu", slug: "menu", front: false },
  { title: "About Us", slug: "about", front: false },
  { title: "Catering", slug: "catering", front: false },
  { title: "Blog", slug: "blog", front: false },
  { title: "FAQ", slug: "faq", front: false },
  { title: "Privacy Policy", slug: "privacy", front: false },
  { title: "Terms of Use", slug: "terms", front: false },
];

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, FRONTEND_OUT);
const THEME_DIR = path.join(ROOT, "wordpress-theme");
const UPLOAD_DIR = path.join(ROOT, "wordpress-theme-upload");
const PUBLIC_DIR = path.join(ROOT, "public");
const BUILD_BASE = `/wp-content/themes/${THEME_SLUG}/`;

const log = (...a) => console.log("[build-wp]", ...a);

const ensureCleanDir = (dir) => {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
};

const removeDsStoreFiles = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) removeDsStoreFiles(full);
    else if (entry.name === ".DS_Store") fs.rmSync(full, { force: true });
  }
};

const runFrontendBuild = () => {
  log(`Running frontend build with BUILD_BASE=${BUILD_BASE}`);
  execSync(BUILD_CMD, {
    stdio: "inherit",
    env: { ...process.env, BUILD_BASE },
  });
};

const copyOutToTheme = () => {
  log(`Copying ${FRONTEND_OUT}/ → wordpress-theme/`);
  fs.cpSync(OUT_DIR, THEME_DIR, { recursive: true });
  if (fs.existsSync(PUBLIC_DIR)) {
    for (const file of fs.readdirSync(PUBLIC_DIR)) {
      const src = path.join(PUBLIC_DIR, file);
      const dest = path.join(THEME_DIR, file);
      const stat = fs.statSync(src);
      if (stat.isFile() && !fs.existsSync(dest)) fs.copyFileSync(src, dest);
      else if (stat.isDirectory() && !fs.existsSync(dest)) fs.cpSync(src, dest, { recursive: true });
    }
  }
  removeDsStoreFiles(THEME_DIR);
};

const findAsset = (ext) => {
  const assetsDir = path.join(OUT_DIR, "assets");
  if (!fs.existsSync(assetsDir)) return null;
  const files = fs.readdirSync(assetsDir).filter((f) => f.endsWith(ext) && !f.endsWith(".map"));
  if (!files.length) return null;
  return `assets/${files.find((f) => f.startsWith("index-")) ?? files[0]}`;
};

const writeStyleCss = () => {
  const css = `/*
Theme Name: ${THEME_NAME}
Theme URI: ${THEME_URI}
Author: ${AUTHOR}
Version: ${VERSION}
Requires at least: 5.0
Requires PHP: 7.4
License: GNU General Public License v2 or later
Text Domain: ${THEME_SLUG}
*/
`;
  fs.writeFileSync(path.join(THEME_DIR, "style.css"), css, "utf8");
};

const renderWpPagesPhpArray = () =>
  WP_PAGES.map(
    (p) =>
      `        array('title' => '${p.title}', 'slug' => '${p.slug}', 'front' => ${
        p.front ? "true" : "false"
      })`
  ).join(",\n");

const writePhpTemplates = (jsAsset, cssAsset) => {
  const tplPath = path.join(__dirname, "wp-templates", "functions.php.template");
  if (!fs.existsSync(tplPath)) {
    throw new Error(`functions.php.template not found at ${tplPath}`);
  }
  let functionsPhp = fs.readFileSync(tplPath, "utf8");
  functionsPhp = functionsPhp
    .replace(/<THEME_SLUG_FN>/g, THEME_SLUG.replace(/-/g, "_"))
    .replace(/<THEME_SLUG>/g, THEME_SLUG)
    .replace(/<GLOBAL_NAME>/g, GLOBAL_NAME)
    .replace(/<REST_NAMESPACE>/g, REST_NAMESPACE)
    .replace(/<JS_ASSET>/g, jsAsset || "")
    .replace(/<CSS_ASSET>/g, cssAsset || "")
    .replace(/<WP_PAGES_ARRAY>/g, renderWpPagesPhpArray());

  const headerPhp = `<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url(get_template_directory_uri()); ?>/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo esc_url(get_template_directory_uri()); ?>/favicon-16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url(get_template_directory_uri()); ?>/apple-touch-icon.png" />
    <?php wp_head(); ?>
    <style>
      #root { display: flex; flex-direction: column; min-height: 100vh; }
      .skeleton-main { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 60vh; }
      .skeleton-spinner { width: 40px; height: 40px; border: 3px solid rgba(0,0,0,.1); border-radius: 50%; border-top-color: #F97316; animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0; }
    </style>
</head>
<body <?php body_class(); ?>>
<div id="root">
`;

  const footerPhp = `</div>
<?php wp_footer(); ?>
</body>
</html>
`;

  const skeletonBody = `    <h1 class="sr-only"><?php echo esc_html(get_the_title(get_queried_object_id()) ?: get_bloginfo('name')); ?></h1>
    <div class="skeleton-main"><div class="skeleton-spinner"></div></div>`;

  const indexPhp = `<?php get_header(); ?>
${skeletonBody}
<?php get_footer();
`;

  const pagePhp = `<?php /* Template Name: React Catch-All Page */ ?>
<?php get_header(); ?>
${skeletonBody}
<?php get_footer(); ?>
`;

  const notFoundPhp = `<?php
// 404 — fall through to React so the client-side 404 route renders.
get_header(); ?>
${skeletonBody}
<?php get_footer();
`;

  const singlePhp = `<?php
// Single post — React Router renders /blog/:slug via BlogPost.tsx
// which fetches this post's content via /wp-json/wp/v2/posts?slug=...
get_header(); ?>
${skeletonBody}
<?php get_footer();
`;

  fs.writeFileSync(path.join(THEME_DIR, "functions.php"), functionsPhp, "utf8");
  fs.writeFileSync(path.join(THEME_DIR, "header.php"), headerPhp, "utf8");
  fs.writeFileSync(path.join(THEME_DIR, "footer.php"), footerPhp, "utf8");
  fs.writeFileSync(path.join(THEME_DIR, "index.php"), indexPhp, "utf8");
  fs.writeFileSync(path.join(THEME_DIR, "page.php"), pagePhp, "utf8");
  fs.writeFileSync(path.join(THEME_DIR, "single.php"), singlePhp, "utf8");
  fs.writeFileSync(path.join(THEME_DIR, "404.php"), notFoundPhp, "utf8");
};

const assertThemePhpLooksValid = () => {
  const fp = path.join(THEME_DIR, "functions.php");
  if (!fs.existsSync(fp)) throw new Error("functions.php missing after build.");
  const php = fs.readFileSync(fp, "utf8");
  if (!php.startsWith("<?php")) throw new Error("functions.php does not start with <?php");
};

const createZipForUpload = () =>
  new Promise((resolve, reject) => {
    log("Creating theme zip…");
    ensureCleanDir(UPLOAD_DIR);
    const zipPath = path.join(UPLOAD_DIR, `${THEME_SLUG}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", () => {
      log(`Zipped: ${zipPath} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
      resolve();
    });
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(THEME_DIR, THEME_SLUG);
    archive.finalize();
  });

const main = async () => {
  ensureCleanDir(THEME_DIR);
  runFrontendBuild();
  copyOutToTheme();
  const jsAsset = findAsset(".js");
  const cssAsset = findAsset(".css");
  if (!jsAsset) throw new Error(`No JS asset found in ${FRONTEND_OUT}/assets. Build failed?`);
  writeStyleCss();
  writePhpTemplates(jsAsset, cssAsset);
  assertThemePhpLooksValid();
  await createZipForUpload();
  log(`✅ Theme ready: ${THEME_DIR}`);
  log(`   Upload zip:  ${UPLOAD_DIR}/${THEME_SLUG}.zip`);
};

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
