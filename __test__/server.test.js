const { app } = require('../src/server/server');
const request = require('supertest');

describe("Test the root path", () => {
    test("It should response the GET method", async () => {
      const response = await request(app).get("/getData");
      expect(response.statusCode).toBe(200);
    });
  });