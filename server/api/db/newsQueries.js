const fetch = require("node-fetch");
const config = require("../../config.js");
const dayjs = require("dayjs");
const pool = require("./dbconn.js");
const { Resend } = require("resend"); // to send newsletter

// ----------------------- Newsletter Generation using Perplexity AI -----------------------

const perplexityKey = config.apiKeys.perplexity; // Perplexity API Key

const create_newsletter = async (req, res) => {
    try {
        // Step 1: Call Perplexity API to generate newsletter content directly
        const perplexityRes = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${perplexityKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    {
                        role: "user",
                        content: `You are a professional research assistant and editor.
                        Write a weekly newsletter article about the latest developments in autonomous vehicles and robotaxis worldwide. 
                        Focus on the latest news from the past week, research on : the major companies in this industry (Tesla, Waymo, Cruise, Baidu, Zoox, Pony.ai, Mobileye, etc.), 
                        key countries where the industry is advanced or emerging, important technological breakthroughs, and regulatory updates.
                        The article must be professionally structured, concise, and clear, and formatted strictly as valid JSON and HTML text with tags using this schema:

                                                 {
                             \"summary\": \"Maximum 10 words summarizing the latest autonomous vehicle developments. If different topics are listed, separate them with | symbol.\",
                             \"category\": \"News\",
                            \"content\": 
                            {
                                \"Global News Overview\": \"Write a 3–5 sentence introduction summarizing the most important global trends, breakthroughs, or patterns this week. Keep it neutral and professional.\",
                                \"Regional Breakdown\": {
                                \"North America\": [
                                    \"<b>Headline</b> — Date: 1–2 sentences of context or insight\"
                                ],
                                \"Asia\": [
                                    \"<b>Headline</b> — Date: 1–2 sentences of context or insight\"
                                ],
                                \"Europe\": [
                                    \"<b>Headline</b> — Date: 1–2 sentences of context or insight. If there are no public updates or relevant news remove the Europe section.\"
                                ],
                                \"Middle East\": [
                                    \"<b>Headline</b> — Date: 1–2 sentences of context or insight. If there are no public updates or relevant news remove the middle east section.\"
                                ],
                                \"Other Regions\": [
                                    \"<b>Headline</b> — Date: 1–2 sentences of context or insight. If there are no public updates or relevant news remove the other regions section.\"
                                ]
                                },
                                \"Market Insights\": [
                                \"Provide 3–4 bullet points highlighting the most important implications for the autonomous vehicle and robotaxi industry globally.\"
                                ],
                                \"Global Hotspots\": [
                                \"Regional developments and country-specific news\",
                                \"International collaboration and competition\"
                                ],
                                \"Sources\": [
                                \"<a href='URL'>Source Title</a>\",
                                \"<a href='URL'>Source Title</a>\"
                                ]
                            }
                        }

                        Style Guidelines: Use HTML tags for headings and bold text for clarity. Keep the language professional, factual, and concise. Use bullet points for readability. Order news items by significance and recency. Avoid speculation unless clearly marked as analysis.

                        Return ONLY valid JSON without any markdown formatting or additional text.`,
                    },
                ],
                temperature: 0.7,
            }),
        });

        const perplexityData = await perplexityRes.json();
        const content = perplexityData.choices[0].message.content;

        // CLEAN the output (Perplexity or GPT might wrap JSON in code blocks)
        let cleaned;
        try {
            cleaned = JSON.parse(content); // try direct parse
        } catch (err) {
            // Fallback: try cleaning the markdown wrapping
            const fallback = content.replace(/^```json\s*/i, "").replace(/```$/, "");
            cleaned = JSON.parse(fallback);
        }

        const newsletter = Array.isArray(cleaned) ? cleaned[0] : cleaned;

        // Validate the newsletter structure (no title needed since we generate it)
        if (!newsletter.summary || !newsletter.content) {
            throw new Error("Invalid newsletter structure received from Perplexity API");
        }

        newsletter.user_id = 4; // or from req.user.id or similar
        const S3_image_URL = "https://images-retrotaxi.s3.eu-north-1.amazonaws.com/";
        const random = Math.floor(Math.random() * 27) + 1;

        // Store the newsletter content in the blogs table for later use
        await pool.query(
            `INSERT INTO blogs (title, summary, content, category, model, brand, image_url, user_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                `Retro Taxi – ${dayjs().format("MMMM D")}`,
                newsletter.summary,
                JSON.stringify(newsletter.content),
                newsletter.category,
                newsletter.model,
                newsletter.brand,
                (newsletter.image_url = `${S3_image_URL}${random}.jpg`),
                newsletter.user_id,
                "draft",
            ]
        );

        // Step 2: Store in database and return JSON
        res.json(cleaned);
    } catch (err) {
        console.error("Error generating newsletter:", err.message);

        if (err.message.includes("Invalid newsletter structure")) {
            res.status(400).json({
                error: "Invalid newsletter structure received from AI",
                details: "The AI response could not be parsed into the expected format",
            });
        } else if (err.message.includes("Failed to fetch from Perplexity API")) {
            res.status(503).json({
                error: "AI service temporarily unavailable",
                details: "Could not connect to Perplexity API",
            });
        } else {
            res.status(500).json({
                error: "Failed to generate newsletter",
                details: err.message,
            });
        }
    }
};

const send_newsletter = async (req, res) => {
    const resend = new Resend(config.apiKeys.resend);

    try {
        // Get the latest published newsletter
        const result = await pool.query(`SELECT * FROM blogs WHERE status = 'published' ORDER BY created_at DESC LIMIT 1`);
        const newsletter = result.rows[0];

        if (!newsletter) {
            console.log("No published newsletter found");
            res.status(404).json({ error: "No published newsletter found" });
            return;
        }

        // Get all newsletter subscribers
        const subscribersResult = await pool.query("SELECT id, name, email FROM users WHERE newsletter = true AND email IS NOT NULL");

        if (subscribersResult.rows.length === 0) {
            console.log("No newsletter subscribers found");
            res.status(404).json({ error: "No newsletter subscribers found" });
            return;
        }

        console.log(`Found ${subscribersResult.rows.length} newsletter subscribers`);

        // Handle both JSON and plain text content
        let content;
        try {
            content = JSON.parse(newsletter.content);
        } catch (parseError) {
            // If content is not JSON, treat it as plain text
            content = {
                Content: newsletter.content,
            };
        }

        // Send newsletter to all subscribers
        let successCount = 0;
        let errorCount = 0;

        for (const subscriber of subscribersResult.rows) {
            try {
                const html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Retro Taxi Newsletter</title>
                        
                        <style>
                            body { 
                                font-family: 'Arial', sans-serif; 
                                line-height: 1.6; 
                                color: #333; 
                                max-width: 800px; 
                                margin: 0 auto; 
                                padding: 20px;
                                background-color: #f5f5f5;
                            }
                            .email-container {
                                background-color: white;
                                padding: 40px;
                                border-radius: 12px;
                                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                            }
                            .header {
                                text-align: center;
                                margin-bottom: 30px;
                                padding-bottom: 20px;
                                border-bottom: 3px solid #e74c3c;
                            }
                            .greeting {
                                color: #e74c3c;
                                font-size: 28px;
                                margin-bottom: 10px;
                            }
                            .brand-title {
                                font-family: 'Verdana', 'Geneva', sans-serif;
                                font-size: 32px;
                                color: #2c3e50;
                                margin: 15px 0;
                                text-transform: uppercase;
                                letter-spacing: 2px;
                            }
                            .brand-title a {
                                color: inherit;
                                text-decoration: none;
                            }
                            .brand-title a:hover {
                                text-decoration: underline;
                            }
                            .subtitle {
                                color: #7f8c8d;
                                font-size: 18px;
                                margin-bottom: 15px;
                            }
                            .date {
                                color: #95a5a6;
                                font-style: italic;
                                font-size: 16px;
                                margin-bottom: 25px;
                            }
                            .summary-section {
                                margin: 30px 0;
                                padding: 25px;
                                background: linear-gradient(135deg, #e8f4fd 0%, #d1ecf1 100%);
                                border-radius: 12px;
                                border-left: 4px solid #17a2b8;
                            }
                            .summary-title {
                                color: #2c3e50;
                                font-size: 20px;
                                margin-bottom: 15px;
                                font-weight: bold;
                            }
                            .summary-text {
                                font-size: 18px;
                                line-height: 1.7;
                                color: #34495e;
                            }
                            .section-title {
                                color: #2c3e50;
                                font-size: 18px;
                                margin-bottom: 15px;
                                font-weight: bold;
                                border-bottom: 2px solid #e74c3c;
                                padding-bottom: 5px;
                            }
                            .subsection-title {
                                color: #34495e;
                                font-size: 16px;
                                margin: 15px 0 10px 0;
                                font-weight: bold;
                            }
                            .content-list {
                                background-color: #f8f9fa;
                                padding: 20px;
                                border-radius: 8px;
                                border-left: 4px solid #e74c3c;
                                margin: 15px 0;
                            }
                            .content-list ul {
                                margin: 0;
                                padding-left: 20px;
                            }
                            .content-list li {
                                margin-bottom: 8px;
                                line-height: 1.6;
                            }
                            .content-paragraph {
                                background-color: #f8f9fa;
                                padding: 20px;
                                border-radius: 8px;
                                border-left: 4px solid #3498db;
                                margin: 15px 0;
                                line-height: 1.7;
                            }
                            .footer {
                                text-align: center;
                                margin-top: 40px;
                                padding-top: 20px;
                                border-top: 2px solid #ecf0f1;
                                color: #7f8c8d;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <div class="greeting">Hi there ${subscriber.name}!</div>
                                <div class="brand-title"> <a href="www.retrotaxi.xyz">Retro Taxi</a> </div>
                                <div class="subtitle">Autonomous Vehicle Industry Newsletter</div>
                                <div class="date">${dayjs(newsletter.created_at).format("dddd, MMMM D YYYY")}</div>
                            </div>
                          
                            <div class="summary-section">
                                <div class="summary-title">This Week's Highlights</div>
                                <div class="summary-text">${newsletter.summary}</div>
                            </div>
                            
                            <div class="content-section">
                                ${Object.entries(content)
                                    .map(([sectionName, sectionContent]) => {
                                        if (Array.isArray(sectionContent)) {
                                            // Handle array content (like Market Insights, Global Hotspots)
                                            return `
                                                <div class="content-list">
                                                    <div class="section-title">${sectionName}</div>
                                                    <ul>${sectionContent.map((point) => `<li>${point}</li>`).join("")}</ul>
                                                </div>
                                            `;
                                        } else if (typeof sectionContent === "object" && sectionContent !== null) {
                                            // Handle nested objects (like Regional Breakdown)
                                            return `
                                                <div class="content-list">
                                                    <div class="section-title">${sectionName}</div>
                                                    ${Object.entries(sectionContent)
                                                        .map(
                                                            ([subRegion, items]) => `
                                                                <div class="subsection-title">${subRegion}</div>
                                                                <ul>${items.map((point) => `<li>${point}</li>`).join("")}</ul>
                                                            `
                                                        )
                                                        .join("")}
                                                </div>
                                            `;
                                        } else {
                                            // Handle plain string content (like Global News Overview)
                                            return `
                                                <div class="content-paragraph">
                                                    <div class="section-title">${sectionName}</div>
                                                    <div>${sectionContent}</div>
                                                </div>
                                            `;
                                        }
                                    })
                                    .join("")}
                            </div>
                            
                            <div class="footer">
                                <p>Stay updated with the latest autonomous vehicle developments</p>
                                <p><strong><a href="www.retrotaxi.xyz">Retro Taxi</a></strong> - Driving the future of transportation</p>
                            </div>
                        </div>
                    </body>
                    </html>`;

                const response = await resend.emails.send({
                    from: "RetroTaxi 🚖 <hello@retrotaxi.xyz>",
                    to: subscriber.email,
                    subject: newsletter.title,
                    html,
                    reply_to: "support@retrotaxi.xyz",
                });

                console.log(`📧 Newsletter sent to ${subscriber.email}`);
                successCount++;

                // Small delay between sends to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`❌ Failed to send newsletter to ${subscriber.email}:`, error.message);
                errorCount++;
            }
        }

        console.log(`✅ Newsletter sending completed: ${successCount} successful, ${errorCount} failed`);
        res.status(200).json({
            message: `Newsletter sent to ${successCount} subscribers`,
            successCount,
            errorCount,
            totalSubscribers: subscribersResult.rows.length,
        });
    } catch (err) {
        console.error("Failed to send newsletter:", err.message);
        res.status(500).json({ error: "Failed to send newsletter" });
    }
};

module.exports = {
    create_newsletter,
    send_newsletter,
};
