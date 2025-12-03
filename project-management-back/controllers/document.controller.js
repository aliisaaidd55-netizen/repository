import SharedDocument from "../models/document.model.js";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const upload = async (req, res) => {
  try {
    const file = req.file;
    const { uploadedBy, projectId } = req.body;

    const doc = await SharedDocument.create({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      uploadedBy: uploadedBy || "Anonymous",
      size: file.size,
      projectId: projectId
    });

    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const list = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const docs = await SharedDocument.find({ projectId }).sort({ timestamp: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const doc = await SharedDocument.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // extract file name without leading slash
    const fileName = doc.fileUrl.replace("/uploads/", "");
    const filePath = path.join(__dirname, "..", "uploads", fileName);

    await fs.unlink(filePath);

    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
