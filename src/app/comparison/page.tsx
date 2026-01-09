"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import { FileTypeToggle } from "@/components/common/FileTypeToggle";
import { FileType, UploadedFile } from "@/types";
import { apiService } from "@/services/api.service";
import clsx from "clsx";

interface ValidationCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const VALIDATION_CARDS: ValidationCard[] = [
  {
    id: "grammar",
    title: "Grammar Check",
    description: "Spelling & syntax validation",
    icon: "✏️",
  },
  {
    id: "title-validation",
    title: "Title Validation",
    description: "Title format & presence",
    icon: "✓",
  },
  {
    id: "section-validation",
    title: "Section Validation",
    description: "Required sections check",
    icon: "📑",
  },
  {
    id: "reference-validation",
    title: "Reference Validation",
    description: "Citations & links check",
    icon: "🔗",
  },
  {
    id: "visual-validation",
    title: "Visual Validation",
    description: "Images & tables check",
    icon: "👁️",
  },
  {
    id: "ai-math-validation",
    title: "AI Math Validation",
    description: "Calculation verification",
    icon: "🧮",
  },
  {
    id: "code-validation",
    title: "Code Validation",
    description: "Code snippets check",
    icon: "💻",
  },
  {
    id: "accessibility-validation",
    title: "Accessibility",
    description: "A11y compliance check",
    icon: "♿",
  },
  {
    id: "google-validation",
    title: "Google Validation",
    description: "Search confidence check",
    icon: "🔍",
  },
  {
    id: "generate-report",
    title: "Generate Report",
    description: "Full audit report",
    icon: "📄",
  },
];

const COMPARISON_CARDS = [
  {
    id: "title",
    title: "Title Comparison",
    description: "Compare titles between sources",
    icon: "↔️",
  },
  {
    id: "visual",
    title: "Visual Comparison",
    description: "Compare image content",
    icon: "🖼️",
  },
  {
    id: "format",
    title: "Format Comparison",
    description: "Compare document formatting",
    icon: "🔧",
  },
];

export default function ComparisonPage() {
  const [fileType, setFileType] = useState<FileType>("pdf");
  const [ourFile, setOurFile] = useState<UploadedFile | null>(null);
  const [clientFile, setClientFile] = useState<UploadedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<
    Record<string, Record<string, any>>
  >({});
  const [comparisonResults, setComparisonResults] = useState<
    Record<string, any>
  >({});

  const handleValidationRun = async (
    taskId: string,
    source: "our" | "client"
  ) => {
    try {
      setLoading(true);
      setError(null);

      const file = source === "our" ? ourFile : clientFile;
      if (!file?.file) {
        setError(`Please upload a file for ${source} source`);
        setLoading(false);
        return;
      }

      const result = await apiService.runValidationTask(
        file.file,
        taskId,
        fileType
      );

      setValidationResults((prev) => ({
        ...prev,
        [taskId]: { ...prev[taskId], [source]: result },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleComparisonRun = async (comparisonId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!ourFile?.file || !clientFile?.file) {
        setError("Please upload files for both sources");
        setLoading(false);
        return;
      }

      const taskMap: Record<string, string> = {
        title: "title-comparison",
        visual: "visual-comparison",
        format: "format-comparison",
      };

      const result = await Promise.all([
        apiService.runValidationTask(ourFile.file, taskMap[comparisonId], fileType),
        apiService.runValidationTask(clientFile.file, taskMap[comparisonId], fileType),
      ]);

      setComparisonResults((prev) => ({
        ...prev,
        [comparisonId]: { our: result[0], client: result[1] },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Grain Overlay */}
      <div className="grain-overlay"></div>

      <Header backLink="/" />

      <main className="main-container">
        {/* Hero Section */}
        <header className="hero">
          <div className="hero-badge">
            <i className="ph ph-files"></i>
            Document Comparison Tool
          </div>
          <h1>Compare Source Files</h1>
          <p>
            Upload documents from both sides and run individual validations on
            each file
          </p>
        </header>

        {/* File Type Selector */}
        <div className="file-type-selector">
          <button className={clsx("type-btn", fileType === "pdf" && "active")} onClick={() => setFileType("pdf")}>
            <i className="ph ph-file-pdf"></i>
            PDF
          </button>
          <button className={clsx("type-btn", fileType === "docx" && "active")} onClick={() => setFileType("docx")}>
            <i className="ph ph-file-doc"></i>
            DOCX
          </button>
        </div>

        {/* Upload Zone */}
        <section className="upload-zone">
          {/* Our Side */}
          <div className="upload-panel our-side" data-source="our">
            <div className="panel-header">
              <div className="panel-icon">
                <i className="ph ph-buildings"></i>
              </div>
              <div className="panel-info">
                <h2>Our Source</h2>
                <p>Internal document version</p>
              </div>
            </div>

            <div className="drop-area" id="ourDropArea">
              <input
                type="file"
                id="ourFile"
                accept={fileType === "pdf" ? ".pdf" : ".docx"}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setOurFile({
                      name: files[0].name,
                      size: files[0].size,
                      type: fileType,
                      file: files[0],
                    });
                  }
                }}
              />
              <label htmlFor="ourFile" className="drop-label">
                <div className="drop-icon">
                  <i className="ph ph-cloud-arrow-up"></i>
                </div>
                <span className="drop-text">Drop file or click to browse</span>
                <span className="file-name" id="ourFileName">
                  {ourFile ? ourFile.name : "No file selected"}
                </span>
              </label>
            </div>

            <div className="file-status" id="ourFileStatus"></div>
          </div>

          {/* Divider */}
          <div className="upload-divider">
            <div className="divider-line"></div>
            <div className="divider-icon">
              <i className="ph ph-arrows-horizontal"></i>
            </div>
            <div className="divider-line"></div>
          </div>

          {/* Client Side */}
          <div className="upload-panel client-side" data-source="client">
            <div className="panel-header">
              <div className="panel-icon">
                <i className="ph ph-user-circle"></i>
              </div>
              <div className="panel-info">
                <h2>Client Source</h2>
                <p>Client provided document</p>
              </div>
            </div>

            <div className="drop-area" id="clientDropArea">
              <input
                type="file"
                id="clientFile"
                accept={fileType === "pdf" ? ".pdf" : ".docx"}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setClientFile({
                      name: files[0].name,
                      size: files[0].size,
                      type: fileType,
                      file: files[0],
                    });
                  }
                }}
              />
              <label htmlFor="clientFile" className="drop-label">
                <div className="drop-icon">
                  <i className="ph ph-cloud-arrow-up"></i>
                </div>
                <span className="drop-text">Drop file or click to browse</span>
                <span className="file-name" id="clientFileName">
                  {clientFile ? clientFile.name : "No file selected"}
                </span>
              </label>
            </div>

            <div className="file-status" id="clientFileStatus"></div>
          </div>
        </section>

        {/* Validation Grid */}
        <section className="validation-section" id="validationSection">
          <div className="section-title">
            <h2><i className="ph ph-check-square"></i> Validation Tasks</h2>
            <p>Run individual checks on each source file</p>
          </div>

          <div className="validation-grid">
            {/* Grammar Check */}
            <div className="validation-card" data-task="grammar">
              <div className="card-header">
                <div className="card-icon grammar">
                  <i className="ph ph-text-aa"></i>
                </div>
                <div className="card-title">
                  <h3>Grammar Check</h3>
                  <span>Spelling & syntax validation</span>
                </div>
              </div>
              <div className="card-results">
                <div className="result-row">
                  <span className="source-label our">Our</span>
                  <div className="result-value" id="grammar-our">
                    {validationResults["grammar"]?.our ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="grammar"
                    data-source="our"
                    title="Run on Our Source"
                    onClick={() => handleValidationRun("grammar", "our")}
                    disabled={loading || !ourFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
                <div className="result-row">
                  <span className="source-label client">Client</span>
                  <div className="result-value" id="grammar-client">
                    {validationResults["grammar"]?.client ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="grammar"
                    data-source="client"
                    title="Run on Client Source"
                    onClick={() => handleValidationRun("grammar", "client")}
                    disabled={loading || !clientFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
              </div>
              <button
                className="run-both-btn"
                data-task="grammar"
                onClick={() => {
                  handleValidationRun("grammar", "our");
                  handleValidationRun("grammar", "client");
                }}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play-circle"></i> Run Both
              </button>
            </div>

            {/* Title Validation */}
            <div className="validation-card" data-task="title-validation">
              <div className="card-header">
                <div className="card-icon title">
                  <i className="ph ph-check-circle"></i>
                </div>
                <div className="card-title">
                  <h3>Title Validation</h3>
                  <span>Title format & presence</span>
                </div>
              </div>
              <div className="card-results">
                <div className="result-row">
                  <span className="source-label our">Our</span>
                  <div className="result-value" id="title-validation-our">
                    {validationResults["title-validation"]?.our ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="title-validation"
                    data-source="our"
                    title="Run on Our Source"
                    onClick={() => handleValidationRun("title-validation", "our")}
                    disabled={loading || !ourFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
                <div className="result-row">
                  <span className="source-label client">Client</span>
                  <div className="result-value" id="title-validation-client">
                    {validationResults["title-validation"]?.client ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="title-validation"
                    data-source="client"
                    title="Run on Client Source"
                    onClick={() => handleValidationRun("title-validation", "client")}
                    disabled={loading || !clientFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
              </div>
              <button
                className="run-both-btn"
                data-task="title-validation"
                onClick={() => {
                  handleValidationRun("title-validation", "our");
                  handleValidationRun("title-validation", "client");
                }}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play-circle"></i> Run Both
              </button>
            </div>

            {/* Section Validation */}
            <div className="validation-card" data-task="section-validation">
              <div className="card-header">
                <div className="card-icon section">
                  <i className="ph ph-list-checks"></i>
                </div>
                <div className="card-title">
                  <h3>Section Validation</h3>
                  <span>Required sections check</span>
                </div>
              </div>
              <div className="card-results">
                <div className="result-row">
                  <span className="source-label our">Our</span>
                  <div className="result-value" id="section-validation-our">
                    {validationResults["section-validation"]?.our ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="section-validation"
                    data-source="our"
                    title="Run on Our Source"
                    onClick={() => handleValidationRun("section-validation", "our")}
                    disabled={loading || !ourFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
                <div className="result-row">
                  <span className="source-label client">Client</span>
                  <div className="result-value" id="section-validation-client">
                    {validationResults["section-validation"]?.client ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="section-validation"
                    data-source="client"
                    title="Run on Client Source"
                    onClick={() => handleValidationRun("section-validation", "client")}
                    disabled={loading || !clientFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
              </div>
              <button
                className="run-both-btn"
                data-task="section-validation"
                onClick={() => {
                  handleValidationRun("section-validation", "our");
                  handleValidationRun("section-validation", "client");
                }}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play-circle"></i> Run Both
              </button>
            </div>

            {/* Reference Validation */}
            <div className="validation-card" data-task="reference-validation">
              <div className="card-header">
                <div className="card-icon reference">
                  <i className="ph ph-link"></i>
                </div>
                <div className="card-title">
                  <h3>Reference Validation</h3>
                  <span>Citations & links check</span>
                </div>
              </div>
              <div className="card-results">
                <div className="result-row">
                  <span className="source-label our">Our</span>
                  <div className="result-value" id="reference-validation-our">
                    {validationResults["reference-validation"]?.our ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="reference-validation"
                    data-source="our"
                    title="Run on Our Source"
                    onClick={() => handleValidationRun("reference-validation", "our")}
                    disabled={loading || !ourFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
                <div className="result-row">
                  <span className="source-label client">Client</span>
                  <div className="result-value" id="reference-validation-client">
                    {validationResults["reference-validation"]?.client ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="reference-validation"
                    data-source="client"
                    title="Run on Client Source"
                    onClick={() => handleValidationRun("reference-validation", "client")}
                    disabled={loading || !clientFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
              </div>
              <button
                className="run-both-btn"
                data-task="reference-validation"
                onClick={() => {
                  handleValidationRun("reference-validation", "our");
                  handleValidationRun("reference-validation", "client");
                }}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play-circle"></i> Run Both
              </button>
            </div>

            {/* Visual Validation */}
            <div className="validation-card" data-task="visual-validation">
              <div className="card-header">
                <div className="card-icon visual">
                  <i className="ph ph-image"></i>
                </div>
                <div className="card-title">
                  <h3>Visual Validation</h3>
                  <span>Images & tables check</span>
                </div>
              </div>
              <div className="card-results">
                <div className="result-row">
                  <span className="source-label our">Our</span>
                  <div className="result-value" id="visual-validation-our">
                    {validationResults["visual-validation"]?.our ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="visual-validation"
                    data-source="our"
                    title="Run on Our Source"
                    onClick={() => handleValidationRun("visual-validation", "our")}
                    disabled={loading || !ourFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
                <div className="result-row">
                  <span className="source-label client">Client</span>
                  <div className="result-value" id="visual-validation-client">
                    {validationResults["visual-validation"]?.client ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="visual-validation"
                    data-source="client"
                    title="Run on Client Source"
                    onClick={() => handleValidationRun("visual-validation", "client")}
                    disabled={loading || !clientFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
              </div>
              <button
                className="run-both-btn"
                data-task="visual-validation"
                onClick={() => {
                  handleValidationRun("visual-validation", "our");
                  handleValidationRun("visual-validation", "client");
                }}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play-circle"></i> Run Both
              </button>
            </div>

            {/* AI Math Validation */}
            <div className="validation-card" data-task="ai-math-validation">
              <div className="card-header">
                <div className="card-icon math">
                  <i className="ph ph-calculator"></i>
                </div>
                <div className="card-title">
                  <h3>AI Math Validation</h3>
                  <span>Calculation verification</span>
                </div>
              </div>
              <div className="card-results">
                <div className="result-row">
                  <span className="source-label our">Our</span>
                  <div className="result-value" id="ai-math-validation-our">
                    {validationResults["ai-math-validation"]?.our ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="ai-math-validation"
                    data-source="our"
                    title="Run on Our Source"
                    onClick={() => handleValidationRun("ai-math-validation", "our")}
                    disabled={loading || !ourFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
                <div className="result-row">
                  <span className="source-label client">Client</span>
                  <div className="result-value" id="ai-math-validation-client">
                    {validationResults["ai-math-validation"]?.client ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="ai-math-validation"
                    data-source="client"
                    title="Run on Client Source"
                    onClick={() => handleValidationRun("ai-math-validation", "client")}
                    disabled={loading || !clientFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
              </div>
              <button
                className="run-both-btn"
                data-task="ai-math-validation"
                onClick={() => {
                  handleValidationRun("ai-math-validation", "our");
                  handleValidationRun("ai-math-validation", "client");
                }}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play-circle"></i> Run Both
              </button>
            </div>

            {/* Code Validation */}
            <div className="validation-card" data-task="code-validation">
              <div className="card-header">
                <div className="card-icon code">
                  <i className="ph ph-code"></i>
                </div>
                <div className="card-title">
                  <h3>Code Validation</h3>
                  <span>Code snippets check</span>
                </div>
              </div>
              <div className="card-results">
                <div className="result-row">
                  <span className="source-label our">Our</span>
                  <div className="result-value" id="code-validation-our">
                    {validationResults["code-validation"]?.our ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="code-validation"
                    data-source="our"
                    title="Run on Our Source"
                    onClick={() => handleValidationRun("code-validation", "our")}
                    disabled={loading || !ourFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
                <div className="result-row">
                  <span className="source-label client">Client</span>
                  <div className="result-value" id="code-validation-client">
                    {validationResults["code-validation"]?.client ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="code-validation"
                    data-source="client"
                    title="Run on Client Source"
                    onClick={() => handleValidationRun("code-validation", "client")}
                    disabled={loading || !clientFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
              </div>
              <button
                className="run-both-btn"
                data-task="code-validation"
                onClick={() => {
                  handleValidationRun("code-validation", "our");
                  handleValidationRun("code-validation", "client");
                }}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play-circle"></i> Run Both
              </button>
            </div>

            {/* Accessibility Validation */}
            <div className="validation-card" data-task="accessibility-validation">
              <div className="card-header">
                <div className="card-icon accessibility">
                  <i className="ph ph-wheelchair"></i>
                </div>
                <div className="card-title">
                  <h3>Accessibility</h3>
                  <span>A11y compliance check</span>
                </div>
              </div>
              <div className="card-results">
                <div className="result-row">
                  <span className="source-label our">Our</span>
                  <div className="result-value" id="accessibility-validation-our">
                    {validationResults["accessibility-validation"]?.our ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="accessibility-validation"
                    data-source="our"
                    title="Run on Our Source"
                    onClick={() => handleValidationRun("accessibility-validation", "our")}
                    disabled={loading || !ourFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
                <div className="result-row">
                  <span className="source-label client">Client</span>
                  <div className="result-value" id="accessibility-validation-client">
                    {validationResults["accessibility-validation"]?.client ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="accessibility-validation"
                    data-source="client"
                    title="Run on Client Source"
                    onClick={() => handleValidationRun("accessibility-validation", "client")}
                    disabled={loading || !clientFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
              </div>
              <button
                className="run-both-btn"
                data-task="accessibility-validation"
                onClick={() => {
                  handleValidationRun("accessibility-validation", "our");
                  handleValidationRun("accessibility-validation", "client");
                }}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play-circle"></i> Run Both
              </button>
            </div>

            {/* Google Validation */}
            <div className="validation-card" data-task="google-validation">
              <div className="card-header">
                <div className="card-icon google">
                  <i className="ph ph-magnifying-glass"></i>
                </div>
                <div className="card-title">
                  <h3>Google Validation</h3>
                  <span>Search confidence check</span>
                </div>
              </div>
              <div className="card-results">
                <div className="result-row">
                  <span className="source-label our">Our</span>
                  <div className="result-value" id="google-validation-our">
                    {validationResults["google-validation"]?.our ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="google-validation"
                    data-source="our"
                    title="Run on Our Source"
                    onClick={() => handleValidationRun("google-validation", "our")}
                    disabled={loading || !ourFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
                <div className="result-row">
                  <span className="source-label client">Client</span>
                  <div className="result-value" id="google-validation-client">
                    {validationResults["google-validation"]?.client ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="google-validation"
                    data-source="client"
                    title="Run on Client Source"
                    onClick={() => handleValidationRun("google-validation", "client")}
                    disabled={loading || !clientFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
              </div>
              <button
                className="run-both-btn"
                data-task="google-validation"
                onClick={() => {
                  handleValidationRun("google-validation", "our");
                  handleValidationRun("google-validation", "client");
                }}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play-circle"></i> Run Both
              </button>
            </div>

            {/* Generate Report */}
            <div className="validation-card" data-task="generate-report">
              <div className="card-header">
                <div className="card-icon report">
                  <i className="ph ph-file-text"></i>
                </div>
                <div className="card-title">
                  <h3>Generate Report</h3>
                  <span>Full audit report</span>
                </div>
              </div>
              <div className="card-results">
                <div className="result-row">
                  <span className="source-label our">Our</span>
                  <div className="result-value" id="generate-report-our">
                    {validationResults["generate-report"]?.our ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="generate-report"
                    data-source="our"
                    title="Run on Our Source"
                    onClick={() => handleValidationRun("generate-report", "our")}
                    disabled={loading || !ourFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
                <div className="result-row">
                  <span className="source-label client">Client</span>
                  <div className="result-value" id="generate-report-client">
                    {validationResults["generate-report"]?.client ? "✓" : "—"}
                  </div>
                  <button
                    className="run-single-btn"
                    data-task="generate-report"
                    data-source="client"
                    title="Run on Client Source"
                    onClick={() => handleValidationRun("generate-report", "client")}
                    disabled={loading || !clientFile}
                  >
                    <i className="ph ph-play"></i>
                  </button>
                </div>
              </div>
              <button
                className="run-both-btn"
                data-task="generate-report"
                onClick={() => {
                  handleValidationRun("generate-report", "our");
                  handleValidationRun("generate-report", "client");
                }}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play-circle"></i> Run Both
              </button>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="comparison-section" id="comparisonSection">
          <div className="section-title">
            <h2><i className="ph ph-arrows-left-right"></i> Cross-File Comparison</h2>
            <p>Compare attributes between both source files</p>
          </div>

          <div className="comparison-cards">
            {/* Title Comparison */}
            <div className="comparison-card">
              <div className="comp-icon">
                <i className="ph ph-arrows-left-right"></i>
              </div>
              <div className="comp-info">
                <h3>Title Comparison</h3>
                <p>Compare titles between sources</p>
              </div>
              <div className="comp-result" id="title-comparison-result">
                {comparisonResults.title ? "✓" : "—"}
              </div>
              <button
                className="comp-run-btn"
                data-comparison="title"
                onClick={() => handleComparisonRun("title")}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play"></i> Compare
              </button>
            </div>

            {/* Visual Comparison */}
            <div className="comparison-card">
              <div className="comp-icon">
                <i className="ph ph-images"></i>
              </div>
              <div className="comp-info">
                <h3>Visual Comparison</h3>
                <p>Compare image content</p>
              </div>
              <div className="comp-result" id="visual-comparison-result">
                {comparisonResults.visual ? "✓" : "—"}
              </div>
              <button
                className="comp-run-btn"
                data-comparison="visual"
                onClick={() => handleComparisonRun("visual")}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play"></i> Compare
              </button>
            </div>

            {/* Format Comparison */}
            <div className="comparison-card">
              <div className="comp-icon">
                <i className="ph ph-file-code"></i>
              </div>
              <div className="comp-info">
                <h3>Format Comparison</h3>
                <p>Compare document formatting</p>
              </div>
              <div className="comp-result" id="format-comparison-result">
                {comparisonResults.format ? "✓" : "—"}
              </div>
              <button
                className="comp-run-btn"
                data-comparison="format"
                onClick={() => handleComparisonRun("format")}
                disabled={loading || !ourFile || !clientFile}
              >
                <i className="ph ph-play"></i> Compare
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Quality Audit System — Source Comparison Module</p>
      </footer>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-modal">
            <div className="spinner"></div>
            <h3>Processing...</h3>
            <p>Please wait while we analyze your documents.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-toast">
          <div className="error-content">
            <i className="ph ph-warning"></i>
            <span>{error}</span>
          </div>
        </div>
      )}
    </>
  );
}

