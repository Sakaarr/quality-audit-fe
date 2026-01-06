import { create } from "zustand";
import { AuditState, FileKey, FileType, AuditTaskResult, UploadedFile } from "@/types";
import { apiService } from "@/services/api.service";

interface AuditStore extends AuditState {
  setFileType: (type: FileType) => void;
  setFile: (key: FileKey, file: UploadedFile | null) => void;
  setResult: (taskKey: string, fileKey: FileKey, result: AuditTaskResult) => void;
  runTask: (taskKey: string) => Promise<void>;
  generateReport: (key: FileKey, action?: 'view' | 'download') => Promise<void>;
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
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  runTask: async (taskKey) => {
    const { files, currentFileType } = get();
    
    // Add to active tasks
    set(state => ({ activeTasks: [...state.activeTasks, taskKey] }));

    try {
      // HANDLE COMPARISON TASKS
      if (taskKey === "format-comparison") {
         // Format comparison is unique: likely CE1-3 group, then RW.
         // Based on script.js:
         // 1. CE1, CE2, CE3
         // 2. CE1, CE2, RW
         // For now, let's just trigger updates for all rows.
         
         const ceFiles = {
             ce1: files.ce1?.file,
             ce2: files.ce2?.file,
             ce3: files.ce3?.file
         };
         
         // 1. Compare CEs
         if (ceFiles.ce1 && ceFiles.ce2 && ceFiles.ce3) {
             ["ce1", "ce2", "ce3"].forEach(k => 
                 get().setResult(taskKey, k as FileKey, { status: "loading", success: false })
             );
             try {
                 const res = await apiService.runComparisonTask({
                     file_1: ceFiles.ce1,
                     file_2: ceFiles.ce2,
                     file_3: ceFiles.ce3
                 }, taskKey, currentFileType);
                 
                 const success = !!(res?.consistency as any)?.all_match;
                 ["ce1", "ce2", "ce3"].forEach(k => 
                     get().setResult(taskKey, k as FileKey, { status: success ? "pass" : "fail", success, details: res })
                 );
             } catch(err) {
                 ["ce1", "ce2", "ce3"].forEach(k => 
                     get().setResult(taskKey, k as FileKey, { status: "fail", success: false, message: "Error" })
                 );
             }
         }

         // 2. Compare with RW (using CE1, CE2 as reference context if needed, or just RW)
         // script.js sends file_1=CE1, file_2=CE2, file_3=RW to check RW formatting
         if (ceFiles.ce1 && ceFiles.ce2 && files.rw?.file) {
             get().setResult(taskKey, "rw", { status: "loading", success: false });
             try {
                  const res = await apiService.runComparisonTask({
                     file_1: ceFiles.ce1,
                     file_2: ceFiles.ce2,
                     file_3: files.rw.file
                 }, taskKey, currentFileType);
                 
                 const success = !!(res?.consistency as any)?.all_match;
                 get().setResult(taskKey, "rw", { status: success ? "pass" : "fail", success, details: res });
             } catch(err) {
                 get().setResult(taskKey, "rw", { status: "fail", success: false, message: "Error" });
             }
         }

      } else if (taskKey === "title-comparison" || taskKey === "visual-comparison") {
          // Pairwise comparison: CE vs RW
          if (!files.rw?.file) {
              alert("RW file needed for comparison");
              return;
          }
          
          const rwFile = files.rw.file;
          const targetKeys: FileKey[] = ["ce1", "ce2", "ce3"];
          
          const promises = targetKeys.map(async (key) => {
              const ceFile = files[key]?.file;
              if (!ceFile) return;

              get().setResult(taskKey, key, { status: "loading", success: false });
              
              try {
                  const res = await apiService.runComparisonTask({
                      file_1: ceFile,
                      file_2: rwFile
                  }, taskKey, currentFileType);
                  
                  let success = false;
                  if (taskKey === "title-comparison") success = !!res.match;
                  else if (taskKey === "visual-comparison") success = (res.summary as any)?.similarity_score >= 100;

                  get().setResult(taskKey, key, { status: success ? "pass" : "fail", success, details: res });
              } catch(err) {
                  get().setResult(taskKey, key, { status: "fail", success: false, message: "Error" });
              }
          });
          
          await Promise.all(promises);

      } else {
          // STANDARD TASKS
          const entries = Object.entries(files).filter(
            ([, file]) => file !== null && file.file
          ) as [string, UploadedFile][];

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
      }

    } finally {
      // Remove from active tasks
      set(state => ({ activeTasks: state.activeTasks.filter(t => t !== taskKey) }));
    }
  },

  generateReport: async (key: FileKey, action: 'view' | 'download' = 'view') => {
      const { files, currentFileType } = get();
      const file = files[key];
      if (!file || !file.file) return;
      
      set({ isLoading: true });

      try {
          // The API returns HTML string now
          const htmlContent = await apiService.generateReport(file.file, currentFileType);
          
          if (action === 'view') {
             const reportWindow = window.open("", "_blank");
             if (reportWindow) {
                 reportWindow.document.write(htmlContent);
                 reportWindow.document.close();
             } else {
                 alert("Popup blocked. Please allow popups for this site.");
             }
          } else {
              // Download
              const blob = new Blob([htmlContent], { type: 'text/html' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `report-${key}.html`);
              document.body.appendChild(link);
              link.click();
              link.remove();
          }

      } catch (error) {
          console.error("Report generation failed", error);
          alert("Failed to generate report");
      } finally {
        set({ isLoading: false });
      }
  }
}));
