"use client";

import React, { useState } from "react";
import axios from "axios";
import { Header } from "@/components/common/Header";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://quality-audit-api-production.up.railway.app/api/documents";

interface CPDCVResult {
  overall_status: "FULLY_MATCHED" | "PARTIALLY_MATCHED" | "NOT_MATCHED";
  comparison_details: {
    cpd_qualification: {
      degree: string;
      institution?: string;
    };
    matched_cv_qualification?: {
      degree: string;
      institution?: string;
    };
    match_status: "MATCHED" | "NOT_MATCHED";
    confidence_score: number;
  }[];
}

export default function CPDCVPage() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cpdFile, setCpdFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState("Click or drag CV here");
  const [cpdFileName, setCpdFileName] = useState("Click or drag CPD here");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CPDCVResult | null>(null);

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setCvFile(files[0]);
      setCvFileName(files[0].name);
    }
  };

  const handleCpdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setCpdFile(files[0]);
      setCpdFileName(files[0].name);
    }
  };

  const handleCvDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.match(/\.(pdf|docx)$/i)) {
        setCvFile(file);
        setCvFileName(file.name);
      } else {
        alert("CV must be a PDF or DOCX file.");
      }
    }
  };

  const handleCpdDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.match(/\.docx$/i)) {
        setCpdFile(file);
        setCpdFileName(file.name);
      } else {
        alert("CPD must be a DOCX file.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cvFile || !cpdFile) {
      alert("Please upload both CV and CPD files");
      return;
    }

    // File Type Check
    if (!cvFile.name.match(/\.(pdf|docx)$/i)) {
      alert("CV must be a PDF or DOCX file.");
      return;
    }
    if (!cpdFile.name.match(/\.docx$/i)) {
      alert("CPD must be a DOCX file.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("cv_file", cvFile);
      formData.append("cpd_file", cpdFile);

      const response = await axios.post(`${API_BASE_URL}/compare/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        setResult(response.data.comparison);
      } else {
        alert(response.data.message || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Failed to connect to server. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCvFile(null);
    setCpdFile(null);
    setCvFileName("Click or drag CV here");
    setCpdFileName("Click or drag CPD here");
    setResult(null);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header backLink="/" />

      {/* Upload Form */}
      {!result && (
        <div className="upload-section">
          <form id="upload-form" onSubmit={handleVerify}>
            <div className="upload-grid">
              {/* CV Upload */}
              <div className="upload-card">
                <div className="card-status-indicator"></div>
                <label htmlFor="cv_file" className="file-label-overlay"></label>
                <div className="card-content">
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-file-pdf"></i>
                  </div>
                  <h3>User CV</h3>
                  <p className="file-name">{cvFileName}</p>
                </div>
                <input
                  type="file"
                  id="cv_file"
                  name="cv_file"
                  className="file-input"
                  accept=".pdf,.docx"
                  required
                  onChange={handleCvFileChange}
                />
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleCvDrop}
                  style={{ position: 'absolute', inset: 0 }}
                ></div>
              </div>

              {/* CPD Upload */}
              <div className="upload-card">
                <div className="card-status-indicator"></div>
                <label htmlFor="cpd_file" className="file-label-overlay"></label>
                <div className="card-content">
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-file-word"></i>
                  </div>
                  <h3>CPD Document</h3>
                  <p className="file-name">{cpdFileName}</p>
                </div>
                <input
                  type="file"
                  id="cpd_file"
                  name="cpd_file"
                  className="file-input"
                  accept=".docx"
                  required
                  onChange={handleCpdFileChange}
                />
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleCpdDrop}
                  style={{ position: 'absolute', inset: 0 }}
                ></div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button
                type="submit"
                className="run-btn"
                disabled={loading || !cvFile || !cpdFile}
                style={{ padding: '12px 40px', fontSize: '16px' }}
              >
                <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '8px' }}></i>
                {loading ? "Analyzing..." : "Run Verification"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div id="loader" style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Analyzing documents...</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div id="results-container" className="results-section">
          {/* Status Banner */}
          <div
            id="status-banner"
            style={{
              marginBottom: '32px',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              borderLeft: `8px solid ${
                result.overall_status === "FULLY_MATCHED"
                  ? "var(--success)"
                  : result.overall_status === "PARTIALLY_MATCHED"
                  ? "var(--warning)"
                  : "var(--error)"
              }`,
              background: 'white',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Verification Status
              </p>
              <h2
                id="overall-status-text"
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: result.overall_status === "FULLY_MATCHED"
                    ? "var(--success)"
                    : result.overall_status === "PARTIALLY_MATCHED"
                    ? "var(--warning)"
                    : "var(--error)"
                }}
              >
                {result.overall_status === "FULLY_MATCHED"
                  ? "Fully Verified"
                  : result.overall_status === "PARTIALLY_MATCHED"
                  ? "Partially Verified"
                  : "Not Verified"}
              </h2>
            </div>
            <div
              id="status-icon"
              style={{
                fontSize: '48px',
                color: result.overall_status === "FULLY_MATCHED"
                  ? "var(--success)"
                  : result.overall_status === "PARTIALLY_MATCHED"
                  ? "var(--warning)"
                  : "var(--error)"
              }}
            >
              {result.overall_status === "FULLY_MATCHED" ? (
                <i className="fa-solid fa-circle-check"></i>
              ) : result.overall_status === "PARTIALLY_MATCHED" ? (
                <i className="fa-solid fa-triangle-exclamation"></i>
              ) : (
                <i className="fa-solid fa-circle-xmark"></i>
              )}
            </div>
          </div>

          {/* Details Table */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)', color: 'white', padding: '16px 24px', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <i className="fa-solid fa-list-check" style={{ marginRight: '12px' }}></i>
              Verification Details
            </div>
            <div id="comparison-list">
              {result.comparison_details.map((detail, index) => {
                const isMatched = detail.match_status === "MATCHED";

                return (
                  <div 
                    key={index} 
                    style={{ 
                      padding: '24px', 
                      borderBottom: index < result.comparison_details.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', alignItems: 'center' }}>

                      {/* CPD Entry */}
                      <div style={{ background: 'rgba(6, 182, 212, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                          CPD Entry
                        </p>
                        <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                          {detail.cpd_qualification.degree}
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                          {detail.cpd_qualification.institution || "Institution Not Listed"}
                        </p>
                      </div>

                      {/* Match Status */}
                      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span 
                          className="result-cell"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: isMatched ? 'var(--success-bg)' : 'var(--error-bg)',
                            color: isMatched ? 'var(--success)' : 'var(--error)'
                          }}
                        >
                          {isMatched ? (
                            <>
                              <i className="fa-solid fa-check"></i> Matched
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-xmark"></i> Mismatch
                            </>
                          )}
                        </span>
                        <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '12px', fontFamily: 'monospace', background: 'var(--bg-page)', padding: '4px 12px', borderRadius: 'var(--radius-sm)' }}>
                          Confidence: {detail.confidence_score}/5
                        </div>
                      </div>

                      {/* CV Found Data */}
                      <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                          CV Found Data
                        </p>
                        {detail.matched_cv_qualification ? (
                          <>
                            <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                              {detail.matched_cv_qualification.degree}
                            </p>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                              {detail.matched_cv_qualification.institution || ""}
                            </p>
                          </>
                        ) : (
                          <p style={{ color: 'var(--error)', fontStyle: 'italic', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-circle-exclamation"></i> No matching data found
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Button */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button
              onClick={resetForm}
              className="sm-btn"
              style={{ padding: '12px 32px', fontSize: '14px' }}
            >
              Run Another Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

