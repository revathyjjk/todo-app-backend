import mongoose from "mongoose";
import Note, { INote } from "../../models/notes.model";

describe("Note Model", () => {
  describe("Schema Validation", () => {
    it("should define the correct schema fields", () => {
      const schema = Note.schema;

      // Check that all required fields exist
      expect(schema.obj).toHaveProperty("user");
      expect(schema.obj).toHaveProperty("title");
      expect(schema.obj).toHaveProperty("completed");
    });

    it("should have user field as required", () => {
      const userField = Note.schema.obj.user;
      expect(userField.required).toBe(true);
    });

    it("should have title field as required", () => {
      const titleField = Note.schema.obj.title;
      expect(titleField.required).toBe(true);
    });

    it("should have completed field with default value of false", () => {
      const completedField = Note.schema.obj.completed;
      expect(completedField.default).toBe(false);
    });

    it("should have timestamps enabled", () => {
      const schema = Note.schema;
      expect(schema.options.timestamps).toBe(true);
    });

    it("should reference User model in user field", () => {
      const userField = Note.schema.obj.user;
      expect(userField.ref).toBe("User");
    });
  });

  describe("Note Document Creation", () => {
    it("should create a note instance", () => {
      const mockUserId = new mongoose.Types.ObjectId();
      const noteData: Partial<INote> = {
        user: mockUserId,
        title: "Test Note",
        completed: false,
      };

      const note = new Note(noteData);

      expect(note.user).toEqual(mockUserId);
      expect(note.title).toBe("Test Note");
      expect(note.completed).toBe(false);
    });

    it("should have default completed value as false", () => {
      const mockUserId = new mongoose.Types.ObjectId();
      const noteData = {
        user: mockUserId,
        title: "Test Note",
      };

      const note = new Note(noteData);

      expect(note.completed).toBe(false);
    });
  });

  describe("Model Methods", () => {
    it("should be a valid mongoose model", () => {
      expect(Note).toBeDefined();
      expect(Note.collection).toBeDefined();
      expect(Note.collection.name).toBe("notes");
    });

    it("should have Mongoose instance methods", () => {
      const mockUserId = new mongoose.Types.ObjectId();
      const note = new Note({
        user: mockUserId,
        title: "Test Note",
      });

      expect(typeof note.save).toBe("function");
      expect(typeof note.updateOne).toBe("function");
      expect(typeof note.deleteOne).toBe("function");
    });

    it("should have Mongoose static methods", () => {
      expect(typeof Note.find).toBe("function");
      expect(typeof Note.findOne).toBe("function");
      expect(typeof Note.findById).toBe("function");
      expect(typeof Note.findByIdAndUpdate).toBe("function");
      expect(typeof Note.findByIdAndDelete).toBe("function");
      expect(typeof Note.create).toBe("function");
    });
  });
});
