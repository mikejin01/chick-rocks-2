import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import "./globals.css";

const SITE_URL = "https://chickrocksusa.com";
const SITE_TITLE = "Chick Rocks — Halal Fried Chicken in Astoria, NY";
const SITE_DESCRIPTION =
  "Crispy halal fried chicken, signature sandwiches, wings, rice bowls and spaghetti combos in Astoria & Flushing, Queens. Dine in, takeout and delivery.";

export const viewport: Viewport = {
  themeColor: "#F97316",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  authors: [{ name: "Chick Rocks" }],
  robots: { index: true, follow: true, "max-image-preview": "large" },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Chick Rocks",
    locale: "en_US",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/CHICK ROCKS.png",
        alt: "Chick Rocks — Halal Fried Chicken in Astoria and Flushing, NY",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ChickRocks",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/CHICK ROCKS.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
