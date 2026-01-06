// routes/notes.routes.ts
import { Router } from "express";

const router = Router();

// In a real app, replace with Mongo model
let notes: any[] = [];
let nextId = 1;

router.get("/notes", (req, res) => {
  res.json(notes);
});

router.post("/notes", (req, res) => {
  const { title, completed } = req.body;
  const note = { id: nextId++, title, completed: !!completed };
  notes.push(note);
  res.status(201).json(note);
});

router.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((n) => n.id !== id);
  res.status(204).end();
});

export default router;
