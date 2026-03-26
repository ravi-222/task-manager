import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import type { Task, TaskStatus } from "../types";
import type { TaskFormData } from "../schemas";
import StatusChip from "../components/StatusChip";
import TaskFilters from "../components/TaskFilters";
import TaskFormDialog from "../components/TaskFormDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import Layout from "../components/Layout";
import dayjs from "dayjs";

export default function TaskListPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Filters & pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" } | null>(null);

  // Data fetching
  const { data: taskData, isLoading, isFetching } = useTasks({
    page: page + 1, // DataGrid is 0-indexed, API is 1-indexed
    limit: pageSize,
    ...(statusFilter && { status: statusFilter }),
    ...(assigneeFilter && { assigneeId: assigneeFilter }),
  });
  const { data: users = [] } = useUsers();

  // Mutations
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const handleCreate = useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: TaskFormData) => {
      try {
        if (editingTask) {
          await updateMutation.mutateAsync({ id: editingTask.id, data });
          setToast({ message: "Task updated successfully", severity: "success" });
        } else {
          await createMutation.mutateAsync(data);
          setToast({ message: "Task created successfully", severity: "success" });
        }
        setFormOpen(false);
      } catch {
        setToast({ message: "Failed to save task", severity: "error" });
      }
    },
    [editingTask, createMutation, updateMutation]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTask) return;
    try {
      await deleteMutation.mutateAsync(deleteTask.id);
      setToast({ message: "Task deleted successfully", severity: "success" });
      setDeleteTask(null);
    } catch {
      setToast({ message: "Failed to delete task", severity: "error" });
    }
  }, [deleteTask, deleteMutation]);

  const handlePaginationChange = useCallback((model: GridPaginationModel) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  }, []);

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: "assignee",
      headerName: "Assignee",
      width: 150,
      valueGetter: (_value, row) => row.assignee?.name || "Unassigned",
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 120,
      valueGetter: (_value, row) =>
        row.dueDate ? dayjs(row.dueDate).format("MMM D, YYYY") : "—",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {params.row.createdById === user?.id && (
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleteTask(params.row)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  // Mobile card view
  const renderMobileCards = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {taskData?.data.map((task) => (
        <Card key={task.id} variant="outlined">
          <CardContent sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {task.title}
              </Typography>
              <StatusChip status={task.status} />
            </Box>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {task.description.length > 100
                  ? `${task.description.slice(0, 100)}...`
                  : task.description}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Assignee: {task.assignee?.name || "Unassigned"}
              {task.dueDate && ` | Due: ${dayjs(task.dueDate).format("MMM D, YYYY")}`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" startIcon={<Edit />} onClick={() => handleEdit(task)}>
              Edit
            </Button>
            {task.createdById === user?.id && (
              <Button
                size="small"
                color="error"
                startIcon={<Delete />}
                onClick={() => setDeleteTask(task)}
              >
                Delete
              </Button>
            )}
          </CardActions>
        </Card>
      ))}
      {taskData?.data.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No tasks found. Create one to get started!
        </Typography>
      )}
    </Box>
  );

  return (
    <Layout>
      {isFetching && <LinearProgress sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1200 }} />}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" component="h1">
          Tasks
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          New Task
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TaskFilters
          status={statusFilter}
          assigneeId={assigneeFilter}
          users={users}
          onStatusChange={(val) => {
            setStatusFilter(val);
            setPage(0);
          }}
          onAssigneeChange={(val) => {
            setAssigneeFilter(val);
            setPage(0);
          }}
        />
      </Box>

      {isMobile ? (
        renderMobileCards()
      ) : (
        <DataGrid
          rows={taskData?.data || []}
          columns={columns}
          rowCount={taskData?.meta.total || 0}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25]}
          paginationModel={{ page, pageSize }}
          paginationMode="server"
          onPaginationModelChange={handlePaginationChange}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            bgcolor: "background.paper",
            "& .MuiDataGrid-cell": { py: 1 },
          }}
        />
      )}

      {/* Create/Edit Dialog */}
      <TaskFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={editingTask}
        users={users}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={handleDeleteConfirm}
        taskTitle={deleteTask?.title || ""}
        isDeleting={deleteMutation.isPending}
      />

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {toast ? (
          <Alert onClose={() => setToast(null)} severity={toast.severity} variant="filled">
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Layout>
  );
}
