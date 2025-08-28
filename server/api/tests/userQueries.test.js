const request = require("supertest");
const app = require("../index");
const pool = require("../db/dbconn.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    jest.clearAllMocks;
    jest.restoreAllMocks(); // reset mock calls before each test
});

describe("GET all users /api/users/", () => {
    // Happy path
    describe("When all users are received successfully", () => {
        test("should return success response", async () => {
            jest.spyOn(pool, "query").mockResolvedValueOnce({
                rows: [
                    {
                        id: 3,
                        name: "Test",
                        email: "test@test.com",
                        createdat: "2025-07-21T10:34:10.701Z",
                        password: "test",
                        role: "user",
                        newsletter: null,
                    },
                ],
            });
            const res = await request(app)
                .get("/api/users/")
                .set("Cookie", [`${authToken}`]);
            expect(typeof res.body.data).toBe("object");
            expect(res.body.data).toBeDefined();
            expect(res.body.data[0]).toHaveProperty("id");
            expect(res.statusCode).toBe(200);
            expect(res.type).toBe("application/json");
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("All users retreived successfully");
        });
    });

    describe("when database is down or disconnected", () => {
        // Sad path
        test("should return a status code 500", async () => {
            jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure"));
            const res = await request(app)
                .get("/api/users/")
                .set("Cookie", [`${authToken}`]);
            // This will only work if the DB is actually down or misconfigured
            // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
            expect(res.statusCode).toBe(500);
            expect(res.type).toMatch("application/json");
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Failed to retreive users");
        });
    });
});
describe("GET details of a user /api/users/:id", () => {
    const userData = {
        id: 3,
        name: "Test",
        email: "test@test.com",
        createdat: "2025-07-21T10:34:10.701Z",
        password: "test",
        role: "user",
        newsletter: null,
    };
    // Happy path
    test("should return success response", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [userData],
        });
        const id = 3;
        const res = await request(app)
            .get(`/api/users/${id}`)
            .set("Cookie", [`${authToken}`]);
        expect(res.body.data).toBeDefined();
        expect(res.body.data).toHaveProperty("id");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User found successfully");
    });
    // Sad path
    test("should return a status code 500", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure")); // simulating failure
        const res = await request(app).get(`/api/users/${userData.id}`).set("Cookie", authToken);
        // This will only work if the DB is actually down or misconfigured
        // To test manually: change DB_NAME, DB_HOST, etc in .env temporarily
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Something went wrong");
    });
    test("should return 404 if user not found", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app).get(`/api/users/${userData.id}`).set("Cookie", authToken);
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");
    });
});
describe("GET current user /api/users/me", () => {
    test("should return logged-in user info", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [
                {
                    id: 3,
                    name: "Test",
                    email: "test@test.com",
                    createdat: "2025-07-21T10:34:10.701Z",
                    password: "test",
                    role: "user",
                    newsletter: null,
                },
            ],
        });

        const res = await request(app).get("/api/users/me").set("Cookie", [authToken]);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toMatchObject({ id: 3, email: "test@test.com" });
    });
    test("should return 401 if no token is present", async () => {
        const res = await request(app).get("/api/users/me");
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Access token missing");
    });
    test("should return 404 if user in token is not found", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get("/api/users/me").set("Cookie", [authToken]);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");
    });
    test("should return 500 on DB error", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB error"));

        const res = await request(app).get("/api/users/me").set("Cookie", [authToken]);

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("Server error");
    });
});
describe("PUT update current user /api/users/me", () => {
    const userData = {
        id: 1,
        name: "Test",
        email: "test@test.com",
        password: "testpwd",
    };
    const updatedUserData = {
        id: 1,
        name: "Test",
        email: "updated@example.com",
        password: "NewPassword1!",
    };
    // Happy path
    test("Should return 200 on succes", async () => {
        jest.spyOn(pool, "query")
            .mockResolvedValueOnce({ rows: [] }) // Looks in DB if email already exists
            .mockResolvedValueOnce({ rows: [userData] }) // Looks in DB if user exist using user_id
            .mockResolvedValueOnce({ rows: [] }); // actual update of DB
        // these three functions have to be tested together because there are all part of the same try{}catch{}
        const res = await request(app).put("/api/users/me").send(updatedUserData).set("Cookie", authToken);
        expect(res.body.message).toBe("User updated successfully");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
    // Sad path
    test("Should return 500 on error", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce(new Error("DB failure")); // Simulating error in DB
        const res = await request(app).put("/api/users/me").send(updatedUserData).set("Cookie", authToken);
        expect(res.body.message).toBe("Something went wrong");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
    test("Should return 401 if token is missing", async () => {
        const res = await request(app).put("/api/users/me").send(userData);
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Access token missing");
    });
    test("Should return 403 if token expired", async () => {
        const expiredToken = jwt.sign({ email: process.env.TEST_EMAIL, password: process.env.TEST_PWD }, process.env.JWT_SECRET, {
            expiresIn: "-12s",
        });
        const res = await request(app)
            .put("/api/users/me")
            .send(userData)
            .set("Cookie", [`token=${expiredToken}`]);
        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid or expired token");
    });
    test("Should return 400 if fields are empty", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [updatedUserData],
        });
        const res = await request(app).put("/api/users/me").send().set("Cookie", authToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Missing required fields");
    });
    test("Should return 400 if email format is wrong", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app)
            .put("/api/users/me")
            .send({ ...updatedUserData, email: "not-an-email" }) // sending rubbish email
            .set("Cookie", authToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid email format");
    });
    test("Should return 400 if email already exists", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [userData],
        });
        const res = await request(app)
            .put("/api/users/me")
            .send({ ...updatedUserData, email: "test@test.com" }) // sending rubbish email
            .set("Cookie", authToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("email already exists");
    });
    test("Should return 404 if user not found", async () => {
        jest.spyOn(pool, "query")
            .mockResolvedValueOnce({ rows: [] }) // First SELECT: no email found
            .mockResolvedValueOnce({ rows: [] }); // Second SELECT: user not found

        const res = await request(app)
            .put("/api/users/me")
            .send({ ...updatedUserData, id: 0 })
            .set("Cookie", authToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");
    });
    test("Should return 400 if weak password", async () => {
        jest.spyOn(pool, "query")
            .mockResolvedValueOnce({ rows: [] }) // email doesn't exist
            .mockResolvedValueOnce({
                rows: [userData], // user exists by id
            });
        const res = await request(app)
            .put("/api/users/me")
            .send({ ...updatedUserData, password: "azerty" }) // sending weak password
            .set("Cookie", authToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Password too weak. Must be at least 8 characters long, include 1 uppercase, 1 number, and 1 symbol");
    });
});
describe("DELETE current user /api/users/me", () => {
    const userData = {
        id: 3,
        name: "Test",
        email: "test@test.com",
        createdat: "2025-07-21T10:34:10.701Z",
        password: "test",
        role: "user",
        newsletter: null,
    };
    // Happy path
    test("should return logged-in user info", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [userData],
        });

        const res = await request(app).delete("/api/users/me").set("Cookie", [authToken]);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User deleted successfully");
    });
    // Sad Path
    test("Should return 500 if DB is down", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("DB failure"));
        const res = await request(app).delete("/api/users/me").set("Cookie", authToken);
        expect(res.body.message).toBe("Error deleting user");
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
    test("Should return 401 if token is missing", async () => {
        const res = await request(app).delete("/api/users/me");
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Access token missing");
    });
    test("Should return 401 if token is invalid or expired", async () => {
        const expiredToken = jwt.sign({ email: process.env.TEST_EMAIL, password: process.env.TEST_PWD }, process.env.JWT_SECRET, {
            expiresIn: "-12s",
        });
        const res = await request(app)
            .delete("/api/users/me")
            .set("Cookie", [`token=${expiredToken}`]);
        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid or expired token");
        // you might want to check the exact message here depending on your implementation
    });
    test("should return 404 if user not found", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app).delete("/api/users/me").set("Cookie", authToken);
        expect(res.statusCode).toBe(404);
        expect(typeof res.body).toBe("object");
        expect(res.body.message).toBe("This ID does not exist");
        expect(res.body.success).toBe(false);
    });
});

describe("PUT update newsletter preference /api/users/:id/newsletter", () => {
    const userData = {
        id: 3,
        name: "Test",
        email: "test@test.com",
        createdat: "2025-07-21T10:34:10.701Z",
        password: "test",
        role: "user",
        newsletter: false,
    };

    // Happy path
    test("should update newsletter preference successfully", async () => {
        jest.spyOn(pool, "query")
            .mockResolvedValueOnce({ rows: [userData] }) // User exists
            .mockResolvedValueOnce({ rows: [] }); // Update successful

        const res = await request(app).put("/api/users/3/newsletter").send({ newsletter: true }).set("Cookie", authToken);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Newsletter preference updated successfully");
        expect(res.body.data).toHaveProperty("userId", "3");
        expect(res.body.data).toHaveProperty("newsletter", true);
    });

    // Sad path
    test("should return 404 if user not found", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({ rows: [] }); // User doesn't exist

        const res = await request(app).put("/api/users/999/newsletter").send({ newsletter: true }).set("Cookie", authToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");
    });

    test("should return 500 if database error occurs", async () => {
        jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("Database connection failed"));

        const res = await request(app).put("/api/users/3/newsletter").send({ newsletter: false }).set("Cookie", authToken);

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Failed to update newsletter preference");
        expect(res.body.error).toBe("Database connection failed");
    });

    test("should return 401 if token is missing", async () => {
        const res = await request(app).put("/api/users/3/newsletter").send({ newsletter: true });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Access token missing");
    });
});
