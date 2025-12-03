import express from "express";
import {
  createTask,
  updateTask,
  assignTask,
  updateStatus,
  addComment,
  addAttachment,
  getProjectTasks
} from "../controllers/taskController.js";

import { authMiddleware, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Leader only
router.post("/:projectId", authMiddleware, authorize("leader"), createTask);
router.put("/:taskId/assign", authMiddleware, authorize("leader"), assignTask);

// Members + Leader
router.put("/:taskId/status", authMiddleware, authorize("leader", "member"), updateStatus);
router.post("/:taskId/comment", authMiddleware, authorize("leader", "member"), addComment);
router.post("/:taskId/attachment", authMiddleware, authorize("leader", "member"), addAttachment);

// Fetch tasks for a project
router.get("/project/:projectId", authMiddleware, getProjectTasks);

export default router;
