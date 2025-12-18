const express = require('express');
const router = express.Router();
const tokenscontroller = require('../controllers/konyvekcontrollers');

const auth = require("../middleware/auth");
router.post("/register", tokenscontroller.regisztracio);
router.post("/login", tokenscontroller.bejelentkezes);
router.post("/refresh", tokenscontroller.refreshToken);
module.exports = router;