import { User } from "../../models/users.model.js";
import { Note } from "../../models/notes.model.js";
import mongoose from "mongoose";

export async function createNoteWithId(userId, noteData = {}) {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  const userExists = await User.exists({ _id: userId });

  if (!userExists) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  const { title, content } = noteData;
  const note = await Note.create({ title, content, userId });
  return note;
}

export async function updateNoteById(userId, noteId, noteData = {}) {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  const note = await Note.findById(noteId);

  if (!note) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  if (note.userId.toString() !== userId) {
    const error = new Error("You are not authorised to update this note");
    error.statusCode = 400;
    throw error;
  }

  const updates = {};
  const { title, content } = noteData;

  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;

  const updatedNote = await Note.findByIdAndUpdate(noteId, updates, {
    returnDocument: "after",
    runValidators: true,
  });
  return updatedNote;
}

export async function redoNote(userId, noteId, newNote = {}) {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  const note = await Note.findById(noteId);

  if (!note) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  if (note.userId.toString() !== userId) {
    const error = new Error("You are not authorised to perform this operation");
    error.statusCode = 400;
    throw error;
  }

  const updatedNote = Note.findByIdAndUpdate(noteId, newNote, {
    returnDocument: "after",
    runValidators: true,
  });

  return updatedNote;
}

export async function updateAllNotesTitle(userId, newTitle) {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  if (!newTitle) {
    const error = new Error("Title is required");
    error.statusCode = 400;
    throw error;
  }

  const result = await Note.updateMany(
    { userId },
    { title: newTitle },
    { runValidators: true },
  );

  return result;
}

export async function deleteNoteById(userId, noteId) {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }
  const note = await Note.findById(noteId);

  if (!note) {
    const error = new Error("Note Does not exist");
    error.statusCode = 404;
    throw error;
  }

  if (note.userId.toString() !== userId) {
    const error = new Error("You are not authorised to do this function");
    error.statusCode = 400;
    throw error;
  }

  const deletedNote = await Note.findByIdAndDelete(noteId);
  return deletedNote;
}

export async function getPaginatedNotes(userId, page = 1, limit = 10) {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    Note.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Note.countDocuments({ userId }),
  ]);

  return {
    notes,
    pagination: {
      page,
      limit,
      totalNotes: total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getNoteById(userId, noteId) {
  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(noteId)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  const note = await Note.findById(noteId);

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  if (note.userId.toString() !== userId) {
    const error = new Error("You are not authorised to view this note");
    error.statusCode = 403;
    throw error;
  }

  return note;
}

export async function getNoteByContent(userId, content) {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  if (!content) {
    const error = new Error("Content is required");
    error.statusCode = 400;
    throw error;
  }

  const note = await Note.findOne({ userId, content });

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  return note;
}

export async function getNotesWithUser(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  const notes = await Note.find({ userId })
    .select("title userId createdAt")
    .populate("userId", "email");

  return notes;
}

export async function deleteAllNotes(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid id");
    error.statusCode = 400;
    throw error;
  }

  const result = await Note.deleteMany({ userId });
  return result;
}
