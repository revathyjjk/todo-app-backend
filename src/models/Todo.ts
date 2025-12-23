import { Schema, model, Document } from "mongoose";
export interface ITodo extends Document {
    title: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const todoSchema = new Schema<ITodo>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true });
const Todo = model<ITodo>("Todo", todoSchema);
export default Todo;








