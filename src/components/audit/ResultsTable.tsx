/**
 * Results Table Component
 * Displays audit results for all validation tasks
 */

import React from "react";
import { AuditTaskResult, FileKey } from "@/types";
import clsx from "clsx";

interface ResultsTableProps {
  results: Record<string, Partial<Record<FileKey, AuditTaskResult>>>;
  onRunTask: (task: string) => void;
  onGenerateReport: (key: FileKey) => void;
  isLoading: boolean;
}

const TASK_DEFINITIONS = [
  {
    id: "grammar",
    name: "Grammar Check",
    icon: "ph-text-aa",
  },
  {
    id: "title-validation",
    name: "Title Validation",
    icon: "ph-check-circle",
  },
  {
    id: "title-comparison",
    name: "Title Comparison",
    icon: "ph-arrows-left-right",
  },
  {
    id: "section-validation",
    name: "Section Validation",
    icon: "ph-list-checks",
  },
  {
    id: "format-comparison",
    name: "Format Comparison",
    icon: "ph-file-code",
  },
  {
    id: "google-validation",
    name: "Google Validation",
    icon: "ph-magnifying-glass",
  },
  {
    id: "visual-validation",
    name: "Visual Validation",
    icon: "ph-image",
  },
  {
    id: "visual-comparison",
    name: "Visual Comparison",
    icon: "ph-images",
  },
  {
    id: "ai-math-validation",
    name: "AI Math Validation",
    icon: "ph-calculator",
  },
  {
    id: "reference-validation",
    name: "Reference Validation",
    icon: "ph-link",
  },
  {
    id: "code-validation",
    name: "Code Validation",
    icon: "ph-code",
  },
  {
    id: "accessibility-validation",
    name: "Accessibility Validation",
    icon: "ph-layout",
  },
  {
    id: "figure-placement",
    name: "Figure Placement",
    icon: "ph-layout",
  },
];

const ResultBadge: React.FC<{ result?: AuditTaskResult }> = ({ result }) => {
  if (!result) return <span className="result-cell">-</span>;

  return (
    <span
      className={clsx(
        "result-cell",
        result.status === "pass" && "pass",
        result.status === "fail" && "fail",
        result.status === "loading" && "loading",
        result.status === "pending" && ""
      )}
    >
      {result.status === "pass" && "✓"}
      {result.status === "fail" && "✗"}
      {result.status === "loading" && "⏳"}
      {result.status === "pending" && "-"}
    </span>
  );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  onRunTask,
  onGenerateReport,
  isLoading,
}) => {
  return (
    <section className="results-section" id="resultsSection">
      <div className="section-header">
        <h2>Audit Results</h2>
        <div className="status-legend">
          <span className="legend-item">
            <span className="dot success"></span>Pass
          </span>
          <span className="legend-item">
            <span className="dot error"></span>Fail
          </span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th className="col-task">Task Name</th>
              <th>CE1</th>
              <th>CE2</th>
              <th>CE3</th>
              <th>RW</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {TASK_DEFINITIONS.map((task) => (
              <tr key={task.id}>
                <td className="task-info">
                  <div className="task-icon">
                    <i className={`ph ${task.icon}`}></i>
                  </div>
                  <span className="task-name">{task.name}</span>
                </td>
                <td id={`grammar-${task.id.replace('-', '-')}-ce1`} className="result-cell">
                  <ResultBadge result={results[task.id]?.["ce1"]} />
                </td>
                <td id={`grammar-${task.id.replace('-', '-')}-ce2`} className="result-cell">
                  <ResultBadge result={results[task.id]?.["ce2"]} />
                </td>
                <td id={`grammar-${task.id.replace('-', '-')}-ce3`} className="result-cell">
                  <ResultBadge result={results[task.id]?.["ce3"]} />
                </td>
                <td id={`grammar-${task.id.replace('-', '-')}-rw`} className="result-cell">
                  <ResultBadge result={results[task.id]?.["rw"]} />
                </td>
                <td className="action-cell">
                  {task.id === "title-comparison" ||
                  task.id === "visual-comparison" ||
                  task.id === "format-comparison" ? (
                    <span style={{color: '#aaa'}}>-</span>
                  ) : (
                    <button
                      className="run-btn"
                      data-task={task.id}
                      disabled={isLoading}
                      onClick={() => onRunTask(task.id)}
                    >
                      <i className="ph ph-play"></i> Run
                    </button>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td className="task-info">
                <div className="task-icon">
                  <i className="ph ph-file-text"></i>
                </div>
                <span className="task-name">Generate Report</span>
              </td>
              <td id="report-ce1" className="result-cell">
                <button className="sm-btn" onClick={() => onGenerateReport("ce1")}>
                  Gen
                </button>
              </td>
              <td id="report-ce2" className="result-cell">
                <button className="sm-btn" onClick={() => onGenerateReport("ce2")}>
                  Gen
                </button>
              </td>
              <td id="report-ce3" className="result-cell">
                <button className="sm-btn" onClick={() => onGenerateReport("ce3")}>
                  Gen
                </button>
              </td>
              <td id="report-rw" className="result-cell">
                <button className="sm-btn" onClick={() => onGenerateReport("rw")}>
                  Gen
                </button>
              </td>
              <td className="action-cell">
                <span style={{color: '#aaa'}}>-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

