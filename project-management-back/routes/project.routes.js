import express from "express";
import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";

import { authMiddleware, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Leader-only routes
router.post("/", authMiddleware, authorize("leader"), createProject);
router.put("/:projectId", authMiddleware, authorize("leader"), updateProject);
router.delete("/:projectId", authMiddleware, authorize("leader"), deleteProject);

// Shared
router.get("/", authMiddleware, getMyProjects);
router.get("/:projectId", authMiddleware, getProjectById);

export default router;
