import express from "express";
import * as ctrl from "../controllers/team.controller.js";

const router = express.Router();

router.get("/members/:teamId", ctrl.list);
router.post("/members", ctrl.add);
router.get("/check/:code", ctrl.checkCode);

export default router;
