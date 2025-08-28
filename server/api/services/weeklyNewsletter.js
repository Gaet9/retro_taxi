const cron = require("node-cron");
const { create_newsletter, send_newsletter } = require("../db/newsQueries");
const pool = require("../db/dbconn");

let authToken = null;
let isGenerating = false;
let isSending = false;
let todayExecuted = false;
let globalLock = false;

// Check if newsletter already exists today
async function checkNewsletterExists() {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const existing = await pool.query(
            "SELECT id FROM blogs WHERE created_at >= $1 AND created_at < $2 AND title LIKE 'Retro Taxi – %'",
            [startOfDay, endOfDay]
        );

        console.log(`🔍 Found ${existing.rows.length} existing newsletters today`);
        return existing.rows.length > 0;
    } catch (error) {
        console.error("❌ Error checking newsletter existence:", error);
        return false;
    }
}

// Reset daily flags at midnight
function resetDailyFlags() {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        todayExecuted = false;
        globalLock = false;
        console.log("🔄 Daily flags reset at midnight");
    }
}

// Generate newsletter by calling the function directly
async function generateNewsletter() {
    console.log(`🔒 Global lock status: ${globalLock}`);
    console.log(`📅 Today executed status: ${todayExecuted}`);
    console.log(`⏳ Is generating status: ${isGenerating}`);

    if (globalLock) {
        console.log("🚫 Global lock active, skipping...");
        return;
    }

    if (isGenerating) {
        console.log("⏳ Newsletter generation already in progress, skipping...");
        return;
    }

    if (todayExecuted) {
        console.log("📅 Newsletter already generated today, skipping...");
        return;
    }

    try {
        globalLock = true;
        isGenerating = true;
        console.log("🕕 Time to create newsletter!");

        // Check if newsletter already exists today
        const exists = await checkNewsletterExists();
        if (exists) {
            console.log("📰 Newsletter already exists today, skipping...");
            todayExecuted = true;
            return;
        }

        // Create mock request/response objects for the function
        const mockReq = {
            body: {},
            user: { id: 14 }, // Default user ID
            headers: {},
        };

        const mockRes = {
            json: (data) => {
                console.log("✅ Newsletter created successfully");
                todayExecuted = true;
            },
            status: (code) => ({
                json: (data) => {
                    console.log("✅ Newsletter creation completed");
                    todayExecuted = true;
                },
            }),
        };

        await create_newsletter(mockReq, mockRes);
    } catch (error) {
        console.error("❌ Error creating newsletter:", error);
    } finally {
        isGenerating = false;
        globalLock = false;
    }
}

// Send newsletter by calling the function directly
async function sendNewsletter() {
    if (isSending) {
        console.log("⏳ Newsletter sending already in progress, skipping...");
        return;
    }

    try {
        isSending = true;
        console.log("📧 Time to send newsletter!");

        // Get all newsletter subscribers
        const result = await pool.query("SELECT id, name, email FROM users WHERE newsletter = true AND email IS NOT NULL");

        if (result.rows.length === 0) {
            console.log("No subscribers found");
            return;
        }

        console.log(`Found ${result.rows.length} subscribers`);

        // Send to each subscriber
        for (const user of result.rows) {
            try {
                const mockReq = {
                    body: {
                        name: user.name,
                        email: user.email,
                    },
                };

                const mockRes = {
                    json: (data) => console.log(`📧 Sent to ${user.email}`),
                    status: (code) => ({
                        json: (data) => console.log(`📧 Sent to ${user.email}`),
                    }),
                };

                await send_newsletter(mockReq, mockRes);

                // Small delay between sends to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Error sending to ${user.email}:`, error);
            }
        }

        console.log("✅ Newsletter sending completed");
    } catch (error) {
        console.error("❌ Error sending newsletter:", error);
    } finally {
        isSending = false;
    }
}

// Start the weekly schedule
function start() {
    console.log("Starting weekly newsletter service...");

    // Reset daily flags every minute to catch midnight
    setInterval(resetDailyFlags, 60000);

    // CRON FUNCTIONS TEMPORARILY DISABLED - INVESTIGATING DEEPER ISSUE
    /*
    // Today at 21:05 UTC+2 (19:05 UTC) - Generate newsletter
    cron.schedule(
        "5 19 * * *",
        () => {
            console.log("⏰ Cron triggered for newsletter generation");
            generateNewsletter();
        },
        {
            scheduled: true,
            timezone: "UTC",
        }
    );

    // Today at 21:10 UTC+2 (19:10 UTC) - Send newsletter
    cron.schedule(
        "10 19 * * *",
        () => {
            console.log("⏰ Cron triggered for newsletter sending");
            sendNewsletter();
        },
        {
            scheduled: true,
            timezone: "UTC",
        }
    );
    */

    console.log("✅ Weekly newsletter service started");
    console.log("🚫 CRON FUNCTIONS DISABLED - Manual testing only");
    console.log("📅 Newsletter generation: Use triggerGenerate() function");
    console.log("📧 Newsletter sending: Use triggerSend() function");
}

// Manual trigger functions for testing
function triggerGenerate() {
    console.log("🔄 Manually triggering newsletter generation...");
    generateNewsletter();
}

function triggerSend() {
    console.log("🔄 Manually triggering newsletter sending...");
    sendNewsletter();
}

module.exports = {
    start,
    generateNewsletter,
    sendNewsletter,
    triggerGenerate,
    triggerSend,
};
