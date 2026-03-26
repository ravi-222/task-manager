import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { TaskStatus, User } from "../types";

interface TaskFiltersProps {
  status: TaskStatus | "";
  assigneeId: string;
  users: User[];
  onStatusChange: (status: TaskStatus | "") => void;
  onAssigneeChange: (assigneeId: string) => void;
}

export default function TaskFilters({
  status,
  assigneeId,
  users,
  onStatusChange,
  onAssigneeChange,
}: TaskFiltersProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={(e: SelectChangeEvent) =>
            onStatusChange(e.target.value as TaskStatus | "")
          }
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="TODO">Todo</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="DONE">Done</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Assignee</InputLabel>
        <Select
          value={assigneeId}
          label="Assignee"
          onChange={(e: SelectChangeEvent) => onAssigneeChange(e.target.value)}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
