import { Link } from "react-router-dom";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const FeaturedMeals = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;
  const defaultImg = `${base}Chicken-1.avif`;

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px]">
          <div className="max-w-2xl space-y-6 order-2 md:justify-self-start md:pl-4">
            <InlineEdit
              id="catering_eyebrow"
              as="p"
              className="text-accent font-bold uppercase tracking-wide text-sm block"
              isEditing={isEditing}
              value={getDraftValue("catering_eyebrow", "Seasoned East, Fried West")}
              onChange={(v) => updateDraft("catering_eyebrow", v)}
            />
            <InlineEdit
              id="catering_heading"
              as="h2"
              className="text-4xl md:text-5xl font-heading uppercase leading-tight text-foreground block"
              isEditing={isEditing}
              value={getDraftValue("catering_heading", "Halal Chicken with Asian Flavor")}
              onChange={(v) => updateDraft("catering_heading", v)}
            />
            <InlineEdit
              id="catering_body_1"
              as="p"
              className="text-muted-foreground leading-relaxed block"
              isEditing={isEditing}
              multiline
              value={getDraftValue(
                "catering_body_1",
                "At Chick Rocks, we serve crispy halal fried chicken with bold Southern-style crunch and Asian-American flavor inspired by Queens. From spicy chicken sandwiches and wings to rice bowls, pasta, and bubble tea, our menu is made to satisfy every craving."
              )}
              onChange={(v) => updateDraft("catering_body_1", v)}
            />
            <Link
              to="/faq"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              <InlineEdit
                id="catering_cta"
                as="span"
                isEditing={isEditing}
                value={getDraftValue("catering_cta", "Learn More")}
                onChange={(v) => updateDraft("catering_cta", v)}
              />
            </Link>
          </div>

          <MediaEdit
            id="catering_img"
            isEditing={isEditing}
            value={getDraftValue("catering_img", defaultImg)}
            onChange={(v) => updateDraft("catering_img", v)}
            className="flex justify-center md:justify-start order-1"
          >
            <img
              src={getDraftValue("catering_img", defaultImg)}
              alt="Chick Rocks halal fried chicken"
              loading="lazy"
              className="w-full max-w-[600px] h-auto max-h-[600px] object-contain rounded-3xl"
            />
          </MediaEdit>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMeals;
