const request = require("supertest");
const app = require("../index");
const pool = require("../db/dbconn");
const bcrypt = require("bcrypt");
const { Resend } = require("resend");
require("dotenv").config({ path: ".env.test" }); // to charge .env.test instead of default .env

// Mock the entire Resend module to prevent real emails
jest.mock("resend", () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: jest.fn().mockResolvedValue({ data: { id: "test-email-id" } }),
        },
    })),
}));

// login to test private routes with admin role
let authToken;
beforeAll(async () => {
    // Mock the database query for login
    jest.spyOn(pool, "query").mockResolvedValueOnce({
        rows: [
            {
                id: 1,
                name: "Test Admin",
                email: process.env.TEST_EMAIL,
                password: "hashed_password",
                role: "admin",
            },
        ],
    });

    // Mock bcrypt.compare to return true for login
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

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

describe("GET all blogs /api/blogs/", () => {
    // Happy path
    describe("When all blogs are received successfully", () => {
        test("should return success response", async () => {
            jest.spyOn(pool, "query").mockResolvedValueOnce({
                rows: [
                    {
                        id: 28,
                        title: "DUMMY 4",
                        content: "DUMMY 4",
                        category: "DUMMY 4",
                        model: "DUMMY 4",
                        brand: "DUMMY 4",
                        image_url: "",
                        created_at: "2025-07-23T22:00:00.000Z",
                        user_id: 4,
                        status: "draft",
                        last_updated: null,
                        summary: "",
                    },
                ],
            });
            const res = await request(app)
                .get("/api/blogs/")
                .set("Cookie", [`${authToken}`]);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data[0]).toHaveProperty("id");
            expect(res.statusCode).toBe(200);
            expect(res.type).toBe("application/json");
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("All blogs retreived successfully");
        });
    });

    describe("when database is down or disconnected", () => {
        // Sad path
        test("should return a status code 500", async () => {
            jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure"));
            const res = await request(app)
                .get("/api/blogs/")
                .set("Cookie", [`${authToken}`]);

            expect(res.statusCode).toBe(500);
            expect(res.type).toMatch("application/json");
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Something went wrong");
        });
    });
});
describe("GET draft blogs /api/blogs/draft", () => {
    // Happy path
    describe("When draft blogs are received successfully", () => {
        test("should return success response", async () => {
            jest.spyOn(pool, "query").mockResolvedValueOnce({
                rows: [
                    {
                        id: 28,
                        title: "DUMMY 4",
                        content: "DUMMY 4",
                        category: "DUMMY 4",
                        model: "DUMMY 4",
                        brand: "DUMMY 4",
                        image_url: "",
                        created_at: "2025-07-23T22:00:00.000Z",
                        user_id: 4,
                        status: "draft",
                        last_updated: null,
                        summary: "",
                    },
                ],
            });
            const res = await request(app)
                .get("/api/blogs/draft")
                .set("Cookie", [`${authToken}`]);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty("id");
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toBeDefined();
            expect(res.type).toBe("application/json");
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("All draft blogs retreived successfully");
        });
    });

    describe("when database is down or disconnected", () => {
        // Sad path
        test("should return a status code 500", async () => {
            jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure"));
            const res = await request(app).get("/api/blogs/draft");
            // This will only work if the DB is actually down or misconfigured
            // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
            expect(res.statusCode).toBe(500);
            expect(res.type).toMatch("application/json");
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Something went wrong");
        });
    });
});
describe("GET published blogs /api/blogs/published", () => {
    // Happy path
    describe("When published blogs are received successfully", () => {
        test("should return success response", async () => {
            jest.spyOn(pool, "query").mockResolvedValueOnce({
                rows: [
                    {
                        id: 28,
                        title: "DUMMY 4",
                        content: "DUMMY 4",
                        category: "DUMMY 4",
                        model: "DUMMY 4",
                        brand: "DUMMY 4",
                        image_url: "",
                        created_at: "2025-07-23T22:00:00.000Z",
                        user_id: 4,
                        status: "published",
                        last_updated: null,
                        summary: "",
                    },
                ],
            });
            const res = await request(app).get("/api/blogs/published");
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0]).toHaveProperty("id");
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toBeDefined();
            expect(res.type).toBe("application/json");
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("All published blogs retreived successfully");
        });
    });

    describe("when database is down or disconnected", () => {
        // Sad path
        test("should return a status code 500", async () => {
            jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure")); // simulating failure
            const res = await request(app).get("/api/blogs/published");
            // This will only work if the DB is actually down or misconfigured
            // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
            expect(res.statusCode).toBe(500);
            expect(res.type).toMatch("application/json");
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Something went wrong");
        });
    });
});
describe("GET details of a blog /api/blogs/:id", () => {
    const blogData = {
        id: 28,
        title: "DUMMY 4",
        content: "DUMMY 4",
        category: "DUMMY 4",
        model: "DUMMY 4",
        brand: "DUMMY 4",
        image_url: "",
        created_at: "2025-07-23T22:00:00.000Z",
        user_id: 4,
        status: "published",
        last_updated: null,
        summary: "",
    };
    // Happy path
    test("should return success response", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [blogData],
        });
        const res = await request(app).get(`/api/blogs/${blogData.id}`);
        expect(typeof res.body.data).toBe("object");
        expect(res.body.data).toHaveProperty("id");
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Blog found successfully");
    });
    // Sad path
    test("should return a status code 500", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure")); // simulating failure
        const res = await request(app).get(`/api/blogs/${blogData.id}`);
        // This will only work if the DB is actually down or misconfigured
        // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Something went wrong");
    });
    test("should return success response", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const id = 1;
        const res = await request(app).get(`/api/blogs/${id}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Blog not found");
    });
});
describe("PUT update a blog /api/blogs/:id", () => {
    const blogData = {
        id: 25,
        title: "tEST",
        content: "tEST",
        category: "Test",
        model: "test",
        brand: "Test",
        image_url: "",
        user_id: 5,
        status: "published",
        last_updated: new Date().toISOString(),
    };
    // Happy path
    test("should return success response", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [blogData],
        });

        const res = await request(app).put(`/api/blogs/${blogData.id}`).send(blogData).set("Cookie", authToken);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(typeof res.body.data).toBe("object");
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Blog updated successfully");
    });
    // Sad path
    test("should return a status code 500 when db is down", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure"));
        const res = await request(app).put(`/api/blogs/${blogData.id}`).send(blogData).set("Cookie", authToken);

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Something went wrong");
        expect(res.body.error).toBeDefined();
    });
    test("should return 404 for blog not found", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app).put(`/api/blogs/${blogData.id}`).send(blogData).set("Cookie", authToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Blog not found");
    });
    test("should return 400 if blog doesn't exist", async () => {
        const foreignKeyError = new Error("Foreign key violation");
        foreignKeyError.code = "23503"; // Postgres foreign key violation code

        jest.spyOn(pool, "query").mockRejectedValueOnce(foreignKeyError);
        const res = await request(app).put(`/api/blogs/${blogData.id}`).send(blogData).set("Cookie", authToken);
        expect(res.body.message).toBe("Invalid user_id: user doesnt exist");
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });
});
describe("POST create a blog /api/blogs/", () => {
    const blogData = {
        title: "tEST",
        content: "tEST",
        category: "Test",
        model: "test",
        brand: "Test",
        image_url: "",
        user_id: 5,
        status: "draft",
    };
    // Happy path
    describe("When a blog is created successfully", () => {
        test("should return success response", async () => {
            jest.spyOn(pool, "query").mockResolvedValueOnce({
                rows: [blogData],
            });
            const res = await request(app)
                .post(`/api/blogs/`)
                .send(blogData)
                .set("Cookie", [`${authToken}`]);
            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Blog created successfully");
        });
    });

    describe("when database is down or disconnected", () => {
        // Sad path
        test("should return a status code 500", async () => {
            jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure"));
            const res = await request(app)
                .post(`/api/blogs/`)
                .send(blogData)
                .set("Cookie", [`${authToken}`]);
            // This will only work if the DB is actually down or misconfigured
            // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Something went wrong");
        });
        test("should return 400 for FK violation", async () => {
            const foreignKeyError = new Error("Foreign key violation");
            foreignKeyError.code = "23503"; // Postgres foreign key violation code

            jest.spyOn(pool, "query").mockRejectedValueOnce(foreignKeyError);
            const res = await request(app).post("/api/blogs/").send(blogData).set("Cookie", authToken);
            expect(res.body.message).toBe("Invalid user_id: user doesnt exist");
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
describe("DELETE Deletes a blog /api/blogs/:id", () => {
    const blogData = {
        id: 28,
        title: "DUMMY 4",
        content: "DUMMY 4",
        category: "DUMMY 4",
        model: "DUMMY 4",
        brand: "DUMMY 4",
        image_url: "",
        created_at: "2025-07-23T22:00:00.000Z",
        user_id: 4,
        status: "published",
        last_updated: null,
        summary: "",
    };
    // Happy path
    test("should return success response", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [blogData],
        });
        const res = await request(app).delete(`/api/blogs/${blogData.id}`).set("Cookie", authToken);
        expect(res.statusCode).toBe(200);
        expect(typeof res.body).toBe("object");
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Blog deleted successfully");
    });
    // Sad path
    test("should return a status code 500", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure")); // simulating failure
        const res = await request(app).delete(`/api/blogs/${blogData.id}`).set("Cookie", authToken);
        // This will only work if the DB is actually down or misconfigured
        // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Something went wrong");
    });
    test("should return 404 if blog not found", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app).delete(`/api/blogs/${blogData.id}`).set("Cookie", authToken);
        expect(res.statusCode).toBe(404);
        expect(typeof res.body).toBe("object");
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Blog not found");
    });
});
