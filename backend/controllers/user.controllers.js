const db = require("../models");
const User = db.users;
const Gallery = db.galleries;
const Image = db.images;
const { AppError } = require('../middleware/errorHandler');
const fs = require('fs');
const path = require('path');

exports.update = async (req, res, next) => {
    try {
        if (req.user.id !== parseInt(req.params.id)) {
            return next(new AppError('Unauthorized', 403));
        }

        const { name, email } = req.body;
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        await user.update({ name, email });
        
        res.json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        next(new AppError('Error updating user', 500));
    }
};

exports.delete = async (req, res, next) => {
    try {
        if (req.user.id !== parseInt(req.params.id)) {
            return next(new AppError('Unauthorized', 403));
        }

        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Obtener todas las galerías del usuario con sus imágenes
        const galleries = await Gallery.findAll({
            where: { userId: req.params.id },
            include: [{ model: Image, as: 'images' }]
        });

        // Eliminar archivos físicos de todas las imágenes y portadas
        galleries.forEach(gallery => {
            // Eliminar imagen de portada personalizada
            if (gallery.coverImage) {
                const coverPath = path.join(__dirname, '..', 'uploads', gallery.coverImage);
                if (fs.existsSync(coverPath)) {
                    fs.unlinkSync(coverPath);
                }
            }

            // Eliminar imágenes de la galería
            if (gallery.images && gallery.images.length > 0) {
                gallery.images.forEach(image => {
                    const filePath = path.join(__dirname, '..', 'uploads', image.imageFile);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }
        });

        // Eliminar usuario (las relaciones en cascada eliminarán galerías, categorías e imágenes)
        await user.destroy();
        res.status(204).send();
    } catch (err) {
        next(new AppError('Error deleting user', 500));
    }
};
