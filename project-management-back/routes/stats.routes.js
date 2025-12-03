// backend/routes/stats.routes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/dashboard", protect, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const todo = await Task.countDocuments({ status: "To-Do" });
    const inProgress = await Task.countDocuments({ status: "In Progress" });
    const done = await Task.countDocuments({ status: "Done" });

    const tasksByUser = await Task.aggregate([
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $project: { name: { $arrayElemAt: ["$user.name", 0] }, count: 1 } }
    ]);

    res.json({
      totalTasks,
      todo,
      inProgress,
      done,
      tasksByUser: tasksByUser.filter(t => t.name)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
