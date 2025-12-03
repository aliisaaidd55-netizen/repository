import express from "express";
import * as ctrl from "../controllers/timeline.controller.js";

const router = express.Router();

router.get("/project/:projectId", ctrl.getProjectTasks);

export default router;
