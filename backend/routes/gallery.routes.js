const upload = require('../config/multer');

module.exports = app => {
    const galleries = require("../controllers/gallery.controllers.js");
    const { galleryValidation } = require("../middleware/validators.js");
    const { authenticateToken } = require("../middleware/auth.js");

    var router = require("express").Router();

    router.post("/", authenticateToken, galleryValidation.create, galleries.create);
    router.get("/", authenticateToken, galleries.findAll);
    router.get("/:id", authenticateToken, galleryValidation.idParam, galleries.findOne);
    router.put("/:id", authenticateToken, upload.single('coverImage'), galleryValidation.update, galleries.update);
    router.delete("/:id", authenticateToken, galleryValidation.idParam, galleries.delete);

    app.use('/api/galleries', router);
};
