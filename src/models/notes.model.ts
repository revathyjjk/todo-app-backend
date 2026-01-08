import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
}

const NoteSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<INote>("Note", NoteSchema);