const upload = require('../config/multer');

module.exports = app => {
    const images = require("../controllers/image.controllers.js");
    const { imageValidation } = require("../middleware/validators.js");
    const { authenticateToken } = require("../middleware/auth.js");

    var router = require("express").Router();

    router.post("/:galleryId", authenticateToken, upload.single('image'), imageValidation.create, images.create);
    router.get("/:galleryId", authenticateToken, imageValidation.galleryIdParam, images.findAll);
    router.get("/single/:id", authenticateToken, imageValidation.idParam, images.findOne);
    router.put("/:id", authenticateToken, upload.none(), imageValidation.idParam, images.update);
    router.delete("/:id", authenticateToken, imageValidation.idParam, images.delete);

    app.use('/api/images', router);
};
