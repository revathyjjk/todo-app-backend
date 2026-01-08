import { Request, Response } from "express";
import Note from "../models/notes.model";

export const getNotes = async (req: any, res: Response) => {
  try {
    // Only find notes belonging to the authenticated user
    const notes = await Note.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createNote = async (req: any, res: Response) => {
  try {
    const { title } = req.body;
    const newNote = new Note({
      title,
      user: req.user // Attached by our middleware
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Error creating note" });
  }
};

export const updateNote = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Find note by ID AND ensure it belongs to the current user
    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user },
      { title, completed },
      { new: true } // Return the updated document
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error updating note" });
  }
};

export const deleteNote = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    // Ensure user owns the note before deleting
    const note = await Note.findOneAndDelete({ _id: id, user: req.user });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note" });
  }
};
