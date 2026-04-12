const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
  it("should signup a user", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
  });
});