const express = require("express");
const router = express.Router();

const {
    registerTherapist,
    loginTherapist
} = require("../controllers/authController");

// Registration route
router.post("/register", registerTherapist);

// Login route
router.post("/login", loginTherapist);

module.exports = router;