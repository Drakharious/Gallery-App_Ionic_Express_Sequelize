const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const galleryValidation = {
    create: [
        body('name').notEmpty().trim().withMessage('Gallery name is required'),
        validate
    ],
    update: [
        param('id').isInt().withMessage('Invalid ID'),
        body('name').optional().trim(),
        validate
    ],
    idParam: [
        param('id').isInt().withMessage('Invalid ID'),
        validate
    ]
};

const imageValidation = {
    create: [
        param('galleryId').isInt().withMessage('Invalid gallery ID'),
        body('name').optional().trim(),
        body('description').optional().trim(),
        body('customUrl').optional().trim(),
        validate
    ],
    galleryIdParam: [
        param('galleryId').isInt().withMessage('Invalid gallery ID'),
        validate
    ],
    idParam: [
        param('id').isInt().withMessage('Invalid ID'),
        validate
    ]
};

module.exports = { galleryValidation, imageValidation, validate };
