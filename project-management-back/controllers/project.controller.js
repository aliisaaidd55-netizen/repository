import Project from "../models/Project.js";
import Task from "../models/Task.js";

// =====================================
// Create Project (Leader Only)
// =====================================
export const createProject = async (req, res) => {
  try {
    const { title, description, members, endDate } = req.body;

    // Leader is the logged in user
    const leaderId = req.user.id;

    const project = await Project.create({
      title,
      description,
      leader: leaderId,
      members: members || [],   // array of user IDs
      endDate
    });

    // OPTIONAL: add leader as a member automatically
    if (!project.members.includes(leaderId)) {
      project.members.push(leaderId);
      await project.save();
    }

    res.status(201).json({ message: "Project created", project });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// Get all projects for current user
// =====================================
export const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [{ leader: userId }, { members: userId }]
    }).populate("leader", "fullName email")
      .populate("members", "fullName email");

    res.json({ projects });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// Get single project by ID
// =====================================
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("leader", "fullName email")
      .populate("members", "fullName email")
      .populate({
        path: "tasks",
        populate: {
          path: "assignedTo",
          select: "fullName email"
        }
      });

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    // check permission
    const isAllowed =
      project.isLeader(req.user.id) || project.isMember(req.user.id);

    if (!isAllowed)
      return res.status(403).json({ message: "Not authorized" });

    res.json({ project });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// Update Project (Leader Only)
// =====================================
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, endDate, members } = req.body;

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    if (!project.isLeader(req.user.id))
      return res.status(403).json({ message: "Only leader can edit" });

    project.title = title || project.title;
    project.description = description || project.description;
    project.endDate = endDate || project.endDate;
    project.members = members || project.members;

    await project.save();

    res.json({ message: "Project updated", project });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// Delete Project (Leader Only)
// =====================================
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    if (!project.isLeader(req.user.id))
      return res.status(403).json({ message: "Only leader can delete" });

    // Delete all tasks belonging to the project
    await Task.deleteMany({ project: projectId });

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
