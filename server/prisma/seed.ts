/// <reference types="node" />
import { PrismaClient, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Only seed if database is empty (idempotent)
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: hashedPassword,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "bob@example.com",
      password: hashedPassword,
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: "Charlie Brown",
      email: "charlie@example.com",
      password: hashedPassword,
    },
  });

  const users = [alice, bob, charlie];

  // Create tasks
  const tasks = [
    {
      title: "Set up project repository",
      description: "Initialize the monorepo with client and server packages, configure TypeScript, and set up Docker Compose.",
      status: TaskStatus.DONE,
      assigneeId: alice.id,
      createdById: alice.id,
      dueDate: new Date("2025-03-10"),
    },
    {
      title: "Design database schema",
      description: "Create normalized schema for User and Task entities with proper relationships, indexes, and soft delete support.",
      status: TaskStatus.DONE,
      assigneeId: bob.id,
      createdById: alice.id,
      dueDate: new Date("2025-03-12"),
    },
    {
      title: "Implement JWT authentication",
      description: "Build register/login endpoints with bcrypt password hashing and JWT token generation.",
      status: TaskStatus.DONE,
      assigneeId: alice.id,
      createdById: alice.id,
      dueDate: new Date("2025-03-15"),
    },
    {
      title: "Build task CRUD API",
      description: "Create REST endpoints for creating, reading, updating, and soft-deleting tasks with proper validation.",
      status: TaskStatus.IN_PROGRESS,
      assigneeId: bob.id,
      createdById: alice.id,
      dueDate: new Date("2025-03-20"),
    },
    {
      title: "Add pagination and filtering",
      description: "Implement server-side pagination with configurable page size and filtering by status and assignee.",
      status: TaskStatus.IN_PROGRESS,
      assigneeId: bob.id,
      createdById: bob.id,
      dueDate: new Date("2025-03-22"),
    },
    {
      title: "Set up Swagger documentation",
      description: "Configure swagger-jsdoc and swagger-ui-express to auto-generate interactive API docs.",
      status: TaskStatus.TODO,
      assigneeId: charlie.id,
      createdById: alice.id,
      dueDate: new Date("2025-03-25"),
    },
    {
      title: "Create login page UI",
      description: "Build responsive login form with email/password fields, validation, and error handling using MUI.",
      status: TaskStatus.DONE,
      assigneeId: charlie.id,
      createdById: charlie.id,
      dueDate: new Date("2025-03-14"),
    },
    {
      title: "Build task list view",
      description: "Implement paginated task table with MUI DataGrid, status chips, and action buttons.",
      status: TaskStatus.IN_PROGRESS,
      assigneeId: charlie.id,
      createdById: alice.id,
      dueDate: new Date("2025-03-24"),
    },
    {
      title: "Implement task form dialog",
      description: "Create reusable dialog for creating and editing tasks with form validation using react-hook-form and Zod.",
      status: TaskStatus.TODO,
      assigneeId: alice.id,
      createdById: charlie.id,
      dueDate: new Date("2025-03-28"),
    },
    {
      title: "Add task filtering UI",
      description: "Build filter bar with status and assignee dropdowns that sync with URL query parameters.",
      status: TaskStatus.TODO,
      assigneeId: bob.id,
      createdById: charlie.id,
      dueDate: new Date("2025-03-27"),
    },
    {
      title: "Write Dockerfiles",
      description: "Create production-ready Dockerfiles for both client (nginx) and server (Node.js) with multi-stage builds.",
      status: TaskStatus.TODO,
      assigneeId: alice.id,
      createdById: alice.id,
      dueDate: new Date("2025-03-30"),
    },
    {
      title: "Configure CORS and security headers",
      description: "Set up Helmet.js for security headers and configure CORS to allow only the client origin.",
      status: TaskStatus.DONE,
      assigneeId: bob.id,
      createdById: bob.id,
      dueDate: new Date("2025-03-13"),
    },
    {
      title: "Add rate limiting to auth endpoints",
      description: "Implement express-rate-limit middleware to prevent brute force attacks on login and register routes.",
      status: TaskStatus.IN_PROGRESS,
      assigneeId: alice.id,
      createdById: bob.id,
      dueDate: new Date("2025-03-23"),
    },
    {
      title: "Write README documentation",
      description: "Document setup instructions, architecture overview, API reference, and seed data credentials.",
      status: TaskStatus.TODO,
      assigneeId: charlie.id,
      createdById: alice.id,
      dueDate: null,
    },
    {
      title: "Implement responsive mobile layout",
      description: "Ensure all pages work on mobile devices. Convert data table to card layout on small screens.",
      status: TaskStatus.TODO,
      assigneeId: charlie.id,
      createdById: charlie.id,
      dueDate: new Date("2025-04-01"),
    },
    {
      title: "Add loading indicators",
      description: "Show LinearProgress bar during async operations and skeleton loaders for initial data fetches.",
      status: TaskStatus.TODO,
      assigneeId: bob.id,
      createdById: charlie.id,
      dueDate: null,
    },
    {
      title: "Set up error toast notifications",
      description: "Implement global error handling with MUI Snackbar to show user-friendly error messages for API failures.",
      status: TaskStatus.IN_PROGRESS,
      assigneeId: alice.id,
      createdById: alice.id,
      dueDate: new Date("2025-03-26"),
    },
    {
      title: "Review and optimize database queries",
      description: "Analyze query performance, ensure indexes are utilized, and optimize N+1 query patterns.",
      status: TaskStatus.TODO,
      assigneeId: bob.id,
      createdById: bob.id,
      dueDate: null,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log(`Seeded ${users.length} users and ${tasks.length} tasks.`);
  console.log("\nLogin credentials:");
  console.log("  alice@example.com / password123");
  console.log("  bob@example.com   / password123");
  console.log("  charlie@example.com / password123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
