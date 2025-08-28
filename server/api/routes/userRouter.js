// require files where requests handlers are defined
const express = require("express");
const userQueries = require("../db/userQueries");
const verifyToken = require("../middlewares/auth-middleware");
const verifyAdmin = require("../middlewares/admin-middleware");

const router = express.Router();

// public routes
// Protected by JWT (for a specific user - in the account section)
router.get("/me", verifyToken, userQueries.user_byToken); // it's a special route, must be put before user_details other wise it conflicts
router.get("/:id(\\d+)", verifyToken, userQueries.user_details);
router.put("/me", verifyToken, userQueries.user_update);
router.delete("/me", verifyToken, userQueries.user_delete);
// Admin-only
router.get("/", verifyToken, userQueries.user_index);
router.put("/:id(\\d+)/newsletter", verifyToken, userQueries.user_updateNewsletter);
router.put("/:id(\\d+)/role", verifyToken, verifyAdmin, userQueries.user_updateRole);
router.put("/:id(\\d+)/approve-admin", verifyToken, verifyAdmin, userQueries.user_approveAdmin);
router.put("/:id(\\d+)/deny-admin", verifyToken, verifyAdmin, userQueries.user_denyAdmin);
router.get("/pending-admin-requests", verifyToken, verifyAdmin, userQueries.user_getPendingAdminRequests);

module.exports = router;
