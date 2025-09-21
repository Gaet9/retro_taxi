const pool = require("./dbconn"); // import the Blog model

// name and conventions
// blog_index, blog_details, blog_update, blog-create_post, blog_delete

//Middleware to get the list of all blogs
const blog_index = (req, res) => {
    const result = pool
        .query("SELECT * FROM blogs ORDER BY id") // find all blogs and sort them by createdAt in descending order
        .then((result) => {
            res.status(200).json({
                success: true,
                message: "All blogs retreived successfully",
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

// Middleware to fetch published blogs
const blog_published = (req, res) => {
    const result = pool
        .query("SELECT * FROM blogs WHERE status = $1 ORDER BY created_at DESC", ["published"])
        .then((result) => {
            res.status(200).json({
                success: true,
                message: "All published blogs retreived successfully",
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

// Middleware to fetch draft blogs
const blog_draft = (req, res) => {
    const result = pool
        .query("SELECT * FROM blogs WHERE status = $1 ORDER BY created_at DESC", ["draft"])
        .then((result) => {
            res.status(200).json({
                success: true,
                message: "All draft blogs retreived successfully",
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

// Middleware to get a specific blog with the id
const blog_details = (req, res) => {
    const { id } = req.params;
    const result = pool
        .query("SELECT * FROM blogs WHERE id = $1", [id]) // return the array with the id
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found",
                });
            }
            res.status(200).json({
                success: true,
                message: "Blog found successfully",
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

// Middleware to update a specific blog by id
const blog_update = async (req, res) => {
    const { id } = req.params; // Good practice to write like this, many parameters can be passe between {}, like { id, name, email }
    const { title, content, sources, category, model, brand, image_url, user_id, status, last_updated } = req.body; // Added sources parameter

    // Handle sources - convert to JSON string if it's an array
    let sourcesJson = null;
    if (sources) {
        sourcesJson = Array.isArray(sources) ? JSON.stringify(sources) : sources;
    }

    const result = pool
        .query(
            "UPDATE blogs SET title = $1, content = $2, sources = $3, category = $4, model = $5, brand = $6, image_url = $7, user_id = $8, status = $9, last_updated = $10 WHERE id = $11 RETURNING *",
            [title, content, sourcesJson, category, model, brand, image_url, user_id, status, last_updated, id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found",
                });
            }
            res.status(200).json({
                success: true,
                message: "Blog updated successfully",
                data: result.rows[0],
            }); // updated Blog object
        })
        .catch((err) => {
            if (err.code === "23503") {
                // PostgreSQL Foreign key violation
                return res.status(400).json({
                    success: false,
                    message: "Invalid user_id: user doesnt exist",
                });
            }
            res.status(500).json({
                success: false,
                message: "Something went wrong",
                error: err,
            });
        });
};

// Middleware to create a blog, POST request
const blog_create_post = (req, res) => {
    // here we want to save data from the form, first we need to access it (l. 23)
    const { title, content, sources, category, model, brand, image_url, user_id, status } = req.body; // Added sources parameter
    const result = pool;
    console.log("Creating blog with data:", req.body);

    // Handle sources - convert to JSON string if it's an array
    let sourcesJson = null;
    if (sources) {
        sourcesJson = Array.isArray(sources) ? JSON.stringify(sources) : sources;
    }

    result
        .query(
            "INSERT INTO blogs (title, content, sources, category, model, brand, image_url, user_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [title, content, sourcesJson, category, model, brand, image_url, user_id, status]
        )
        .then((result) =>
            res.status(201).json({
                success: true,
                message: "Blog created successfully",
                data: result.rows[0],
            })
        )
        .catch((err) => {
            if (err.code === "23503") {
                // PostgreSQL Foreign key violation
                return res.status(400).json({
                    success: false,
                    message: "Invalid user_id: user doesnt exist",
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
const blog_delete = (req, res) => {
    const { id } = req.params;
    const result = pool
        .query("DELETE FROM blogs WHERE id = $1 RETURNING *", [id])
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found",
                });
            }
            res.status(200).json({
                success: true,
                message: "Blog deleted successfully",
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
    blog_index,
    blog_published,
    blog_draft,
    blog_details,
    blog_update,
    blog_create_post,
    blog_delete,
};
