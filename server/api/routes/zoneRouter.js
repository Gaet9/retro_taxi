const express = require("express");
const zoneQueries = require("../db/zoneQueries.js");
const verifyToken = require("../middlewares/auth-middleware");
const verifyAdmin = require("../middlewares/admin-middleware");

const router = express.Router();

// Public routes (no authentication required)
router.get("/", zoneQueries.get_all_zones);

// Admin-only routes (require authentication and admin role)
router.post("/", verifyToken, verifyAdmin, zoneQueries.create_zone);
router.put("/:id", verifyToken, verifyAdmin, zoneQueries.update_zone);
router.delete("/:id", verifyToken, verifyAdmin, zoneQueries.delete_zone);

module.exports = router;
