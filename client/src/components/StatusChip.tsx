import { Chip } from "@mui/material";
import type { TaskStatus } from "../types";

const statusConfig: Record<TaskStatus, { label: string; color: "info" | "warning" | "success" }> = {
  TODO: { label: "Todo", color: "info" },
  IN_PROGRESS: { label: "In Progress", color: "warning" },
  DONE: { label: "Done", color: "success" },
};

interface StatusChipProps {
  status: TaskStatus;
  size?: "small" | "medium";
}

export default function StatusChip({ status, size = "small" }: StatusChipProps) {
  const config = statusConfig[status];
  return <Chip label={config.label} color={config.color} size={size} />;
}
