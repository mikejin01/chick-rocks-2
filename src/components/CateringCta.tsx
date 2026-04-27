import { Link } from "react-router-dom";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const CateringCta = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;
  const defaultImg = `${base}catering-2.avif`;

  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px]">
          <MediaEdit
            id="home_catering_img"
            isEditing={isEditing}
            value={getDraftValue("home_catering_img", defaultImg)}
            onChange={(v) => updateDraft("home_catering_img", v)}
            className="flex justify-center md:justify-end order-1 md:order-2"
          >
            <img
              src={getDraftValue("home_catering_img", defaultImg)}
              alt="Chick Rocks catering spread"
              loading="lazy"
              className="w-full max-w-[600px] h-auto max-h-[600px] object-contain rounded-3xl"
            />
          </MediaEdit>

          <div className="max-w-2xl space-y-6 order-2 md:order-1 md:justify-self-end md:pr-4">
            <InlineEdit
              id="home_catering_eyebrow"
              as="p"
              className="text-accent font-bold uppercase tracking-wide text-sm block"
              isEditing={isEditing}
              value={getDraftValue("home_catering_eyebrow", "Cater With Us")}
              onChange={(v) => updateDraft("home_catering_eyebrow", v)}
            />
            <InlineEdit
              id="home_catering_heading"
              as="h2"
              className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block"
              isEditing={isEditing}
              value={getDraftValue("home_catering_heading", "Feed The Whole Crew")}
              onChange={(v) => updateDraft("home_catering_heading", v)}
            />
            <InlineEdit
              id="home_catering_body"
              as="p"
              className="text-muted-foreground leading-relaxed block"
              isEditing={isEditing}
              multiline
              value={getDraftValue(
                "home_catering_body",
                "From office lunches and school events to birthday parties and family gatherings, Chick Rocks catering brings halal fried chicken, sandwiches, rice bowls, and sides to your table in Flushing and Astoria."
              )}
              onChange={(v) => updateDraft("home_catering_body", v)}
            />
            <Link
              to="/catering"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              <InlineEdit
                id="home_catering_cta"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("home_catering_cta", "Explore Catering")}
                onChange={(v) => updateDraft("home_catering_cta", v)}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CateringCta;
