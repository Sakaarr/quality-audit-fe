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
    pdf: "/pdf/format-compare/",
    docx: "/docx/format-compare/",
  },

  // Google Validation
  googleValidation: {
    pdf: "/pdf/google-validate/",
    docx: "/docx/google-validate/",
  },

  // Visual Validation
  visualValidation: {
    pdf: "/pdf/visual-validate/",
    docx: "/docx/visual-validate/",
  },

  // Visual Comparison
  visualComparison: {
    pdf: "/pdf/visual-compare/",
    docx: "/docx/visual-compare/",
  },

  // AI Math Validation
  aiMathValidation: {
    pdf: "/pdf/ai-math-validate/",
    docx: "/docx/ai-math-validate/",
  },

  // Reference Validation
  referenceValidation: {
    pdf: "/pdf/reference-validate/",
    docx: "/docx/reference-validate/",
  },

  // Code Validation
  codeValidation: {
    pdf: "/pdf/code-validate/",
    docx: "/docx/code-validate/",
  },

  // Accessibility Validation
  accessibilityValidation: {
    pdf: "/pdf/accessibility-validate/",
    docx: "/docx/accessibility-validate/",
  },

  // Figure Placement
  figurePlacement: {
    pdf: "/pdf/figure-placement/",
    docx: "/docx/figure-placement/",
  },

  // Title Comparison
  titleComparison: {
    pdf: "/pdf/title-compare/",
    docx: "/docx/title-compare/",
  },

  // Generate Report
  generateReport: {
    pdf: "/pdf/generate-report/",
    docx: "/docx/generate-report/",
  },
};

export default API_BASE_URL;

