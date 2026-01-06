import { create } from "zustand";
import { AuditState, FileKey, FileType, AuditTaskResult, UploadedFile } from "@/types";
import { apiService } from "@/services/api.service";

interface AuditStore extends AuditState {
  setFileType: (type: FileType) => void;
  setFile: (key: FileKey, file: UploadedFile | null) => void;
  setResult: (taskKey: string, fileKey: FileKey, result: AuditTaskResult) => void;
  runTask: (taskKey: string) => Promise<void>;
  generateReport: (key: FileKey) => Promise<void>;
  resetResults: () => void;
  setError: (error: string | null) => void;
  
  // New state
  activeTasks: string[];
}

const initialState: AuditState = {
  currentFileType: "pdf",
  files: {
    ce1: null,
    ce2: null,
    ce3: null,
    rw: null,
  },
  results: {},
  isLoading: false, // Deprecated, kept for interface compat if needed, but unused logic-wise
  error: null,
};

export const useAuditStore = create<AuditStore>((set, get) => ({
  ...initialState,
  activeTasks: [],

  setFileType: (type) => set({ currentFileType: type, results: {} }),

  setFile: (key, file) =>
    set((state) => ({
      files: { ...state.files, [key]: file },
    })),

  setResult: (taskKey, fileKey, result) =>
    set((state) => {
      const currentResults = state.results || {};
      const taskResults = currentResults[taskKey] || {};
      return {
        results: {
          ...currentResults,
          [taskKey]: {
            ...taskResults,
            [fileKey]: result,
          },
        } as Partial<Record<string, Record<FileKey, AuditTaskResult>>>,
      };
    }),

  resetResults: () => set({ results: {} }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  runTask: async (taskKey) => {
    const { files, currentFileType } = get();
    
    // Add to active tasks
    set(state => ({ activeTasks: [...state.activeTasks, taskKey] }));

    const entries = Object.entries(files).filter(
      ([, file]) => file !== null && file.file
    ) as [string, UploadedFile][];

    try {
      const promises = entries.map(async ([key, uploadedFile]) => {
          if (!uploadedFile.file) return;
          
          get().setResult(taskKey, key as FileKey, { status: "loading", success: false });

          try {
              const res = await apiService.runValidationTask(uploadedFile.file, taskKey, currentFileType);
              const success = !!res && (res.status === 'pass' || res.is_valid === true || res.success === true); 
              
              get().setResult(taskKey, key as FileKey, { 
                  status: success ? "pass" : "fail", 
                  success,
                  details: res as Record<string, unknown>
              });
          } catch (error) {
              get().setResult(taskKey, key as FileKey, { 
                  status: "fail", 
                  success: false,
                  message: error instanceof Error ? error.message : "Error"
              });
          }
      });

      await Promise.all(promises);

    } finally {
      // Remove from active tasks
      set(state => ({ activeTasks: state.activeTasks.filter(t => t !== taskKey) }));
    }
  },

  generateReport: async (key: FileKey) => {
      // Keep existing logic
      const { files, currentFileType } = get();
      const file = files[key];
      if (!file || !file.file) return;
      
      // Could track global loading for report if desired, or per-file
      set({ isLoading: true });

      try {
          const blob = await apiService.generateReport(file.file, currentFileType);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `report-${key}.${currentFileType === 'pdf' ? 'pdf' : 'docx'}`);
          document.body.appendChild(link);
          link.click();
          link.remove();
      } catch (error) {
          console.error("Report generation failed", error);
      } finally {
        set({ isLoading: false });
      }
  }
}));
