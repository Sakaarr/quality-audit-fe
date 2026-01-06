/**
 * API Configuration
 * Centralized API endpoint management
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://quality-audit-api-production.up.railway.app/api/documents";

export const API_ENDPOINTS = {
  // Grammar Check
  grammar: {
    pdf: "/pdf/grammar-check/",
    docx: "/docx/grammar-check/",
  },

  // Title Validation
  titleValidation: {
    pdf: "/title/validate/",
    docx: "/title/validate/",
  },

  // Section Validation
  sectionValidation: {
    pdf: "/section/validate/",
    docx: "/section/validate/",
  },

  // Format Comparison
  formatComparison: {
    pdf: "/format/compare/",
    docx: "/format/compare/",
  },

  // Google Validation
  googleValidation: {
    pdf: "/validate-google-search/",
    docx: "/validate-google-search/",
  },

  // Visual Validation
  visualValidation: {
    pdf: "/visuals/validate/",
    docx: "/visuals/validate/",
  },

  // Visual Comparison
  visualComparison: {
    pdf: "/visual/compare/",
    docx: "/visual/compare/",
  },

  // AI Math Validation
  aiMathValidation: {
    pdf: "/validate-math-gemini/",
    docx: "/validate-math-gemini/",
  },

  // Reference Validation
  referenceValidation: {
    pdf: "/reference/validate/",
    docx: "/reference/validate/",
  },

  // Code Validation
  codeValidation: {
    pdf: "/validate-code/",
    docx: "/validate-code/",
  },

  // Accessibility Validation
  accessibilityValidation: {
    pdf: "/accessibility/validate/",
    docx: "/accessibility/validate/",
  },

  // Figure Placement
  figurePlacement: {
    pdf: "/figure-placement/validate/",
    docx: "/figure-placement/validate/",
  },

  // Table Placement
  tablePlacement: {
    pdf: "/table-placement/validate/",
    docx: "/table-placement/validate/",
  },

  // Title Comparison
  titleComparison: {
    pdf: "/title/compare/",
    docx: "/title/compare/",
  },

  // Word Count Validation
  wordCountValidation: {
    pdf: "/word-count/validate/",
    docx: "/word-count/validate/",
  },

  // Generate Report
  generateReport: {
    pdf: "/report/generate/",
    docx: "/report/generate/",
  },
};

export default API_BASE_URL;

