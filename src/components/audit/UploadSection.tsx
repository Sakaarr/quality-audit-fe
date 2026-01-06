/**
 * Upload Section Component
 * Displays upload cards for CE1, CE2, CE3, and RW documents
 */

import React from "react";
import { FileUpload } from "@/components/common/FileUpload";
import { FileType, FileKey, UploadedFile } from "@/types";

interface UploadSectionProps {
  fileType: FileType;
  files: Partial<Record<FileKey, UploadedFile | null>>;
  onFileSelect: (key: FileKey, file: File) => void;
}

const UPLOAD_CARDS = [
  { key: "ce1" as FileKey, label: "CE1 Document", icon: "📋" },
  { key: "ce2" as FileKey, label: "CE2 Document", icon: "📋" },
  { key: "ce3" as FileKey, label: "CE3 Document", icon: "📋" },
  { key: "rw" as FileKey, label: "RW Document", icon: "📄" },
];

export const UploadSection: React.FC<UploadSectionProps> = ({
  fileType,
  files,
  onFileSelect,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    const card = e.currentTarget as HTMLElement;
    card.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    const card = e.currentTarget as HTMLElement;
    card.classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    const card = e.currentTarget as HTMLElement;
    card.classList.remove("drag-over");

    const dt = e.dataTransfer;
    const droppedFiles = dt.files;

    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      // Validate file extension
      const expectedExt = fileType === "pdf" ? ".pdf" : ".docx";
      const fileExt = file.name.toLowerCase().endsWith(expectedExt);

      if (fileExt) {
        onFileSelect(key, file);
      } else {
        alert(`Please upload a ${fileType.toUpperCase()} file.`);
      }
    }
  };

  // Prevent default drag behavior on document
  React.useEffect(() => {
    const handleDocumentDragOver = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDocumentDrop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("dragenter", handleDocumentDragOver);
    document.addEventListener("dragover", handleDocumentDragOver);
    document.addEventListener("dragleave", handleDocumentDragOver);
    document.addEventListener("drop", handleDocumentDrop);

    return () => {
      document.removeEventListener("dragenter", handleDocumentDragOver);
      document.removeEventListener("dragover", handleDocumentDragOver);
      document.removeEventListener("dragleave", handleDocumentDragOver);
      document.removeEventListener("drop", handleDocumentDrop);
    };
  }, []);

  return (
    <section className="upload-section">
      <div className="section-header">
        <div>
          <h2>Upload Documents</h2>
          <p>Select or drag & drop your files below</p>
        </div>
      </div>

      <div className="upload-grid">
        {UPLOAD_CARDS.map(({ key, label }) => (
          <div
            key={key}
            className="upload-card"
            data-file-key={key}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, key)}
            onDragLeave={(e) => handleDragLeave(e, key)}
            onDrop={(e) => handleDrop(e, key)}
          >
            <div className="card-status-indicator"></div>
            <div className="card-content">
              <div className="icon-wrapper">
                <i className="ph ph-upload-simple"></i>
              </div>
              <h3>{label}</h3>
              <p className="file-name">
                {files[key] ? files[key].name : "No file selected"}
              </p>
            </div>
            <input
              type="file"
              id={`${key}File`}
              accept={fileType === "pdf" ? ".pdf" : ".docx"}
              className="file-input"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  onFileSelect(key, files[0]);
                }
              }}
            />
            <label htmlFor={`${key}File`} className="file-label-overlay"></label>
            <div className="upload-status" id={`${key}Status`}></div>
          </div>
        ))}
      </div>
    </section>
  );
};

