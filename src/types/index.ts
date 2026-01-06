/**
 * Type definitions for the Quality Audit Application
 */

export type FileType = "pdf" | "docx";
export type FileKey = "ce1" | "ce2" | "ce3" | "rw" | "our" | "client";

export interface UploadedFile {
  name: string;
  size: number;
  type: FileType;
  file?: File;
}

export interface AuditTaskResult {
  success: boolean;
  status: "pass" | "fail" | "loading" | "pending";
  message?: string;
  details?: Record<string, unknown>;
}

export interface ValidationTask {
  id: string;
  name: string;
  description: string;
  icon: string;
  taskKey: string;
}

export interface AuditState {
  currentFileType: FileType;
  files: Partial<Record<FileKey, UploadedFile | null>>;
  results: Partial<Record<string, Record<FileKey, AuditTaskResult>>>;
  isLoading: boolean;
  error: string | null;
}

export interface ComparisonResult {
  title?: { our: string; client: string; match: boolean };
  visual?: { similarity: number };
  format?: { match: boolean };
  [key: string]: unknown;
}

export interface CPDCVAuditResult {
  status: "pass" | "fail";
  summary: string;
  details: {
    category: string;
    cv_entry: string;
    cpd_entry: string;
    status: "verified" | "not_found" | "mismatch";
  }[];
  overall_status: "verified" | "partial" | "not_verified";
}

export interface Task {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

