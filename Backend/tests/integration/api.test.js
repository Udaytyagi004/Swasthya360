import { jest } from "@jest/globals";
import request from "supertest";



jest.unstable_mockModule("../../src/db/connection.js", () => ({
  default: jest.fn(() => Promise.resolve()),
}));

// Mock middleware
jest.unstable_mockModule("../../src/api/middlewares/auth.middleware.js", () => ({
  default: (req, res, next) => next(),
}));

// Mock controllers
jest.unstable_mockModule("../../src/api/controllers/auth.controller.js", () => ({
  signup: jest.fn((req, res) =>
    res.status(201).json({ message: "User created" })
  ),
  login: jest.fn((req, res) =>
    res.status(200).json({ token: "fake_token" })
  ),
  logout: jest.fn((req, res) =>
    res.status(200).json({ message: "Logged out" })
  ),
}));

jest.unstable_mockModule("../../src/api/controllers/health.controller.js", () => ({
  default: jest.fn((req, res) =>
    res.status(200).json({ status: "healthy" })
  ),
}));

jest.unstable_mockModule("../../src/api/controllers/user.controller.js", () => ({
  default: jest.fn((req, res) =>
    res.status(200).json({ user: "testUser" })
  ),
}));



const { default: app } = await import("../../src/index.js");



describe("API Routes", () => {

  describe("Auth Routes", () => {
    test("POST /auth/signup", async () => {
      const res = await request(app).post("/auth/signup").send({
        email: "test@test.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("User created");
    });

    test("POST /auth/login", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "test@test.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    test("POST /auth/logout", async () => {
      const res = await request(app).post("/auth/logout");

      expect(res.statusCode).toBe(200);
    });
  });


  describe("Health Routes", () => {
    test("POST /health/services", async () => {
      const res = await request(app)
        .post("/health/services")
        .send({ symptoms: ["fever"], severity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("healthy");
    });
  });


  describe("User Routes", () => {
    test("GET /user/me", async () => {
      const res = await request(app).get("/user/me");

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBe("testUser");
    });
  });

});