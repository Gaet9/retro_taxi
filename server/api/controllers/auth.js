const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config.js");
const pool = require("../db/dbconn.js");
const validator = require("validator");
const { Resend } = require("resend");

const JWT_SECRET = config.jwt.secret;

// REGISTER
async function register(req, res) {
    const { name, email, password, role = "user", newsletter = false, adminRequest = false } = req.body; // retreive user info from the form

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        }); // check if all fields are filled
    }

    const username = validator.escape(name); // removes tags and quotes from username
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

    // Validate password strength
    if (
        !validator.isStrongPassword(password, {
            minLength: 8,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
        }) // customize the requirements
    ) {
        return res.status(400).json({
            success: false,
            message: "Password too weak. Must be at least 8 characters long, include 1 uppercase, 1 number, and 1 symbol",
        });
    }

    try {
        const findEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (findEmail.rows.length !== 0) {
            return res.status(400).json({
                success: false,
                message: "email already exists",
            }); // check if email entered already exist in DB
        }

        const hashedPassword = await bcrypt.hash(password, 10); // hash entered password

        // Handle admin role requests - always register as 'user' initially
        let finalRole = "user";
        let finalNewsletter = newsletter || false;
        let finalAdminRequest = adminRequest || false; // Use the adminRequest from frontend

        // Note: role is always "user" initially, adminRequest flag indicates if they want admin privileges

        // create user with info (and hashed password) in DB
        await pool.query("INSERT INTO users (name, email, password, role, newsletter, adminRequest) VALUES ($1, $2, $3, $4, $5, $6)", [
            username,
            normalizedEmail,
            hashedPassword,
            finalRole,
            finalNewsletter,
            finalAdminRequest,
        ]);

        // Send email notification to admin about new user registration
        try {
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
                    <title>New User Registration - Retro Taxi</title>
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
                        .user-info {
                            background: #f8f9fa;
                            border-left: 4px solid #667eea;
                            padding: 20px;
                            margin: 20px 0;
                            border-radius: 5px;
                        }
                        .user-info h3 {
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
                        }
                        .info-label {
                            font-weight: 600;
                            color: #6c757d;
                        }
                        .info-value {
                            color: #495057;
                        }
                        .admin-request {
                            background: #fff3cd;
                            border: 1px solid #ffeaa7;
                            border-radius: 5px;
                            padding: 15px;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .admin-request .icon {
                            font-size: 24px;
                            margin-bottom: 10px;
                        }
                        .admin-request .text {
                            color: #856404;
                            font-weight: 600;
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
                            <h1>🚖 New User Registration</h1>
                            <div class="subtitle">Retro Taxi Application</div>
                        </div>
                        
                        <div class="content">
                            <div class="user-info">
                                <h3>📋 User Details</h3>
                                <div class="info-row">
                                    <span class="info-label">Name:</span>
                                    <span class="info-value">${username}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Email:</span>
                                    <span class="info-value">${normalizedEmail}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Registration Date:</span>
                                    <span class="info-value">${currentDate}</span>
                                </div>
                            </div>
                            
                            ${
                                finalAdminRequest ?
                                    `
                                <div class="admin-request">
                                    <div class="icon">⚠️</div>
                                    <div class="text">ADMIN PRIVILEGES REQUESTED</div>
                                    <p style="margin: 10px 0 0 0; color: #856404;">This user has requested admin privileges and is pending approval.</p>
                                </div>
                            `
                                :   ""
                            }

                            ${
                                finalNewsletter ?
                                    `
                                <div class="admin-request">
                                    <div class="icon">✅</div>
                                    <div class="text">Registered to newsletter</div>
                                </div>
                            `
                                :   ""
                            }
                            
                            <div class="date">
                                <strong>Registration Time:</strong> ${new Date().toLocaleString()}
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p><strong><a href="https://www.retrotaxi.xyz">Retro Taxi</a></strong> - Driving the future of transportation</p>
                        </div>
                    </div>
                </body>
                </html>`;

            const text = `
                            New User Registration - Retro Taxi

                            User Details:
                            - Name: ${username}
                            - Email: ${normalizedEmail}
                            - Registration Date: ${currentDate}
                            ${finalAdminRequest ? "\n⚠️ ADMIN PRIVILEGES REQUESTED: This user has requested admin privileges and is pending approval." : ""}

                            Registration Time: ${new Date().toLocaleString()}

                            ---
                            Retro Taxi - Driving the future of transportation
            `;

            await resend.emails.send({
                from: "Retro Taxi 🚖 <noreply@retrotaxi.xyz>",
                to: process.env.ADMIN_EMAIL || "gaetan.delorgeril@gmail.com",
                subject: `New User Registration: ${username}`,
                html: html,
                text: text,
                reply_to: "support@retrotaxi.xyz",
            });

            console.log(`📧 Admin notification email sent successfully for new user: ${username}`);
        } catch (emailError) {
            console.error("Failed to send admin notification email:", emailError);
            // Don't fail the registration if email fails
        }

        // Send welcome email to the new user
        try {
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
                    <title>Welcome to Retro Taxi!</title>
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
                        .welcome-message {
                            text-align: center;
                            margin: 20px 0;
                            padding: 20px;
                            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                            border-radius: 10px;
                        }
                        .welcome-message h2 {
                            color: #495057;
                            margin-bottom: 15px;
                            font-size: 24px;
                        }
                        .welcome-message p {
                            color: #6c757d;
                            font-size: 16px;
                            margin: 10px 0;
                        }
                        .admin-request {
                            background: #fff3cd;
                            border: 1px solid #ffeaa7;
                            border-radius: 8px;
                            padding: 20px;
                            margin: 25px 0;
                            text-align: center;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .admin-request .icon {
                            font-size: 32px;
                            margin-bottom: 15px;
                        }
                        .admin-request .text {
                            color: #856404;
                            font-weight: 600;
                            font-size: 18px;
                            margin-bottom: 10px;
                        }
                        .admin-request .description {
                            color: #856404;
                            font-size: 14px;
                            line-height: 1.5;
                        }
                        .next-steps {
                            background: #e8f5e8;
                            border: 1px solid #c3e6c3;
                            border-radius: 8px;
                            padding: 20px;
                            margin: 25px 0;
                        }
                        .next-steps h3 {
                            color: #2d5a2d;
                            margin: 0 0 15px 0;
                            font-size: 18px;
                        }
                        .next-steps ul {
                            color: #2d5a2d;
                            margin: 0;
                            padding-left: 20px;
                        }
                        .next-steps li {
                            margin: 8px 0;
                        }
                        .cta-button {
                            display: inline-block;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 15px 30px;
                            text-decoration: none;
                            border-radius: 25px;
                            font-weight: 600;
                            margin: 20px 0;
                            transition: transform 0.2s ease;
                        }
                        .cta-button:hover {
                            transform: translateY(-2px);
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
                            <h1>Welcome to Retro Taxi!</h1>
                            <div class="subtitle">Your account has been successfully created</div>
                        </div>
                        
                        <div class="content">
                            <div class="welcome-message">
                                <h2>🎉 Welcome aboard, ${username}!</h2>
                                <p>Thank you for joining the Retro Taxi community. We're excited to have you on board!</p>

                            </div>
                            
                            ${
                                finalAdminRequest ?
                                    `
                                <div class="admin-request">
                                    <div class="icon">⏳</div>
                                    <div class="text">Admin Privileges Request</div>
                                    <div class="description">
                                        We've received your request for admin privileges. 
                                    </div>
                                </div>
                            `
                                :   ""
                            }

                            ${
                                finalNewsletter ?
                                    `
                                <div class="admin-request">
                                    <div class="icon">✅</div>
                                    <div class="text">You will receive the newsletter</div>
                                </div>
                            `
                                :   ""
                            }
                            
                            <div class="date">
                                <strong>Account Created:</strong> ${new Date().toLocaleString()}
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p><strong><a href="https://www.retrotaxi.xyz">Retro Taxi</a></strong> - Driving the future of transportation</p>
                            <p style="margin-top: 10px; font-size: 14px; color: #6c757d;">
                                If you have any questions, please contact us at <a href="mailto:support@retrotaxi.xyz">support@retrotaxi.xyz</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>`;

            await resend.emails.send({
                from: "Retro Taxi 🚖 <noreply@retrotaxi.xyz>",
                to: normalizedEmail,
                subject: `Welcome to Retro Taxi, ${username}! 🚖`,
                html: html,
                reply_to: "support@retrotaxi.xyz",
            });

            console.log(`📧 Welcome email sent successfully to new user: ${username} (${normalizedEmail})`);
        } catch (emailError) {
            console.error("Failed to send welcome email to new user:", emailError);
            // Don't fail the registration if email fails
        }

        // Success message if signed in successfully
        let message = "User registered successfully";
        if (finalAdminRequest) {
            message = "User registered successfully. Admin role request submitted and pending approval.";
        }

        return res.status(201).json({
            success: true,
            message: message,
            adminRequest: finalAdminRequest,
        });
    } catch (err) {
        // catch errors
        console.error("sign up error:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message,
        });
    }
}

// LOGIN
async function login(req, res) {
    const { email, password } = req.body; // retreives info from login form

    if (!email || !password) {
        // error if missing fields
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        // check if email already exists
        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const user = userResult.rows[0]; // Create an object user with infos found in DB

        // use brcypt to compare entered and stored encrypted password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // creating JWT token using users info and secret
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000 * 3), // 1 hour
        }).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: err.message,
        });
    }
}

// LOGOUT
const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
    });
    req.session?.destroy?.();
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

module.exports = {
    register,
    login,
    logout,
};
