import { createContext, useContext, type ReactNode } from "react";

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

const noop = () => {};
const asyncNoop = async () => {};

const stubValue: EditContextType = {
  isEditing: false,
  isSaving: false,
  isLoggedIn: false,
  currentLanguage: "en",
  content: {},
  draft: {},
  isLoadingPageData: false,
  getDraftValue: (_key, defaultValue) => defaultValue,
  toggleEditing: noop,
  updateDraft: noop,
  saveContent: asyncNoop,
  refreshTextContent: asyncNoop,
};

const EditContext = createContext<EditContextType>(stubValue);

export const EditProvider = ({ children }: { children: ReactNode }) => (
  <EditContext.Provider value={stubValue}>{children}</EditContext.Provider>
);

export const useEdit = () => useContext(EditContext);
