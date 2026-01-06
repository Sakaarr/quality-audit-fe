"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import { FileTypeToggle } from "@/components/common/FileTypeToggle";
import { UploadSection } from "@/components/audit/UploadSection";
import { AuditTable } from "@/components/audit/AuditTable";
import { useAuditStore } from "@/hooks/useAuditStore";
import { FileType } from "@/types";

export default function Home() {
  const {
    currentFileType,
    setFileType,
    isLoading,
    error,
    files,
    results
  } = useAuditStore();
  
  const [showResults, setShowResults] = useState(false);

  const hasFiles = Object.values(files).some(f => f !== null);
  // Also show results if we have any results
  const hasResults = Object.keys(results).length > 0;

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
      <UploadSection />

      {/* Results Section */}
      {(showResults || hasResults) && (
        <AuditTable />
      )}

      {/* Show Results Button */}
      {(!showResults && !hasResults && hasFiles) && (
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

      {/* Loading Overlay Removed */}
    </main>
  );
}
