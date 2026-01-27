import { Request, Response } from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../../controllers/notes.controller";
import Note from "../../models/notes.model";

jest.mock("../../models/notes.model");

describe("Notes Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonFn: jest.Mock;
  let mockStatusFn: jest.Mock;
  const mockUserId = "userId123";

  beforeEach(() => {
    mockJsonFn = jest.fn().mockReturnValue(undefined);
    mockStatusFn = jest.fn().mockReturnValue({
      json: mockJsonFn,
    });

    mockRequest = {
      user: mockUserId,
      params: {},
      body: {},
    } as any;
    mockResponse = {
      status: mockStatusFn,
      json: mockJsonFn,
    };

    jest.clearAllMocks();
  });

  describe("getNotes", () => {
    it("should retrieve all notes for the authenticated user", async () => {
      const mockNotes = [
        {
          _id: "note1",
          title: "Test Note 1",
          completed: false,
          user: mockUserId,
        },
        {
          _id: "note2",
          title: "Test Note 2",
          completed: true,
          user: mockUserId,
        },
      ];

      (Note.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockNotes),
      });

      await getNotes(mockRequest, mockResponse as Response);

      expect(Note.find).toHaveBeenCalledWith({ user: mockUserId });
      expect(mockJsonFn).toHaveBeenCalledWith(mockNotes);
    });

    it("should return empty array when user has no notes", async () => {
      (Note.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      await getNotes(mockRequest, mockResponse as Response);

      expect(mockJsonFn).toHaveBeenCalledWith([]);
    });

    it("should return 500 on server error", async () => {
      (Note.find as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      await getNotes(mockRequest, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({ message: "Server Error" });
    });
  });

  describe("createNote", () => {
    it("should create a new note successfully", async () => {
      mockRequest.body = { title: "New Note" };

      const mockNewNote = {
        _id: "note123",
        title: "New Note",
        completed: false,
        user: mockUserId,
        save: jest.fn().mockResolvedValue(undefined),
      };

      (Note as jest.MockedClass<typeof Note>).mockImplementation(
        () => mockNewNote as any
      );

      await createNote(mockRequest, mockResponse as Response);

      expect(Note).toHaveBeenCalledWith({
        title: "New Note",
        user: mockUserId,
      });
      expect(mockNewNote.save).toHaveBeenCalled();
      expect(mockStatusFn).toHaveBeenCalledWith(201);
      expect(mockJsonFn).toHaveBeenCalledWith(mockNewNote);
    });

    it("should return 500 on error", async () => {
      mockRequest.body = { title: "New Note" };

      (Note as jest.MockedClass<typeof Note>).mockImplementation(() => {
        throw new Error("Error creating note");
      });

      await createNote(mockRequest, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Error creating note",
      });
    });
  });

  describe("updateNote", () => {
    it("should update a note successfully", async () => {
      mockRequest.params = { id: "note123" };
      mockRequest.body = { title: "Updated Title", completed: true };

      const mockUpdatedNote = {
        _id: "note123",
        title: "Updated Title",
        completed: true,
        user: mockUserId,
      };

      (Note.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedNote);

      await updateNote(mockRequest, mockResponse as Response);

      expect(Note.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "note123", user: mockUserId },
        { title: "Updated Title", completed: true },
        { new: true }
      );
      expect(mockJsonFn).toHaveBeenCalledWith(mockUpdatedNote);
    });

    it("should return 404 if note not found or unauthorized", async () => {
      mockRequest.params = { id: "nonexistent" };
      mockRequest.body = { title: "Updated Title", completed: true };

      (Note.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateNote(mockRequest, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Note not found or unauthorized",
      });
    });

    it("should return 500 on server error", async () => {
      mockRequest.params = { id: "note123" };
      mockRequest.body = { title: "Updated Title", completed: true };

      (Note.findOneAndUpdate as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await updateNote(mockRequest, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Error updating note",
      });
    });
  });

  describe("deleteNote", () => {
    it("should delete a note successfully", async () => {
      mockRequest.params = { id: "note123" };

      const mockDeletedNote = {
        _id: "note123",
        title: "Deleted Note",
        completed: false,
        user: mockUserId,
      };

      (Note.findOneAndDelete as jest.Mock).mockResolvedValue(mockDeletedNote);

      await deleteNote(mockRequest, mockResponse as Response);

      expect(Note.findOneAndDelete).toHaveBeenCalledWith({
        _id: "note123",
        user: mockUserId,
      });
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Note deleted successfully",
      });
    });

    it("should return 404 if note not found or unauthorized", async () => {
      mockRequest.params = { id: "nonexistent" };

      (Note.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteNote(mockRequest, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Note not found or unauthorized",
      });
    });

    it("should return 500 on server error", async () => {
      mockRequest.params = { id: "note123" };

      (Note.findOneAndDelete as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await deleteNote(mockRequest, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Error deleting note",
      });
    });
  });
});
