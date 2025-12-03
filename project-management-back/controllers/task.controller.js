import Task from "../models/Task.js";
import Project from "../models/Project.js";

// =====================================
// Create Task  (Leader Only)
// =====================================
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, dueDate } = req.body;

    // Check project existence
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Leader check
    if (!project.isLeader(req.user.id))
      return res.status(403).json({ message: "Only project leader can create tasks" });

    // Create task
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      project: projectId
    });

    // Add task to project
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json({ message: "Task created", task });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// Assign Task to User (Leader Only)
// =====================================
export const assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    const task = await Task.findById(taskId).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Leader check
    if (!task.project.isLeader(req.user.id))
      return res.status(403).json({ message: "Only leader can assign tasks" });

    // Assign
    task.assignedTo = userId;
    await task.save();

    res.json({ message: "Task assigned", task });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// Update Task Status (Leader + Member)
// =====================================
export const updateStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Members can ONLY update their own assigned tasks
    if (req.user.role === "member") {
      if (String(task.assignedTo) !== String(req.user.id))
        return res.status(403).json({ message: "Not your task" });
    }

    task.status = status;
    await task.save();

    res.json({ message: "Status updated", task });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// Add Comment (Leader + Member)
// =====================================
export const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.comments.push({
      user: req.user.id,
      content
    });

    await task.save();

    res.json({ message: "Comment added", task });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// Add Attachment (Leader + Member)
// =====================================
export const addAttachment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { fileUrl, fileName } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.attachments.push({
      fileUrl,
      fileName
    });

    await task.save();

    res.json({ message: "Attachment added", task });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// Get All Tasks For A Project
// =====================================
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "fullName email role")
      .populate("project", "title leader");

    res.json({ tasks });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
