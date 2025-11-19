module.exports = app => {
    const auth = require("../controllers/auth.controllers.js");
    const { authenticateToken } = require("../middleware/auth.js");
    const { body } = require('express-validator');
    const { validate } = require('../middleware/validators.js');

    var router = require("express").Router();

    const registerValidation = [
        body('name').notEmpty().trim(),
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        validate
    ];

    const loginValidation = [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
        validate
    ];

    router.post("/register", registerValidation, auth.register);
    router.post("/login", loginValidation, auth.login);
    router.get("/me", authenticateToken, auth.getMe);

    app.use('/api/auth', router);
};
