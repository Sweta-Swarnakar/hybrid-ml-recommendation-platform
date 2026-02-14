const express = require("express");
const router = express.Router();

const { signup, loginUser } = require("../controllers/auth.controller");


router.post("/signup", signup);
router.post("/login", loginUser);


module.exports = router;
