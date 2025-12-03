import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import statsRoutes from "./routes/stats.routes.js";
// ...
app.use("/api/stats", statsRoutes);
// Routes (ESM import)
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chat.routes.js";
import docsRoutes from "./routes/docs.routes.js";
import teamRoutes from "./routes/team.routes.js";
import projectRoutes from "./routes/project.routes.js";
import timelineRoutes from "./routes/timeline.routes.js";

// Config
dotenv.config();
const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


// Static folders

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Force JSON Content-Type
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/timeline", timelineRoutes);

// Root route
app.get("/", (req, res) => res.send("ok"));

// DB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
