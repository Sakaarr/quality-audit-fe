/**
 * File Upload Component
 * Handles file selection with drag and drop
 */

import React, { useRef, useState } from "react";
import { FileType } from "@/types";
import clsx from "clsx";

interface FileUploadProps {
  label: string;
  icon?: string;
  description?: string;
  fileType: FileType;
  onFileSelect: (file: File) => void;
  selectedFile?: { name: string } | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  icon = "📁",
  description,
  fileType,
  onFileSelect,
  selectedFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptTypes = fileType === "pdf" ? ".pdf" : ".docx";

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="upload-panel">
      <div className="panel-header">
        <div className="panel-icon">
          <i className="ph ph-cloud-arrow-up"></i>
        </div>
        <div className="panel-info">
          <h2>{label}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>

      <div
        className={clsx("drop-area", isDragging && "drag-over")}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="drop-icon">
          <i className="ph ph-cloud-arrow-up"></i>
        </div>
        <div className="drop-text">
          Drop file or click to browse
        </div>
        <div className="file-name">
          {selectedFile ? selectedFile.name : "No file selected"}
        </div>
      </div>

      {selectedFile && (
        <div className="file-status">
          ✓ File selected successfully
        </div>
      )}
    </div>
  );
};

