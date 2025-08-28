const request = require("supertest");
const app = require("../index");
const pool = require("../db/dbconn.js");
const bcrypt = require("bcrypt");
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

// REGISTER TEST
describe("POST /api/auth/create-account", () => {
    const userData = {
        id: 1,
        name: "Test",
        email: "test@test.com",
        createdat: "2025-07-21T10:34:10.701Z",
        password: "Test&Strong1",
        role: "user",
        newsletter: null,
    };

    const existingUser = {
        id: 2,
        name: "Exist",
        email: "exist@exist.com",
        createdat: "2025-07-21T10:34:10.701Z",
        password: "Test&Strong2",
        role: "user",
        newsletter: null,
    };

    // Happy path

    test("should return 400 if missing required fields", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app).post("/api/auth/create-account").set("Cookie", authToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Missing required fields");
    });

    test("should return 400 if email format is invalid", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [userData],
        });
        const res = await request(app)
            .post("/api/auth/create-account")
            .send({ ...userData, email: "not-an-email" }) // passing wrong email format
            .set("Cookie", authToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid email format");
    });

    test("should return 400 if password is weak", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [userData],
        });
        const res = await request(app)
            .post("/api/auth/create-account")
            .send({ ...userData, password: "azerty" }) // passing weak password
            .set("Cookie", authToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Password too weak. Must be at least 8 characters long, include 1 uppercase, 1 number, and 1 symbol");
    });

    test("should return 400 if email already exists", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [existingUser],
        });
        const res = await request(app)
            .post("/api/auth/create-account")
            .send({ ...userData, email: "exist@exist.com" }) // passing existing email adress
            .set("Cookie", authToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("email already exists");
    });

    test("should register user successfully", async () => {
        jest.spyOn(pool, "query")
            .mockResolvedValueOnce({ rows: [] }) // checking if email exist
            .mockResolvedValueOnce({ rows: [userData] }); // to insert new user

        // Mock bcrypt.hash to return a fake hashed password string
        jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed_password");

        const res = await request(app).post("/api/auth/create-account").send(userData).set("Cookie", authToken);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User registered successfully");

        // Optional: verify bcrypt.hash called with password and salt rounds 10
        expect(bcrypt.hash).toHaveBeenCalledWith("Test&Strong1", 10);
    });

    test("should return 500 if DB is down", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce(new Error("DB failure")); // Simulating error in DB
        // Mock bcrypt.hash to return a fake hashed password string
        jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed_password");
        const res = await request(app).post("/api/auth/create-account").send(userData).set("Cookie", authToken);
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Something went wrong");
    });
});

// LOGIN TEST
describe("POST /api/auth/login", () => {
    const userData = {
        id: 1,
        name: "Test",
        email: "test@test.com",
        createdat: "2025-07-21T10:34:10.701Z",
        password: "Test&Strong1",
        role: "user",
        newsletter: null,
    };
    // happy path
    test("should return 400 if missing required fields", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app).post("/api/auth/login").set("Cookie", authToken);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Email and password are required");
    });
    test("should return 401 if email is invalid", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({
            rows: [],
        });
        const res = await request(app)
            .post("/api/auth/login")
            .send({ ...userData, email: "wrong-email" }) // passing wrong email
            .set("Cookie", authToken);
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid credentials");
    });
    test("should return 401 if password is invalid", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce({ rows: [userData] }); // to insert new user

        // Mock bcrypt.hash to return a fake hashed password string
        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

        const res = await request(app).post("/api/auth/login").send(userData).set("Cookie", authToken);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid credentials");
    });
    test("should return 500 if DB is down", async () => {
        jest.spyOn(pool, "query").mockResolvedValueOnce(new Error("DB failure")); // Simulating error in DB
        const res = await request(app).post("/api/auth/login").send(userData).set("Cookie", authToken);
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Server error during login");
    });
});
// LOGOUT TEST
describe("POST /api/auth/logout", () => {
    test("should clear token cookie and return 200 on logout", async () => {
        const res = await request(app).post("/api/auth/logout");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Logged out successfully");

        // optional: check that cookie header is set to clear token
        expect(res.headers["set-cookie"]).toEqual(expect.arrayContaining([expect.stringContaining("token=;")]));
    });
});
