import { Link } from "react-router-dom";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";
import { MediaEdit } from "@/components/ui/media-edit";

const CrowdFavorites = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();
  const base = import.meta.env.BASE_URL;

  const favorites = [
    {
      key: "fav_1",
      name: "Halal Fried Chicken",
      desc: " Crispy, juicy, and full of flavor, our halal fried chicken is seasoned for the perfect bite every time.",
      img: `${base}hero-1.webp`,
    },
    {
      key: "fav_2",
      name: "Rice Bowls",
      desc: "Build your meal around tender chicken, bold sauces, and satisfying rice bowls made for lunch or dinner.",
      img: `${base}rice-bowl-fav.webp`,
    },
    {
      key: "fav_3",
      name: "Crawfish Sandwich",
      desc: "A unique Chick Rocks favorite packed with flavor, layered with sauce, and made to stand out from the usual sandwich lineup.",
      img: `${base}snack-1.webp`,
    },
    {
      key: "fav_4",
      name: "Chicken Burger",
      desc: "Crispy chicken, fresh slaw, and bold sauce served on a soft toasted bun for a crave-worthy bite.",
      img: `${base}hero-2.webp`,
    },
  ];

  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <InlineEdit
            id="favorites_heading"
            as="h2"
            className="text-3xl md:text-4xl font-heading uppercase text-foreground"
            isEditing={isEditing}
            value={getDraftValue("favorites_heading", "Customer Favorites")}
            onChange={(v) => updateDraft("favorites_heading", v)}
          />
          <Link to="/menu" className="text-primary font-semibold text-sm hover:underline">
            <InlineEdit
              id="favorites_view_menu"
              as="span"
              isEditing={isEditing}
              value={getDraftValue("favorites_view_menu", "View Menu →")}
              onChange={(v) => updateDraft("favorites_view_menu", v)}
            />
          </Link>
        </div>
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none scrollbar-hide">
          {favorites.map((item) => {
            const nameKey = `${item.key}_name`;
            const descKey = `${item.key}_desc`;
            const imgKey = `${item.key}_img`;
            return (
              <div
                key={item.key}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow flex flex-col shrink-0 w-[75%] snap-start sm:w-auto sm:shrink"
              >
                <MediaEdit
                  id={imgKey}
                  isEditing={isEditing}
                  value={getDraftValue(imgKey, item.img)}
                  onChange={(v) => updateDraft(imgKey, v)}
                  className="h-48 overflow-hidden"
                >
                  <img
                    src={getDraftValue(imgKey, item.img)}
                    alt={item.name}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </MediaEdit>
                <div className="p-4 flex flex-col flex-1">
                  <InlineEdit
                    id={nameKey}
                    as="h3"
                    className="font-heading text-lg uppercase text-foreground mb-2 block"
                    isEditing={isEditing}
                    value={getDraftValue(nameKey, item.name)}
                    onChange={(v) => updateDraft(nameKey, v)}
                  />
                  <InlineEdit
                    id={descKey}
                    as="p"
                    className="text-sm text-muted-foreground leading-relaxed mb-2 block"
                    isEditing={isEditing}
                    multiline
                    value={getDraftValue(descKey, item.desc)}
                    onChange={(v) => updateDraft(descKey, v)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CrowdFavorites;
