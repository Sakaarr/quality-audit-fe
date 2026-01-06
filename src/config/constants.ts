/**
 * Application Constants
 * Centralized configuration values
 */

export const APP_NAME = "Quality Audit System";
export const APP_VERSION = "1.0.0";

// File Types
export const SUPPORTED_FILE_TYPES = {
  PDF: "pdf" as const,
  DOCX: "docx" as const,
};

// Document Keys
export const DOCUMENT_KEYS = {
  CE1: "ce1" as const,
  CE2: "ce2" as const,
  CE3: "ce3" as const,
  RW: "rw" as const,
};

export const COMPARISON_SOURCES = {
  OUR: "our" as const,
  CLIENT: "client" as const,
};

// Validation Tasks
export const VALIDATION_TASKS = {
  GRAMMAR: "grammar",
  TITLE_VALIDATION: "title-validation",
  TITLE_COMPARISON: "title-comparison",
  SECTION_VALIDATION: "section-validation",
  FORMAT_COMPARISON: "format-comparison",
  GOOGLE_VALIDATION: "google-validation",
  VISUAL_VALIDATION: "visual-validation",
  VISUAL_COMPARISON: "visual-comparison",
  AI_MATH_VALIDATION: "ai-math-validation",
  REFERENCE_VALIDATION: "reference-validation",
  CODE_VALIDATION: "code-validation",
  ACCESSIBILITY_VALIDATION: "accessibility-validation",
  FIGURE_PLACEMENT: "figure-placement",
  GENERATE_REPORT: "generate-report",
};

// Status values
export const STATUS = {
  PASS: "pass" as const,
  FAIL: "fail" as const,
  LOADING: "loading" as const,
  PENDING: "pending" as const,
};

// Error messages
export const ERROR_MESSAGES = {
  NO_FILE_SELECTED: "Please select a file",
  NO_FILES_UPLOADED: "Please upload at least one file",
  INVALID_FILE_TYPE: "Invalid file type. Please upload a PDF or DOCX file",
  API_ERROR: "API error occurred. Please try again",
  NETWORK_ERROR: "Network error. Please check your connection",
  UNKNOWN_ERROR: "An unknown error occurred",
};

// Success messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: "File uploaded successfully",
  VALIDATION_COMPLETE: "Validation completed",
  REPORT_GENERATED: "Report generated successfully",
};

// Timeout values (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  DEBOUNCE: 300,
};

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  MAX_PDF_SIZE: 50 * 1024 * 1024, // 50 MB
  MAX_DOCX_SIZE: 30 * 1024 * 1024, // 30 MB
};

