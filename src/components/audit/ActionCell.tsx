import React from "react";

interface ActionCellProps {
  taskId: string;
  isLoading: boolean; // This is now 'isRunning' effectively for this cell if passed correctly
  onRunTask: (taskId: string) => void;
  isComparison?: boolean;
}

export const ActionCell: React.FC<ActionCellProps> = ({
  taskId,
  isLoading, 
  onRunTask,
  isComparison = false,
}) => {
  // Removed isComparison check to allow running comparison tasks


  if (isLoading) {
      return (
          <td className="action-cell">
              <span className="processing-text">Processing...</span>
          </td>
      )
  }

  return (
    <td className="action-cell">
      <button
        className="run-btn"
        data-task={taskId}
        onClick={() => onRunTask(taskId)}
      >
        <i className="ph ph-play"></i> Run
      </button>
    </td>
  );
};
