import React from "react";
import { useAuditStore } from "@/hooks/useAuditStore";
import { TASK_DEFINITIONS } from "@/config/constants";
import { TaskRow } from "./TaskRow";
import { FileKey, AuditTaskResult } from "@/types";

export const AuditTable: React.FC = () => {
  const { results, activeTasks, runTask, generateReport } = useAuditStore();

  return (
    <section className="results-section" id="resultsSection" data-testid="audit-table">
      <div className="section-header">
        <h2>Audit Results</h2>
        <div className="status-legend">
          <span className="legend-item">
            <span className="dot success"></span>Pass (Q)
          </span>
          <span className="legend-item">
            <span className="dot error"></span>Fail (NQ)
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
              <th>Source File</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {TASK_DEFINITIONS.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                results={(results[task.id] || {}) as Record<FileKey, AuditTaskResult | undefined>}
                activeTasks={activeTasks || []}
                onRunTask={runTask}
              />
            ))}
            {/* Generate Report Row */}
            <tr>
              <td className="task-info">
                <div className="task-icon">
                  <i className="ph ph-file-text"></i>
                </div>
                <span className="task-name">Generate Report</span>
              </td>
              {(["ce1", "ce2", "ce3", "rw"] as FileKey[]).map((key) => (
                <td key={key} id={`report-${key}`} className="result-cell">
                  {key !== "rw" ? (
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button 
                        className="sm-btn" 
                        onClick={() => generateReport(key, 'view')}
                        title="View in Browser"
                      >
                        View
                      </button>
                      <button 
                        className="sm-btn" 
                        onClick={() => generateReport(key, 'download')}
                        title="Download HTML"
                      >
                        <i className="ph ph-download-simple"></i>
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: "#aaa" }}>-</span>
                  )}
                </td>
              ))}
              <td className="action-cell">
                <span style={{ color: "#aaa" }}>-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
