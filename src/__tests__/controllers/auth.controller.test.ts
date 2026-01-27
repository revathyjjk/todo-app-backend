import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { register, login } from "../../controllers/auth.controller";
import User from "../../models/User";

jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonFn: jest.Mock;
  let mockStatusFn: jest.Mock;

  beforeEach(() => {
    mockJsonFn = jest.fn().mockReturnValue(undefined);
    mockStatusFn = jest.fn().mockReturnValue({
      json: mockJsonFn,
    });

    mockRequest = {};
    mockResponse = {
      status: mockStatusFn,
      json: mockJsonFn,
    };

    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return 400 if required fields are missing", async () => {
      mockRequest.body = { email: "test@example.com" }; // missing name and password

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "All fields required",
      });
    });

    it("should return 400 if user already exists", async () => {
      mockRequest.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "123",
        email: "john@example.com",
      });

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "User already exists",
      });
    });

    it("should successfully register a new user", async () => {
      mockRequest.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      const mockHashedPassword = "hashedPassword123";
      const mockUser = {
        _id: "userId123",
        name: "John Doe",
        email: "john@example.com",
        password: mockHashedPassword,
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      await register(mockRequest as Request, mockResponse as Response);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(User.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: mockHashedPassword,
      });
      expect(mockStatusFn).toHaveBeenCalledWith(201);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Registered successfully",
        user: {
          id: "userId123",
          name: "John Doe",
          email: "john@example.com",
        },
      });
    });

    it("should return 500 on server error", async () => {
      mockRequest.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("login", () => {
    it("should return 400 if user does not exist", async () => {
      mockRequest.body = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return 400 if password does not match", async () => {
      mockRequest.body = {
        email: "john@example.com",
        password: "wrongpassword",
      };

      const mockUser = {
        _id: "userId123",
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword123",
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(mockRequest as Request, mockResponse as Response);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        "hashedPassword123"
      );
      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should successfully login user and return token", async () => {
      mockRequest.body = {
        email: "john@example.com",
        password: "password123",
      };

      const mockUser = {
        _id: "userId123",
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword123",
      };

      const mockToken = "jwt.token.here";

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      process.env.JWT_SECRET = "test-secret";

      await login(mockRequest as Request, mockResponse as Response);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "userId123" },
        "test-secret",
        { expiresIn: "7d" }
      );
      expect(mockJsonFn).toHaveBeenCalledWith({
        token: mockToken,
        user: {
          id: "userId123",
          name: "John Doe",
          email: "john@example.com",
        },
      });
    });

    it("should return 500 on server error", async () => {
      mockRequest.body = {
        email: "john@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
});
