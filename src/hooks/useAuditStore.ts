/**
 * Global state management using Zustand
 * Manages audit files, results, and application state
 */

import { create } from "zustand";
import { FileKey, UploadedFile, AuditTaskResult, FileType } from "@/types";

interface AuditState {
  currentFileType: FileType;
  files: Partial<Record<FileKey, UploadedFile | null>>;
  results: Record<string, Partial<Record<FileKey, AuditTaskResult>>>;
  isLoading: boolean;
  error: string | null;
}

interface AuditStoreActions {
  setFileType: (type: FileType) => void;
  setFile: (key: FileKey, file: UploadedFile | null) => void;
  setResult: (task: string, key: FileKey, result: AuditTaskResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetResults: () => void;
  resetFiles: () => void;
}

type AuditStore = AuditState & AuditStoreActions;

export const useAuditStore = create<AuditStore>((set) => ({
  // Initial state
  currentFileType: "docx",
  files: {},
  results: {},
  isLoading: false,
  error: null,

  // Actions
  setFileType: (type: FileType) => set({ currentFileType: type }),

  setFile: (key: FileKey, file: UploadedFile | null) =>
    set((state) => ({
      files: { ...state.files, [key]: file },
    })),

  setResult: (task: string, key: FileKey, result: AuditTaskResult) =>
    set((state) => {
      const currentTaskResults = state.results[task] || {};
      return {
        results: {
          ...state.results,
          [task]: { ...currentTaskResults, [key]: result },
        },
      };
    }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  resetResults: () => set({ results: {} }),

  resetFiles: () => set({ files: {} }),
}));
