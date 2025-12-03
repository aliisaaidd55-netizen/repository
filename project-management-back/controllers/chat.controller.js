import ChatMessage from "../models/chat.model.js";

export const send = async (req, res) => {
  try {
    const { userName, message, projectId } = req.body;

    const msg = await ChatMessage.create({
      userName,
      message,
      projectId
    });

    res.json(msg);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const list = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const msgs = await ChatMessage
      .find({ projectId })
      .sort({ timestamp: 1 })
      .limit(200);

    res.json(msgs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
