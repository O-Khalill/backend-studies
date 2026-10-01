import Router from "express";
import {
  createNoteWithId,
  deleteNoteById,
  getPaginatedNotes,
  redoNote,
  updateAllNotesTitle,
  updateNoteById,
  getNoteById,
  getNoteByContent,
  deleteAllNotes,
} from "./notes.service.js";

export const notesRouter = new Router();

notesRouter.post("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const noteData = req.body;
    const note = await createNoteWithId(userId, noteData);
    res.status(200).json({ message: note });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

notesRouter.patch("/:id", async (req, res) => {
  try {
    const userId = req.query.userId;
    const noteId = req.params.id;
    const noteData = req.body;
    const note = await updateNoteById(userId, noteId, noteData);
    res.status(200).json({ message: note });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

notesRouter.put("/:id", async (req, res) => {
  try {
    const userId = req.query.userId;
    const noteId = req.params.id;
    const noteData = req.body;
    const note = await redoNote(userId, noteId, noteData);
    res.status(200).json({ message: note });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
notesRouter.patch("/all/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { title } = req.body;
    const note = await updateAllNotesTitle(userId, title);
    res.status(200).json({ message: note });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

notesRouter.delete("/:id", async (req, res) => {
  try {
    const userId = req.query.userId;
    const noteId = req.params.id;
    const note = await deleteNoteById(userId, noteId);
    res.status(200).json({ message: note });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

notesRouter.get("/paginate-sort/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const page = req.query.page;
    const limit = req.query.limit;
    const note = await getPaginatedNotes(userId, page, limit);
    res.status(200).json({ message: note });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
notesRouter.get("/note-by-content", async (req, res) => {
  try {
    const { userId, content } = req.query;
    const note = await getNoteByContent(userId, content);
    res.status(200).json({ message: note });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

notesRouter.get("/note-with-user", async (req, res) => {
  try {
    const userId = req.query.userId;
    const notes = await getNotesWithUser(userId);
    res.status(200).json({ message: notes });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

notesRouter.get("/:id", async (req, res) => {
  try {
    const userId = req.query.userId;
    const noteId = req.params.id;
    const note = await getNoteById(userId, noteId);
    res.status(200).json({ message: note });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
notesRouter.delete("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const result = await deleteAllNotes(userId);
    res.status(200).json({ message: "Notes deleted", result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});
