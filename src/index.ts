
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";

dotenv.config();

const app = express();

/* middleware */
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";

// mount routes BEFORE starting the server
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
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
