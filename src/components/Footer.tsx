import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.321 5.562a5.122 5.122 0 0 1-3.414-1.267 5.122 5.122 0 0 1-1.713-3.168V1h-3.364v13.152a3.021 3.021 0 0 1-5.44 1.796 3.021 3.021 0 0 1 3.713-4.64V7.9a6.384 6.384 0 0 0-5.173 11.692 6.384 6.384 0 0 0 10.27-5.074V8.44a8.462 8.462 0 0 0 5.121 1.711V6.786a5.088 5.088 0 0 1 0-1.224Z" />
  </svg>
);

const Footer = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;
  const defaultLogo = `${base}logo.webp`;

  return (
    <footer className="bg-foreground text-background">
      <div className="checkered-border h-2" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MediaEdit
                id="footer_logo_img"
                isEditing={isEditing}
                value={getDraftValue("footer_logo_img", defaultLogo)}
                onChange={(v) => updateDraft("footer_logo_img", v)}
              >
                <img
                  src={getDraftValue("footer_logo_img", defaultLogo)}
                  alt="Chick Rocks"
                  className="h-16 w-auto brightness-0 invert"
                />
              </MediaEdit>
              <InlineEdit
                id="footer_brand"
                as="h3"
                className="text-3xl font-heading text-primary"
                isEditing={isEditing}
                value={getDraftValue("footer_brand", "CHICK ROCKS")}
                onChange={(v) => updateDraft("footer_brand", v)}
              />
            </div>
            <div className="mt-4">
              <InlineEdit
                id="footer_follow_heading"
                as="h4"
                className="font-semibold mb-3 text-sm block"
                isEditing={isEditing}
                value={getDraftValue("footer_follow_heading", "Follow Us")}
                onChange={(v) => updateDraft("footer_follow_heading", v)}
              />
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/chickrocks_usa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chick Rocks on Instagram"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/chickrocks2022/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chick Rocks on Facebook"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@chickrockinc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chick Rocks on TikTok"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <div>
            <InlineEdit
              id="footer_col1_heading"
              as="h4"
              className="font-semibold mb-4 text-sm block"
              isEditing={isEditing}
              value={getDraftValue("footer_col1_heading", "Company")}
              onChange={(v) => updateDraft("footer_col1_heading", v)}
            />
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_1"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_1", "Home")}
                    onChange={(v) => updateDraft("footer_col1_link_1", v)}
                  />
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_2"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_2", "About Us")}
                    onChange={(v) => updateDraft("footer_col1_link_2", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_3"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_3", "Blog")}
                    onChange={(v) => updateDraft("footer_col1_link_3", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/catering" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_4"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_4", "Catering")}
                    onChange={(v) => updateDraft("footer_col1_link_4", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col1_link_5"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col1_link_5", "FAQ")}
                    onChange={(v) => updateDraft("footer_col1_link_5", v)}
                  />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <InlineEdit
              id="footer_col2_heading"
              as="h4"
              className="font-semibold mb-4 text-sm block"
              isEditing={isEditing}
              value={getDraftValue("footer_col2_heading", "Menu")}
              onChange={(v) => updateDraft("footer_col2_heading", v)}
            />
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <Link to="/menu#burger-sandwich-combo" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col2_link_1"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col2_link_1", "Burgers & Sandwiches")}
                    onChange={(v) => updateDraft("footer_col2_link_1", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/menu#chicken-wings" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col2_link_2"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col2_link_2", "Chicken Wings")}
                    onChange={(v) => updateDraft("footer_col2_link_2", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/menu#rice-bowl" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col2_link_3"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col2_link_3", "Rice Bowls")}
                    onChange={(v) => updateDraft("footer_col2_link_3", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/menu#rocks-spaghetti-combo" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col2_link_4"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col2_link_4", "Spaghetti")}
                    onChange={(v) => updateDraft("footer_col2_link_4", v)}
                  />
                </Link>
              </li>
              <li>
                <Link to="/menu#beverages" className="hover:opacity-100 transition-opacity">
                  <InlineEdit
                    id="footer_col2_link_5"
                    as="span"
                    isEditing={isEditing}
                    value={getDraftValue("footer_col2_link_5", "Drinks")}
                    onChange={(v) => updateDraft("footer_col2_link_5", v)}
                  />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <InlineEdit
              id="footer_col3_heading"
              as="h4"
              className="font-semibold mb-4 text-sm block"
              isEditing={isEditing}
              value={getDraftValue("footer_col3_heading", "Locations")}
              onChange={(v) => updateDraft("footer_col3_heading", v)}
            />
            <div className="text-sm opacity-70 space-y-4">
              <div>
                <InlineEdit
                  id="footer_loc_1_name"
                  as="p"
                  className="font-semibold opacity-100 block"
                  isEditing={isEditing}
                  value={getDraftValue("footer_loc_1_name", "Flushing")}
                  onChange={(v) => updateDraft("footer_loc_1_name", v)}
                />
                <InlineEdit
                  id="footer_loc_1_addr"
                  as="p"
                  className="block"
                  isEditing={isEditing}
                  multiline
                  value={getDraftValue("footer_loc_1_addr", "136-20 Roosevelt Ave #25,<br />Flushing, NY 11354")}
                  onChange={(v) => updateDraft("footer_loc_1_addr", v)}
                />
              </div>
              <div>
                <InlineEdit
                  id="footer_loc_2_name"
                  as="p"
                  className="font-semibold opacity-100 block"
                  isEditing={isEditing}
                  value={getDraftValue("footer_loc_2_name", "Astoria")}
                  onChange={(v) => updateDraft("footer_loc_2_name", v)}
                />
                <InlineEdit
                  id="footer_loc_2_addr"
                  as="p"
                  className="block"
                  isEditing={isEditing}
                  multiline
                  value={getDraftValue("footer_loc_2_addr", "30-02 Steinway St,<br />Astoria, NY 11103")}
                  onChange={(v) => updateDraft("footer_loc_2_addr", v)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-background/20 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm opacity-60 gap-4 md:gap-6">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <InlineEdit
              id="footer_copyright"
              as="p"
              isEditing={isEditing}
              value={getDraftValue("footer_copyright", "© Copyright Chick Rocks Inc. 2026")}
              onChange={(v) => updateDraft("footer_copyright", v)}
            />
            <p>
              <InlineEdit
                id="footer_credit_prefix"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("footer_credit_prefix", "Web Design &amp; SEO: ")}
                onChange={(v) => updateDraft("footer_credit_prefix", v)}
              />
              <a
                href={getDraftValue("footer_credit_url", "https://xocontinental.com")}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-100 transition-opacity"
              >
                <InlineEdit
                  id="footer_credit_name"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue(
                    "footer_credit_name",
                    "X.O. Continental Marketing &amp; Branding Co."
                  )}
                  onChange={(v) => updateDraft("footer_credit_name", v)}
                />
              </a>
              {isEditing && (
                <span className="ml-2 text-xs opacity-70">
                  Link URL:{" "}
                  <InlineEdit
                    id="footer_credit_url"
                    as="span"
                    className="underline"
                    isEditing={isEditing}
                    value={getDraftValue("footer_credit_url", "https://xocontinental.com")}
                    onChange={(v) => updateDraft("footer_credit_url", v)}
                  />
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:opacity-100 transition-opacity">
              <InlineEdit
                id="footer_privacy_link"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("footer_privacy_link", "Privacy policy")}
                onChange={(v) => updateDraft("footer_privacy_link", v)}
              />
            </Link>
            <Link to="/terms" className="hover:opacity-100 transition-opacity">
              <InlineEdit
                id="footer_terms_link"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("footer_terms_link", "Terms of use")}
                onChange={(v) => updateDraft("footer_terms_link", v)}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
