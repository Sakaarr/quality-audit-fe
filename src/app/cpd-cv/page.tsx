"use client";

import React, { useState } from "react";
import axios from "axios";

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
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Academic Qualification Auditor
          </h1>
          <p className="text-gray-600">
            Upload documents to verify CPD against CV records
          </p>
        </header>

        {/* Upload Form */}
        {!result && (
          <div className="bg-white p-8 rounded-xl shadow-sm mb-8 border border-gray-100">
            <form id="upload-form" className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleVerify}>
              {/* CV Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                  User CV (PDF / DOCX)
                </label>
                <div
                  className="relative border-2 border-dashed rounded-lg p-6 bg-gray-50 text-center hover:bg-gray-100 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleCvDrop}
                >
                  <input
                    type="file"
                    id="cv_file"
                    name="cv_file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.docx"
                    required
                    onChange={handleCvFileChange}
                  />
                  <i className="fa-solid fa-file-pdf text-3xl text-gray-400 mb-2"></i>
                  <p id="cv-name" className="text-sm text-gray-500">
                    {cvFileName}
                  </p>
                </div>
              </div>

              {/* CPD Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                  CPD Document (DOCX)
                </label>
                <div
                  className="relative border-2 border-dashed rounded-lg p-6 bg-gray-50 text-center hover:bg-gray-100 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleCpdDrop}
                >
                  <input
                    type="file"
                    id="cpd_file"
                    name="cpd_file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".docx"
                    required
                    onChange={handleCpdFileChange}
                  />
                  <i className="fa-solid fa-file-word text-3xl text-gray-400 mb-2"></i>
                  <p id="cpd-name" className="text-sm text-gray-500">
                    {cpdFileName}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 text-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !cvFile || !cpdFile}
                >
                  <i className="fa-solid fa-magnifying-glass mr-2"></i>
                  {loading ? "Analyzing..." : "Run Verification"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div id="loader" className="text-center py-10">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Analyzing documents...</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div id="results-container">
            {/* Status Banner */}
            <div
              id="status-banner"
              className="mb-6 p-6 rounded-xl border-l-8 bg-white shadow flex justify-between items-center transition-all"
            >
              <div>
                <p className="text-xs uppercase font-bold text-gray-500">
                  Verification Status
                </p>
                <h2
                  id="overall-status-text"
                  className={`text-3xl font-black uppercase ${
                    result.overall_status === "FULLY_MATCHED"
                      ? "text-green-600"
                      : result.overall_status === "PARTIALLY_MATCHED"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
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
                className={`text-4xl ${
                  result.overall_status === "FULLY_MATCHED"
                    ? "text-green-600"
                    : result.overall_status === "PARTIALLY_MATCHED"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
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
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="bg-gray-800 text-white p-4 font-bold flex items-center">
                <i className="fa-solid fa-list-check mr-2"></i>
                Verification Details
              </div>
              <div id="comparison-list" className="divide-y divide-gray-200">
                {result.comparison_details.map((detail, index) => {
                  const isMatched = detail.match_status === "MATCHED";

                  return (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

                        {/* CPD Entry */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                            CPD Entry
                          </p>
                          <p className="font-bold text-gray-800">
                            {detail.cpd_qualification.degree}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {detail.cpd_qualification.institution || "Institution Not Listed"}
                          </p>
                        </div>

                        {/* Match Status */}
                        <div className="text-center flex flex-col items-center justify-center">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            isMatched
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
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
                          <div className="text-[10px] text-gray-400 mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                            Confidence: {detail.confidence_score}/5
                          </div>
                        </div>

                        {/* CV Found Data */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                            CV Found Data
                          </p>
                          {detail.matched_cv_qualification ? (
                            <>
                              <p className="font-bold text-gray-800">
                                {detail.matched_cv_qualification.degree}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {detail.matched_cv_qualification.institution || ""}
                              </p>
                            </>
                          ) : (
                            <p className="text-red-500 italic text-sm flex items-center gap-2">
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
            <div className="mt-8 text-center">
              <button
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Run Another Verification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

