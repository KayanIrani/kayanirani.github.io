import { create } from "zustand";

export const useBookStore = create((set) => ({
  page: 0,
  setPage: (page) => set({ page }),
}));