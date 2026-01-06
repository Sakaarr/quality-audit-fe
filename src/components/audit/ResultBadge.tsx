import React from "react";
import clsx from "clsx";
import { AuditTaskResult } from "@/types";

interface ResultBadgeProps {
  result?: AuditTaskResult;
}

export const ResultBadge: React.FC<ResultBadgeProps> = ({ result }) => {
  if (!result) return <span className="result-cell">-</span>;

  return (
    <span
      data-testid="result-badge"
      className={clsx(
        "result-cell",
        result.status === "pass" && "pass", // You might want to rename CSS class too, but assuming 'pass' handles green color
        result.status === "fail" && "fail",
        result.status === "loading" && "loading",
        result.status === "pending" && ""
      )}
    >
      {result.status === "pass" && "Q"}
      {result.status === "fail" && "NQ"}
      {result.status === "loading" && "⏳"}
      {result.status === "pending" && "-"}
    </span>
  );
};
