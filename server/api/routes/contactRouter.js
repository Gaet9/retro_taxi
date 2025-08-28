// require files where requests handlers are defined
const express = require("express");
const contactQueries = require("../db/contactQueries");
const verifyToken = require("../middlewares/auth-middleware");

const router = express.Router();

// Public
router.post("/", contactQueries.contact_create_form);
// Protected by JWT
router.get("/:id", verifyToken, contactQueries.contact_details);
// Admin-only
router.get("/", verifyToken, contactQueries.contact_index);

router.delete("/:id", verifyToken, contactQueries.contact_delete);

module.exports = router;
