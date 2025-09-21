const request = require("supertest");
const app = require("../index");
const pool = require("../db/dbconn");
const { Resend } = require("resend");

// Mock the Resend module
jest.mock("resend", () => {
    return {
        Resend: jest.fn().mockImplementation(() => ({
            emails: {
                send: jest.fn().mockResolvedValue({
                    id: "mock-email-id",
                    from: "test@example.com",
                    to: "recipient@example.com",
                    subject: "Test Subject",
                    html: "<p>Test HTML</p>",
                }),
            },
        })),
    };
});

// Mock node-fetch for Perplexity API
jest.mock("node-fetch", () => {
    return jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    choices: [
                        {
                            message: {
                                content: JSON.stringify({
                                    summary: "Test summary",
                                    category: "News",
                                    content: {
                                        "Global News Overview": "Test overview",
                                        "Regional Breakdown": {
                                            "North America": ["Test news item"],
                                        },
                                        "Market Insights": ["Test insight"],
                                        "Global Hotspots": ["Test hotspot"],
                                    },
                                    sources: ["<a href='test.com'>Test Source</a>"],
                                }),
                            },
                        },
                    ],
                }),
        })
    );
});

describe("Newsletter Generation and Sending", () => {
    let authToken;

    beforeAll(async () => {
        // Get auth token for admin user
        const loginRes = await request(app).post("/api/auth/login").send({
            email: "admin@retrotaxi.xyz",
            password: "Admin123!",
        });
        authToken = loginRes.headers["set-cookie"];
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/news/generate", () => {
        test("should generate newsletter successfully", async () => {
            // Mock database insert
            const mockNewsletter = {
                id: 1,
                title: "Retro Taxi – January 1",
                summary: "Test summary",
                content: JSON.stringify({
                    "Global News Overview": "Test overview",
                }),
                sources: JSON.stringify(["<a href='test.com'>Test Source</a>"]),
                category: "News",
                model: null,
                brand: null,
                image_url: "https://images-retrotaxi.s3.eu-north-1.amazonaws.com/1.jpg",
                user_id: 4,
                status: "draft",
                created_at: new Date().toISOString(),
            };

            jest.spyOn(pool, "query").mockResolvedValueOnce({ rows: [mockNewsletter] });

            const res = await request(app).post("/api/news/generate").set("Cookie", authToken);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("summary");
            expect(res.body).toHaveProperty("content");
            expect(res.body).toHaveProperty("sources");
        });

        test("should return 500 if Perplexity API fails", async () => {
            // Mock fetch to return error
            const fetch = require("node-fetch");
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: "Internal Server Error",
            });

            const res = await request(app).post("/api/news/generate").set("Cookie", authToken);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });

        test("should return 401 if not authenticated", async () => {
            const res = await request(app).post("/api/news/generate");

            expect(res.statusCode).toBe(401);
        });
    });

    describe("POST /api/news/send", () => {
        test("should send newsletter to subscribers successfully", async () => {
            // Mock database queries
            const mockNewsletter = {
                id: 1,
                title: "Retro Taxi Newsletter",
                summary: "Test summary",
                content: JSON.stringify({
                    "Global News Overview": "Test overview",
                }),
                sources: JSON.stringify(["<a href='test.com'>Test Source</a>"]),
                created_at: new Date().toISOString(),
            };

            const mockSubscribers = [
                { id: 1, name: "Test User 1", email: "user1@example.com" },
                { id: 2, name: "Test User 2", email: "user2@example.com" },
            ];

            jest.spyOn(pool, "query")
                .mockResolvedValueOnce({ rows: [mockNewsletter] }) // Get newsletter
                .mockResolvedValueOnce({ rows: mockSubscribers }); // Get subscribers

            const res = await request(app).post("/api/news/send").set("Cookie", authToken);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toContain("Newsletter sent to 2 subscribers");
            expect(res.body.successCount).toBe(2);
            expect(res.body.errorCount).toBe(0);

            // Verify Resend was called for each subscriber
            expect(Resend).toHaveBeenCalledTimes(1);
            const resendInstance = new Resend();
            expect(resendInstance.emails.send).toHaveBeenCalledTimes(2);
        });

        test("should return 404 if no published newsletter found", async () => {
            jest.spyOn(pool, "query").mockResolvedValueOnce({ rows: [] });

            const res = await request(app).post("/api/news/send").set("Cookie", authToken);

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe("No published newsletter found");
        });

        test("should return 404 if no subscribers found", async () => {
            const mockNewsletter = {
                id: 1,
                title: "Test Newsletter",
                summary: "Test summary",
                content: "{}",
                created_at: new Date().toISOString(),
            };

            jest.spyOn(pool, "query")
                .mockResolvedValueOnce({ rows: [mockNewsletter] }) // Get newsletter
                .mockResolvedValueOnce({ rows: [] }); // No subscribers

            const res = await request(app).post("/api/news/send").set("Cookie", authToken);

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe("No newsletter subscribers found");
        });

        test("should handle email sending errors gracefully", async () => {
            const mockNewsletter = {
                id: 1,
                title: "Test Newsletter",
                summary: "Test summary",
                content: "{}",
                created_at: new Date().toISOString(),
            };

            const mockSubscribers = [{ id: 1, name: "Test User", email: "user@example.com" }];

            // Mock Resend to throw error
            const resendInstance = new Resend();
            resendInstance.emails.send.mockRejectedValueOnce(new Error("Email sending failed"));

            jest.spyOn(pool, "query")
                .mockResolvedValueOnce({ rows: [mockNewsletter] })
                .mockResolvedValueOnce({ rows: mockSubscribers });

            const res = await request(app).post("/api/news/send").set("Cookie", authToken);

            expect(res.statusCode).toBe(200);
            expect(res.body.successCount).toBe(0);
            expect(res.body.errorCount).toBe(1);
        });

        test("should return 401 if not authenticated", async () => {
            const res = await request(app).post("/api/news/send");

            expect(res.statusCode).toBe(401);
        });
    });
});
