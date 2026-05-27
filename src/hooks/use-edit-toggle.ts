// Editing was WordPress-only. Stubbed out for the Next.js / Vercel deploy.
// Kept around so that anything still importing the hook compiles cleanly.

export function useEditToggle() {
  return {
    isEditing: false,
    isSaving: false,
    isLoggedIn: false,
    currentLanguage: "en",
    content: {} as Record<string, string>,
    draft: {} as Record<string, string>,
    isLoadingPageData: false,
    getDraftValue: (_key: string, defaultValue: string) => defaultValue,
    toggleEditing: () => {},
    updateDraft: (_key: string, _value: string) => {},
    saveContent: async () => {},
    refreshTextContent: async () => {},
  };
}
