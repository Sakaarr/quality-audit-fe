/**
 * Header Component
 * Displays application title and navigation
 */

import React from "react";

interface HeaderProps {
  showNav?: boolean;
  backLink?: string;
}

export const Header: React.FC<HeaderProps> = ({ showNav = true, backLink }) => {
  return (
    <header className="main-header">
      {backLink && (
        <a href={backLink} className="back-btn">
          <i className="ph ph-arrow-left"></i>
          <span>Back to Audit</span>
        </a>
      )}

      <div className="header-content">
        <div className="logo-area">
          <i className="ph ph-clipboard-text"></i>
          <div>
            <h1>Quality Audit</h1>
            <p className="subtitle">
              Automated document verification & compliance check
            </p>
          </div>
        </div>
      </div>

      <div className="header-actions">
        {showNav && (
          <>
            <a href="/comparison" className="comparison-link">
              <i className="ph ph-git-diff"></i>
              <span>Source Comparison</span>
            </a>

            <a href="/cpd-cv" className="comparison-link">
              <i className="ph ph-files"></i>
              <span>CPD CV Compare</span>
            </a>
          </>
        )}
      </div>
    </header>
  );
};

