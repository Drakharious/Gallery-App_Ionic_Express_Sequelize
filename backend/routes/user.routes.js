module.exports = app => {
    const users = require("../controllers/user.controllers.js");
    const { authenticateToken } = require("../middleware/auth.js");
    const { body, param } = require('express-validator');
    const { validate } = require('../middleware/validators.js');

    var router = require("express").Router();

    const updateValidation = [
        param('id').isInt(),
        body('name').optional().trim(),
        body('email').optional().isEmail().normalizeEmail(),
        validate
    ];

    const idValidation = [
        param('id').isInt(),
        validate
    ];

    router.put("/:id", authenticateToken, updateValidation, users.update);
    router.delete("/:id", authenticateToken, idValidation, users.delete);

    app.use('/api/users', router);
};
