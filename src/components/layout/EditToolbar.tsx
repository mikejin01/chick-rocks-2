import { useEdit } from "@/contexts/EditContext";
import { Button } from "@/components/ui/button";
import { Save, X, Edit3, Loader2 } from "lucide-react";

export const EditToolbar = () => {
  const { isEditing, isSaving, isLoggedIn, toggleEditing, saveContent } = useEdit();

  if (!isLoggedIn) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-black/90 backdrop-blur-md border border-white/20 p-2 rounded-2xl shadow-2xl">
      {!isEditing ? (
        <Button
          onClick={toggleEditing}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl px-6 h-12 shadow-lg transition-transform hover:scale-105"
        >
          <Edit3 className="w-5 h-5 mr-2" /> Edit Page
        </Button>
      ) : (
        <>
          <Button
            onClick={toggleEditing}
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-xl px-4 h-12"
            disabled={isSaving}
          >
            <X className="w-5 h-5 mr-2" /> Cancel
          </Button>
          <Button
            onClick={saveContent}
            className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl px-6 h-12 shadow-lg min-w-[120px]"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
};
