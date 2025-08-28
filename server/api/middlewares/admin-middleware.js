const pool = require("../db/dbconn.js");

function verifyAdmin(req, res, next) {
    // First verify the token (req.user should already be set by verifyToken middleware)
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    // Check if the user has admin role
    pool.query("SELECT role FROM users WHERE id = $1", [req.user.id])
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            if (result.rows[0].role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Admin access required",
                });
            }

            next(); // User is admin, proceed
        })
        .catch((err) => {
            console.error("Error checking admin role:", err);
            res.status(500).json({
                success: false,
                message: "Error verifying admin access",
                error: err.message,
            });
        });
}

module.exports = verifyAdmin;
