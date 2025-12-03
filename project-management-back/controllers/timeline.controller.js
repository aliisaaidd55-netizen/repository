import Project from "../models/project.model.js";

export const getProjectTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId).populate("tasks");

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.json(project.tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
