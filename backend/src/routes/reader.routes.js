const express = require("express");
const { proxyFile } = require("../controllers/reader.controller");

const router = express.Router();

router.get("/file", proxyFile);

module.exports = router;
