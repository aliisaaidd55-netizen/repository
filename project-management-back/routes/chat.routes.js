import express from "express";
import * as ctrl from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/send", ctrl.send);
router.get("/project/:projectId", ctrl.list);

export default router;

