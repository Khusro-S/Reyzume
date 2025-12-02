import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface TitleStore {
  editingTitleId: Id<"reyzumes"> | null;
  editingTitleValue: string;

  setEditing: (reyzumeId: Id<"reyzumes">, value: string) => void;
  updateValue: (value: string) => void;
  clearEditing: () => void;
}

export const useTitle = create<TitleStore>((set) => ({
  editingTitleId: null,
  editingTitleValue: "",

  setEditing: (reyzumeId, value) =>
    set({ editingTitleId: reyzumeId, editingTitleValue: value }),

  updateValue: (value) => set({ editingTitleValue: value }),

  clearEditing: () => set({ editingTitleId: null, editingTitleValue: "" }),
}));
