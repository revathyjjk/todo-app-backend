# Unit Testing Guide for Todo App Backend

## Overview
This guide explains the unit testing setup for the todo-app-backend project using Jest.

## Setup

### Installed Dependencies
- **jest** - Testing framework
- **@types/jest** - TypeScript types for Jest
- **ts-jest** - TypeScript support for Jest
- **supertest** - HTTP assertion library
- **@types/supertest** - TypeScript types for supertest

### Configuration
Jest is configured in `jest.config.js` with the following settings:
- Preset: `ts-jest` (for TypeScript support)
- Test environment: `node`
- Test files pattern: `**/__tests__/**/*.test.ts` and `**/?(*.)+(spec|test).ts`

## Running Tests

### Commands
```bash
# Run all tests once
npm test

# Run tests in watch mode (rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### Authentication Tests (`src/__tests__/controllers/auth.controller.test.ts`)

#### Register Endpoint Tests
- ✅ Returns 400 when required fields are missing
- ✅ Returns 400 when user already exists
- ✅ Successfully registers a new user with hashed password
- ✅ Returns 500 on server error

#### Login Endpoint Tests
- ✅ Returns 400 if user does not exist
- ✅ Returns 400 if password is incorrect
- ✅ Successfully logs in user and returns JWT token
- ✅ Returns 500 on server error

### Notes Controller Tests (`src/__tests__/controllers/notes.controller.test.ts`)

#### getNotes Tests
- ✅ Retrieves all notes for authenticated user
- ✅ Returns empty array when user has no notes
- ✅ Returns 500 on server error

#### createNote Tests
- ✅ Creates a new note successfully
- ✅ Returns 500 on error

#### updateNote Tests
- ✅ Updates a note successfully
- ✅ Returns 404 if note not found or unauthorized
- ✅ Returns 500 on server error

#### deleteNote Tests
- ✅ Deletes a note successfully
- ✅ Returns 404 if note not found or unauthorized
- ✅ Returns 500 on server error

### Model Tests

#### User Model (`src/__tests__/models/user.model.test.ts`)
- Schema validation (all fields required)
- Email uniqueness
- Timestamps functionality
- Mongoose methods availability

#### Note Model (`src/__tests__/models/notes.model.test.ts`)
- Schema validation
- Field requirements and defaults
- User reference
- Timestamps functionality
- Mongoose methods availability

## Mocking Strategy

### Controllers
Controllers are tested using mocks for:
- **Express Request/Response** - Mock objects that simulate HTTP interactions
- **Database Models** - `jest.mock()` prevents actual database calls
- **External Libraries** - bcryptjs and jsonwebtoken are mocked

### Example Mocking
```typescript
// Mock a model
jest.mock("../../models/User");

// Mock bcrypt
jest.mock("bcryptjs");

// Create mock Request/Response
let mockRequest: Partial<Request> = { body: {} };
let mockResponse: Partial<Response> = { 
  status: jest.fn().mockReturnValue({
    json: jest.fn()
  })
};
```

## Writing New Tests

### Controller Test Template
```typescript
import { Request, Response } from "express";
import { yourFunction } from "../../controllers/yourController";
import Model from "../../models/YourModel";

jest.mock("../../models/YourModel");

describe("Your Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = { body: {}, params: {} };
    mockResponse = {
      status: jest.fn().mockReturnValue({
        json: jest.fn()
      })
    };
    jest.clearAllMocks();
  });

  it("should test specific behavior", async () => {
    // Arrange
    mockRequest.body = { /* test data */ };
    (Model.findOne as jest.Mock).mockResolvedValue(/* mock return */);

    // Act
    await yourFunction(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(Model.findOne).toHaveBeenCalledWith(/* expected params */);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});
```

## Coverage Goals

Current test coverage focuses on:
- ✅ Happy path scenarios
- ✅ Error handling
- ✅ Input validation
- ✅ Authorization checks

### To Improve Coverage
1. Add integration tests for API routes
2. Add database-level validation tests
3. Test edge cases (empty inputs, special characters, etc.)
4. Add performance/load tests

## Best Practices

1. **Use beforeEach** - Reset mocks before each test
2. **Mock external dependencies** - Don't call real APIs/databases
3. **Test one thing per test** - Keep tests focused
4. **Use descriptive test names** - Should read like documentation
5. **Arrange-Act-Assert** - Structure tests clearly
6. **Test behavior, not implementation** - Focus on what the function does

## Debugging Tests

### Run Single Test File
```bash
npm test -- auth.controller.test.ts
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="register"
```

### Enable Detailed Output
```bash
npm test -- --verbose
```

### Debug with Node Inspector
```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Tests timeout | Increase Jest timeout: `jest.setTimeout(10000)` |
| Async test hangs | Ensure all promises are awaited |
| Mock not working | Check that mock is defined BEFORE import |
| Process.env undefined | Mock environment variables in test |

## Next Steps

1. ✅ Run `npm test` to verify setup
2. ✅ Review test files for examples
3. ✅ Create additional tests for new features
4. ✅ Monitor coverage with `npm run test:coverage`
5. ✅ Integrate tests into CI/CD pipeline

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
