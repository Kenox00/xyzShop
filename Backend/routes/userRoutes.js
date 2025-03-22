// File: routes/userRoutes.js
const express = require('express');
const { signUpUser, logInUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', signUpUser);
router.post('/login', logInUser);

module.exports = router;
