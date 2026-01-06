import React from "react";
import { AuditTaskResult, FileKey } from "@/types";
import { ResultBadge } from "./ResultBadge";
import { ActionCell } from "./ActionCell";

interface TaskRowProps {
  task: {
    id: string;
    name: string;
    icon: string;
  };
  results: Record<FileKey, AuditTaskResult | undefined>;
  activeTasks: string[];
  onRunTask: (taskId: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  results,
  activeTasks,
  onRunTask,
}) => {
  const isComparison =
    task.id === "title-comparison" ||
    task.id === "visual-comparison" ||
    task.id === "format-comparison";

  const isRunning = activeTasks.includes(task.id);

  return (
    <tr key={task.id}>
      <td className="task-info">
        <div className="task-icon">
          <i className={`ph ${task.icon}`}></i>
        </div>
        <span className="task-name">{task.name}</span>
      </td>
      <td id={`${task.id}-ce1`} className="result-cell">
        <ResultBadge result={results.ce1} />
      </td>
      <td id={`${task.id}-ce2`} className="result-cell">
        <ResultBadge result={results.ce2} />
      </td>
      <td id={`${task.id}-ce3`} className="result-cell">
        <ResultBadge result={results.ce3} />
      </td>
      <td id={`${task.id}-rw`} className="result-cell">
        <ResultBadge result={results.rw} />
      </td>
      <ActionCell
        taskId={task.id}
        isLoading={isRunning} // mapped to isLoading prop of Cell which handles "Processing..." text
        onRunTask={onRunTask}
        isComparison={isComparison}
      />
    </tr>
  );
};
