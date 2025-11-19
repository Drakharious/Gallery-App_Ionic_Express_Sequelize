module.exports = app => {
    const categories = require("../controllers/category.controllers.js");
    const { authenticateToken } = require("../middleware/auth.js");
    const { body, param } = require('express-validator');
    const { validate } = require('../middleware/validators.js');

    var router = require("express").Router();

    const createValidation = [
        body('name').notEmpty().trim(),
        body('description').optional().trim(),
        validate
    ];

    const updateValidation = [
        param('id').isInt(),
        body('name').optional().trim(),
        body('description').optional().trim(),
        validate
    ];

    const idValidation = [
        param('id').isInt(),
        validate
    ];

    router.post("/", authenticateToken, createValidation, categories.create);
    router.get("/", authenticateToken, categories.findAll);
    router.get("/:id", authenticateToken, idValidation, categories.findOne);
    router.put("/:id", authenticateToken, updateValidation, categories.update);
    router.delete("/:id", authenticateToken, idValidation, categories.delete);

    app.use('/api/categories', router);
};
