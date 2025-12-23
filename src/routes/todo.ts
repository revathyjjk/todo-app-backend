import { Router, type Request, Response } from "express";
import Todo, { ITodo } from "../models/Todo";

const router = Router();

/**
 * GET /api/todos
 * Get all todos
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const todos: ITodo[] = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

/**
 * GET /api/todos/:id
 * Get a single todo by id
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

/**
 * POST /api/todos
 * Create a new todo
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, completed } = req.body as {
      title?: string;
      completed?: boolean;
    };

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const todo = await Todo.create({ title, completed });
    res.status(201).json(todo);
  } catch {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

/**
 * PUT /api/todos/:id
 * Full update
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, completed } = req.body as {
      title?: string;
      completed?: boolean;
    };

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch {
    res.status(400).json({ error: "Failed to update todo" });
  }
});

/**
 * PATCH /api/todos/:id
 * Partial update
 */
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const updates = req.body as Partial<ITodo>;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch {
    res.status(400).json({ error: "Failed to update todo" });
  }
});

/**
 * DELETE /api/todos/:id
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch {
    res.status(400).json({ error: "Failed to delete todo" });
  }
});

export default router;  