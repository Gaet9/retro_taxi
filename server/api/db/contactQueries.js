const pool = require("./dbconn"); // import the Blog model
const validator = require("validator");
const { Resend } = require("resend");
const config = require("../../config.js");

// Check Resend configuration on startup
console.log("🔧 Contact Queries Module Loaded");
console.log("🔧 Resend API Key Status:", config.apiKeys.resend ? "✅ Configured" : "❌ Missing");
if (config.apiKeys.resend) {
    console.log("🔧 Resend API Key Length:", config.apiKeys.resend.length);
    console.log("🔧 Resend API Key Preview:", config.apiKeys.resend.substring(0, 8) + "...");
}

//Middleware to get all contact forms sent
const contact_index = (req, res) => {
    const result = pool
        .query("SELECT * FROM contact ORDER BY submitted_at DESC")
        .then((result) => {
            res.status(200).json({
                success: true,
                message: "All contact requests retreived successfully",
                data: result.rows,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: err,
            });
        });
};

// Middleware to get a specific contact form with the id
const contact_details = (req, res) => {
    const { id } = req.params;
    const result = pool
        .query("SELECT * FROM contact WHERE id = $1", [id]) // return the array with the id
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Contact form not found",
                });
            }
            res.status(200).json({
                success: true,
                message: "Contact form found successfully",
                data: result.rows[0],
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: err,
            });
        });
};

// Middleware to create a contact form, POST request
const contact_create_form = async (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log("Creating contact form with data:", req.body);

    if (!name || !email || !subject || !message) {
        // error if missing fields
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    const normalizedEmail = validator.normalizeEmail(email, {
        gmail_remove_dots: false, // keep dots for Gmail
        all_lowercase: true, // still lowercase
    }); // lowercase and trims email

    // Validate email
    if (!validator.isEmail(normalizedEmail)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format",
        });
    }

    try {
        // First, insert the contact form into the database
        const result = await pool.query("INSERT INTO contact (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *", [
            name,
            normalizedEmail,
            subject,
            message,
        ]);

        // After successful database insertion, send email notification to admin
        try {
            if (!config.apiKeys.resend) {
                console.error("❌ RESEND_KEY is missing from environment variables");
                throw new Error("Resend API key not configured");
            }

            const resend = new Resend(config.apiKeys.resend);
            const currentDate = new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Contact Message - Retro Taxi</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: white;
                            border-radius: 10px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            overflow: hidden;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                            font-weight: 300;
                        }
                        .header .subtitle {
                            margin-top: 10px;
                            opacity: 0.9;
                            font-size: 16px;
                        }
                        .content {
                            padding: 30px;
                        }
                        .message-info {
                            background: #f8f9fa;
                            border-left: 4px solid #667eea;
                            padding: 20px;
                            margin: 20px 0;
                            border-radius: 5px;
                        }
                        .message-info h3 {
                            margin: 0 0 15px 0;
                            color: #495057;
                            font-size: 18px;
                        }
                        .info-row {
                            display: flex;
                            justify-content: space-between;
                            margin: 10px 0;
                            padding: 8px 0;
                            border-bottom: 1px solid #e9ecef;
                            align-items: center;
                        }
                        .info-label {
                            font-weight: 600;
                            color: #6c757d;
                        }
                        .info-value {
                            color: #495057;
                            text-align: right;
                            max-width: 60%;
                            word-wrap: break-word;
                        }
                        .message-content {
                            background: #e8f5e8;
                            border: 1px solid #c3e6c3;
                            border-radius: 8px;
                            padding: 20px;
                            margin: 25px 0;
                        }
                        .message-content h3 {
                            color: #2d5a2d;
                            margin: 0 0 15px 0;
                            font-size: 18px;
                        }
                        .message-content p {
                            color: #2d5a2d;
                            font-size: 16px;
                            line-height: 1.6;
                            margin: 0;
                            white-space: pre-wrap;
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            border-top: 1px solid #e9ecef;
                        }
                        .footer a {
                            color: #667eea;
                            text-decoration: none;
                            font-weight: 600;
                        }
                        .footer a:hover {
                            text-decoration: underline;
                        }
                        .date {
                            text-align: center;
                            color: #6c757d;
                            font-size: 14px;
                            margin-top: 20px;
                            padding: 10px;
                            background: #f8f9fa;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📧 New Contact Message</h1>
                            <div class="subtitle">Retro Taxi Application</div>
                        </div>
                        
                        <div class="content">
                            <div class="message-info">
                                <h3>📋 Contact Details</h3>
                                <div class="info-row">
                                    <span class="info-label">Name:</span>
                                    <span class="info-value">${name}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Email:</span>
                                    <span class="info-value">${normalizedEmail}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Subject:</span>
                                    <span class="info-value">${subject}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Date:</span>
                                    <span class="info-value">${currentDate}</span>
                                </div>
                            </div>
                            
                            <div class="message-content">
                                <h3>💬 Message Content</h3>
                                <p>${message}</p>
                            </div>
                            
                            <div class="date">
                                <strong>Message Sent:</strong> ${new Date().toLocaleString()}
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p><strong><a href="https://www.retrotaxi.xyz">Retro Taxi</a></strong> - Driving the future of transportation</p>
                        </div>
                    </div>
                </body>
                </html>`;

            const emailData = {
                from: "Retro Taxi 📧 <noreply@retrotaxi.xyz>",
                to: "gaetan.delorgeril@gmail.com",
                subject: `New Contact Message: ${subject}`,
                html: html,
                reply_to: normalizedEmail,
            };

            const emailResult = await resend.emails.send(emailData);

            console.log("📧 Email sent successfully:", emailResult);
            console.log(`📧 Admin notification email sent successfully for new message from: ${name}`);
        } catch (emailError) {
            console.error("❌ Failed to send admin notification email:", emailError);
            console.error("❌ Email error details:", {
                message: emailError.message,
            });
            // Don't fail the contact form submission if email fails
        }

        // Return success response
        res.status(201).json({
            success: true,
            message: "Contact form created successfully",
            data: result.rows[0],
        });
    } catch (err) {
        console.error("Contact form creation error:", err);

        if (err.code === "23503") {
            // PostgreSQL Foreign key violation
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message,
        });
    }
};

// Middleware to delete a blog by id
const contact_delete = (req, res) => {
    const { id } = req.params;
    const result = pool
        .query("DELETE FROM contact WHERE id = $1 RETURNING *", [id])
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Contact form not found",
                });
            }
            res.status(200).json({
                success: true,
                message: "Contact form deleted successfully",
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        });
};

module.exports = {
    contact_index,
    contact_details,
    contact_create_form,
    contact_delete,
};
