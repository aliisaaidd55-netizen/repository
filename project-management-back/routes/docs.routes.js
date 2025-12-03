import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import * as ctrl from "../controllers/document.controller.js";

const router = express.Router();

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => 
    cb(null, path.join(__dirname, "../uploads")),
  
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), ctrl.upload);
router.get("/project/:projectId", ctrl.list);
router.delete("/delete/:id", ctrl.remove);

export default router;
