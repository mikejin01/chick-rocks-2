import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Seo from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";

const NotFound = () => {
  const location = useLocation();
  const { isEditing, getDraftValue, updateDraft } = useEdit();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Seo
        title="Page Not Found | Chick Rocks"
        description="That page doesn't exist. Head back to the Chick Rocks homepage or check out our halal fried chicken menu."
        path={location.pathname || "/404"}
        noIndex
      />
      <div className="text-center">
        <InlineEdit
          id="notfound_title"
          as="h1"
          className="mb-4 text-4xl font-bold block"
          isEditing={isEditing}
          value={getDraftValue("notfound_title", "404 — Page Not Found")}
          onChange={(v) => updateDraft("notfound_title", v)}
        />
        <InlineEdit
          id="notfound_body"
          as="p"
          className="mb-4 text-xl text-muted-foreground block"
          isEditing={isEditing}
          multiline
          value={getDraftValue(
            "notfound_body",
            "Sorry, that page doesn't exist. Head back to Chick Rocks."
          )}
          onChange={(v) => updateDraft("notfound_body", v)}
        />
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/" className="text-primary underline hover:text-primary/90">
            <InlineEdit
              id="notfound_link_home"
              as="span"
              isEditing={isEditing}
              value={getDraftValue("notfound_link_home", "Return to Home")}
              onChange={(v) => updateDraft("notfound_link_home", v)}
            />
          </a>
          <a href="/menu" className="text-primary underline hover:text-primary/90">
            <InlineEdit
              id="notfound_link_menu"
              as="span"
              isEditing={isEditing}
              value={getDraftValue("notfound_link_menu", "View Menu")}
              onChange={(v) => updateDraft("notfound_link_menu", v)}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
