/**
 * File Type Toggle Component
 * Switch between PDF and DOCX file types
 */

import React from "react";
import { FileType } from "@/types";
import clsx from "clsx";

interface FileTypeToggleProps {
  current: FileType;
  onChange: (type: FileType) => void;
}

export const FileTypeToggle: React.FC<FileTypeToggleProps> = ({
  current,
  onChange,
}) => {
  return (
    <div className="file-type-toggle">
      <button
        onClick={() => onChange("pdf")}
        className={clsx("toggle-btn", current === "pdf" && "active")}
      >
        <i className="ph ph-file-pdf"></i> PDF
      </button>
      <button
        onClick={() => onChange("docx")}
        className={clsx("toggle-btn", current === "docx" && "active")}
      >
        <i className="ph ph-file-doc"></i> DOCX
      </button>
    </div>
  );
};

