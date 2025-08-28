const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config.js");
const pool = require("../db/dbconn.js");
const validator = require("validator");

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
