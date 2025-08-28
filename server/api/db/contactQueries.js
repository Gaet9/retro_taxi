const pool = require("./dbconn"); // import the Blog model
const validator = require("validator");

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

// Middleware to create a blog, POST request
const contact_create_form = (req, res) => {
    const { name, email, subject, message } = req.body;
    const result = pool;
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

    result
        .query("INSERT INTO contact (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *", [name, email, subject, message])
        .then((result) =>
            res.status(201).json({
                success: true,
                message: "Contact form created successfully",
                data: result.rows[0],
            })
        )
        .catch((err) => {
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
                error: err,
            });
        });
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
