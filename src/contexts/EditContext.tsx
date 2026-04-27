import React, { createContext, useContext, ReactNode } from "react";
import { useEditToggle } from "@/hooks/use-edit-toggle";

interface EditContextType {
  isEditing: boolean;
  isSaving: boolean;
  isLoggedIn: boolean;
  currentLanguage: string;
  content: Record<string, string>;
  draft: Record<string, string>;
  isLoadingPageData: boolean;
  getDraftValue: (key: string, defaultValue: string) => string;
  toggleEditing: () => void;
  updateDraft: (key: string, value: string) => void;
  saveContent: () => Promise<void>;
  refreshTextContent: () => Promise<void>;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

export const EditProvider = ({ children }: { children: ReactNode }) => {
  const edit = useEditToggle();
  return <EditContext.Provider value={edit}>{children}</EditContext.Provider>;
};

export const useEdit = () => {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error("useEdit must be used within an EditProvider");
  return ctx;
};
