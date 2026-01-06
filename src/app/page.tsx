"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import { FileTypeToggle } from "@/components/common/FileTypeToggle";
import { UploadSection } from "@/components/audit/UploadSection";
import { ResultsTable } from "@/components/audit/ResultsTable";
import { useAuditStore } from "@/hooks/useAuditStore";
import { apiService } from "@/services/api.service";
import { FileKey, FileType } from "@/types";

export default function Home() {
  const {
    currentFileType,
    files,
    results,
    isLoading,
    error,
    setFileType,
    setFile,
    setResult,
    setLoading,
    setError,
  } = useAuditStore();

  const [showResults, setShowResults] = useState(false);

  const handleFileSelect = (key: FileKey, file: File) => {
    setFile(key, {
      name: file.name,
      size: file.size,
      type: currentFileType,
      file,
    });
  };

  const handleRunTask = async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);

      const fileKeys: FileKey[] = ["ce1", "ce2", "ce3", "rw"];
      const filesToProcess: Record<string, File> = {};

      for (const key of fileKeys) {
        if (files[key]?.file) {
          filesToProcess[key] = files[key].file!;
        }
      }

      if (Object.keys(filesToProcess).length === 0) {
        setError("Please upload at least one file");
        setLoading(false);
        return;
      }

      const results = await apiService.runMultipleValidations(
        filesToProcess,
        taskId,
        currentFileType
      );

      for (const [key, result] of Object.entries(results)) {
        setResult(taskId, key as FileKey, {
          success: result.success !== false,
          status:
            result.success === false
              ? "fail"
              : result.success
                ? "pass"
                : "pending",
          details: result,
        });
      }

      setShowResults(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (key: FileKey) => {
    try {
      if (!files[key]?.file) {
        setError(`No file uploaded for ${key.toUpperCase()}`);
        return;
      }

      setLoading(true);
      const blob = await apiService.generateReport(
        files[key].file!,
        currentFileType
      );

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${key}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate report";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-container">
      <Header />

      {/* File Type Toggle */}
      <div className="header-actions" style={{marginBottom: '48px', justifyContent: 'flex-end'}}>
        <FileTypeToggle
          current={currentFileType}
          onChange={(type: FileType) => setFileType(type)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          marginBottom: '32px',
          padding: '16px',
          background: 'var(--error-bg)',
          border: '1px solid var(--error)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--error)'
        }}>
          <p style={{fontWeight: '500'}}>⚠️ {error}</p>
        </div>
      )}

      {/* Upload Section */}
      <UploadSection
        fileType={currentFileType}
        files={files}
        onFileSelect={handleFileSelect}
      />

      {/* Results Section */}
      {showResults && (
        <ResultsTable
          results={results}
          onRunTask={handleRunTask}
          onGenerateReport={handleGenerateReport}
          isLoading={isLoading}
        />
      )}

      {/* Show Results Button */}
      {!showResults && Object.keys(files).some(key => files[key as FileKey]) && (
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <button
            onClick={() => setShowResults(true)}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Show Results
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-modal">
            <div className="spinner"></div>
            <h3>Processing...</h3>
            <p>Please wait while we analyze your documents.</p>
          </div>
        </div>
      )}
    </main>
  );
}
