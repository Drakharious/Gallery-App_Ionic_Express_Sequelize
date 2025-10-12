module.exports = app => {
    const galleries = require("../controllers/gallery.controllers.js");
    const { galleryValidation } = require("../middleware/validators.js");

    var router = require("express").Router();

    router.post("/", galleryValidation.create, galleries.create);
    router.get("/", galleries.findAll);
    router.get("/:id", galleryValidation.idParam, galleries.findOne);
    router.put("/:id", galleryValidation.update, galleries.update);
    router.delete("/:id", galleryValidation.idParam, galleries.delete);

    app.use('/api/galleries', router);
};
