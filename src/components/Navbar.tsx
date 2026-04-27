import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const Navbar = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2" aria-label="Chick Rocks home">
              <MediaEdit
                id="nav_logo_img"
                isEditing={isEditing}
                value={getDraftValue("nav_logo_img", `${base}logo.webp`)}
                onChange={(v) => updateDraft("nav_logo_img", v)}
              >
                <img
                  src={getDraftValue("nav_logo_img", `${base}logo.webp`)}
                  alt="Chick Rocks"
                  className="h-12 w-auto"
                />
              </MediaEdit>
              <InlineEdit
                id="nav_brand"
                as="h1"
                className="text-2xl font-heading text-primary tracking-wider"
                isEditing={isEditing}
                value={getDraftValue("nav_brand", "CHICK ROCKS")}
                onChange={(v) => updateDraft("nav_brand", v)}
              />
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href="https://pos.chowbus.com/online-ordering/store/chick-rocks/11843"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <InlineEdit
                  id="nav_location_1"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue("nav_location_1", "Flushing, NY")}
                  onChange={(v) => updateDraft("nav_location_1", v)}
                />
              </a>
              <span className="text-border">|</span>
              <a
                href="https://pos.chowbus.com/online-ordering/store/chick-rocks-astoria/20957"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <InlineEdit
                  id="nav_location_2"
                  as="span"
                  isEditing={isEditing}
                  value={getDraftValue("nav_location_2", "Astoria, NY")}
                  onChange={(v) => updateDraft("nav_location_2", v)}
                />
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium ml-auto">
            <a href="#" className="text-primary">
              <InlineEdit
                id="nav_link_home"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_home", "Home")}
                onChange={(v) => updateDraft("nav_link_home", v)}
              />
            </a>
            <Link to="/menu" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_menu"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_menu", "Menu")}
                onChange={(v) => updateDraft("nav_link_menu", v)}
              />
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_about"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_about", "About Us")}
                onChange={(v) => updateDraft("nav_link_about", v)}
              />
            </Link>
            <Link to="/catering" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_catering"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_catering", "Catering")}
                onChange={(v) => updateDraft("nav_link_catering", v)}
              />
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_blog"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_blog", "Blog")}
                onChange={(v) => updateDraft("nav_link_blog", v)}
              />
            </Link>
            <Link to="/faq" className="text-foreground hover:text-primary transition-colors">
              <InlineEdit
                id="nav_link_faq"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("nav_link_faq", "FAQ")}
                onChange={(v) => updateDraft("nav_link_faq", v)}
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
