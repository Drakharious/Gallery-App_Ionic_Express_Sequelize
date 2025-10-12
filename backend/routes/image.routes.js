const upload = require('../config/multer');

module.exports = app => {
    const images = require("../controllers/image.controllers.js");
    const { imageValidation } = require("../middleware/validators.js");

    var router = require("express").Router();

    router.post("/:galleryId", upload.single('image'), imageValidation.create, images.create);
    router.get("/:galleryId", imageValidation.galleryIdParam, images.findAll);
    router.get("/single/:id", imageValidation.idParam, images.findOne);
    router.put("/:id", upload.none(), imageValidation.idParam, images.update);
    router.delete("/:id", imageValidation.idParam, images.delete);

    app.use('/api/images', router);
};
