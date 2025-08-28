// require files where requests handlers are defined
const express = require("express");
const blogQueries = require("../db/blogQueries");
const verifyToken = require("../middlewares/auth-middleware"); // to protect routes

const router = express.Router();

// Public
router.get("/published", blogQueries.blog_published);
router.get("/draft", blogQueries.blog_draft); // must be put before dynamic ones like id
router.get("/:id", blogQueries.blog_details); // could be limited without account
// Protected by JWT
// Option : Full content with account
// Admin-only
router.get("/", verifyToken, blogQueries.blog_index);
router.put("/:id", verifyToken, blogQueries.blog_update);
router.post("/", verifyToken, blogQueries.blog_create_post);
router.delete("/:id", verifyToken, blogQueries.blog_delete);

module.exports = router;
