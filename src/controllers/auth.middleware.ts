import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: string };
    req.user = decoded.userId; // Add user ID to request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};