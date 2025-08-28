const request = require("supertest");
const app = require("../index");
const pool = require("../db/dbconn.js");
require("dotenv").config({ path: ".env.test" }); // to charge .env.test instead of default .env

// login to test private routes with admin role
let authToken;
beforeAll(async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PWD,
    });

    expect(loginResponse.statusCode).toBe(200);
    const cookies = loginResponse.headers["set-cookie"];
    expect(cookies).toBeDefined();

    authToken = cookies.find((cookie) => cookie.startsWith("token="));
});

beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks(); // reset mock calls before each test
});

describe("GET all contact request /api/contact/", () => {
    const contactData = {
        id: 1,
        name: "Test",
        email: "test@test.com",
        subject: "test",
        message: "test",
        submitted_at: "2025-07-24 18:59",
    };
    // Happy path
    test("should return success response", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [contactData],
        });
        const res = await request(app).get("/api/contact/").set("Cookie", authToken);
        expect(typeof res.body.data).toBe("object");
        expect(res.body.data).toBeDefined();
        expect(res.body.data[0]).toHaveProperty("id");
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe("application/json");
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("All contact requests retreived successfully");
    });
    // Sad path
    test("should return 500 if DB down", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure"));
        const res = await request(app).get("/api/contact/").set("Cookie", authToken);
        // This will only work if the DB is actually down or misconfigured
        // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
        expect(res.statusCode).toBe(500);
        expect(res.type).toMatch("application/json");
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Something went wrong");
    });
});
describe("GET a contact request by id /api/contact/:id", () => {
    const contactData = {
        id: 1,
        name: "Test",
        email: "test@test.com",
        subject: "test",
        message: "test",
        submitted_at: "2025-07-24 18:59",
    };
    // Happy path
    test("should return success response", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [contactData],
        });
        const res = await request(app).get(`/api/contact/${contactData.id}`).set("Cookie", authToken);
        expect(typeof res.body.data).toBe("object");
        expect(res.body.data).toBeDefined();
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe("application/json");
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Contact form found successfully");
    });
    // Sad path
    test("should return 500 if DB down", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure"));
        const res = await request(app).get(`/api/contact/${contactData.id}`).set("Cookie", authToken);
        // This will only work if the DB is actually down or misconfigured
        // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
        expect(res.statusCode).toBe(500);
        expect(res.type).toMatch("application/json");
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Something went wrong");
    });
    test("should return 404 if contact request not found", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app).get(`/api/contact/${contactData.id}`).set("Cookie", authToken);
        // This will only work if the DB is actually down or misconfigured
        // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
        expect(res.statusCode).toBe(404);
        expect(res.type).toMatch("application/json");
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Contact form not found");
    });
});
describe("POST create a contact request /api/contact/", () => {
    const contactData = {
        id: 1,
        name: "Test",
        email: "test@test.com",
        subject: "test",
        message: "test",
        submitted_at: "2025-07-24 18:59",
    };
    // Happy path
    test("should return success response", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [contactData],
        });
        const res = await request(app).post(`/api/contact/`).send(contactData).set("Cookie", authToken);
        expect(res.body.success).toBe(true);
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Contact form created successfully");
    });
    // Sad path
    test("should return 400 if missing required fields", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app).post("/api/contact");
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("All fields are required");
    });
    test("should return 400 if email format is invalid", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [contactData],
        });
        const res = await request(app)
            .post("/api/contact")
            .send({ ...contactData, email: "not-an-email" }) // passing wrong email format
            .set("Cookie", authToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid email format");
    });
    test("should return 500 if DB down", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure"));
        const res = await request(app).post(`/api/contact/`).send(contactData);
        // This will only work if the DB is actually down or misconfigured
        // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Something went wrong");
    });
});
describe("DELETE Deletes a contact request /api/contact/:id", () => {
    const contactData = {
        id: 1,
        name: "Test",
        email: "test@test.com",
        subject: "test",
        message: "test",
        submitted_at: "2025-07-24 18:59",
    };
    // Happy path
    test("should return 200 on successfull deletion", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [contactData],
        });
        const res = await request(app).delete(`/api/contact/${contactData.id}`).set("Cookie", authToken);
        expect(res.statusCode).toBe(200);
        expect(typeof res.body).toBe("object");
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Contact form deleted successfully");
    });
    // Sad path
    test("should return 500 when DB is down", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure")); // simulating failure
        const res = await request(app).delete(`/api/contact/${contactData.id}`).set("Cookie", authToken);
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Something went wrong");
    });
    test("should return 400 if contact request not found", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app).delete(`/api/contact/${contactData.id}`).set("Cookie", authToken);
        expect(res.statusCode).toBe(404);
        expect(typeof res.body).toBe("object");
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Contact form not found");
    });
});
