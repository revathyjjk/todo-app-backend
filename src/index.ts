import express, { type Application, type Request, type Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo";

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/todos", todoRoutes);
// Health check
app.get("/", (req: Request, res: Response) => {
    res.json({ status: "OK", message: "Todo API running" });
});
// Connect to Mongo and start server
if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set in .env");
    process.exit(1);
}
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((err: unknown) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });
    app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
