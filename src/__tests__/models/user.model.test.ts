/// <reference types="jest" />
import mongoose from "mongoose";
import User from "../../models/User";

describe("User Model", () => {
  describe("Schema Validation", () => {
    it("should define the correct schema fields", () => {
      const schema = User.schema;

      expect(schema.obj).toHaveProperty("name");
      expect(schema.obj).toHaveProperty("email");
      expect(schema.obj).toHaveProperty("password");
    });

    it("should have name field as required", () => {
      const nameField = User.schema.obj.name as any;
      expect(nameField?.required).toBe(true);
    });

    it("should have email field as required", () => {
      const emailField = User.schema.obj.email as any;
      expect(emailField).toBeDefined();
      expect(emailField?.required).toBe(true);
    });

    it("should have email field as unique", () => {
      const emailField = User.schema.obj.email as any;
      expect(emailField).toBeDefined();
      expect(emailField.unique).toBe(true);
    });

    it("should have password field as required", () => {
      const passwordField = User.schema.obj.password as any;
      expect(passwordField?.required).toBe(true);
    });

    it("should have timestamps enabled", () => {
      const schema = User.schema;
      expect(schema.options.timestamps).toBe(true);
    });
  });

  describe("User Document Creation", () => {
    it("should create a user instance", () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword123",
      };

      const user = new User(userData);

      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john@example.com");
      expect(user.password).toBe("hashedPassword123");
    });
  });

  describe("Model Methods", () => {
    it("should be a valid mongoose model", () => {
      expect(User).toBeDefined();
      expect(User.collection).toBeDefined();
      expect(User.collection.name).toBe("users");
    });

    it("should have Mongoose instance methods", () => {
      const user = new User({
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword123",
      });

      expect(typeof user.save).toBe("function");
      expect(typeof user.updateOne).toBe("function");
      expect(typeof user.deleteOne).toBe("function");
    });

    it("should have Mongoose static methods", () => {
      expect(typeof User.find).toBe("function");
      expect(typeof User.findOne).toBe("function");
      expect(typeof User.findById).toBe("function");
      expect(typeof User.findByIdAndUpdate).toBe("function");
      expect(typeof User.findByIdAndDelete).toBe("function");
      expect(typeof User.create).toBe("function");
    });
  });
});
