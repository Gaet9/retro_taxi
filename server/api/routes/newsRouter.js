// require files where requests handlers are defined
const express = require("express");
const newsQueries = require("../db/newsQueries");

const router = express.Router();

// public
router.post("/send", newsQueries.send_newsletter);
// protected
router.post("/generate", newsQueries.create_newsletter);

module.exports = router;
