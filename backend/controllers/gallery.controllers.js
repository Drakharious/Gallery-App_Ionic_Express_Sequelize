const db = require("../models");
const Gallery = db.galleries;
const Image = db.images;
const { AppError } = require('../middleware/errorHandler');
const fs = require('fs');
const path = require('path');

exports.create = async (req, res, next) => {
    try {
        const gallery = await Gallery.create({
            name: req.body.name
        });
        res.status(201).json(gallery);
    } catch (err) {
        next(new AppError('Error creating gallery', 500));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Gallery.findAndCountAll({
            limit,
            offset,
            order: [['id', 'DESC']],
            include: [{
                model: Image,
                as: 'images',
                attributes: ['id', 'name', 'imageFile']
            }]
        });

        res.json({
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        next(new AppError('Error retrieving galleries', 500));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const gallery = await Gallery.findByPk(req.params.id, {
            include: [{
                model: Image,
                as: 'images'
            }]
        });
        if (!gallery) {
            return next(new AppError('Gallery not found', 404));
        }
        res.json(gallery);
    } catch (err) {
        next(new AppError('Error retrieving gallery', 500));
    }
};

exports.update = async (req, res, next) => {
    try {
        const [updated] = await Gallery.update(
            { name: req.body.name },
            { where: { id: req.params.id } }
        );
        if (!updated) {
            return next(new AppError('Gallery not found', 404));
        }
        const gallery = await Gallery.findByPk(req.params.id);
        res.json(gallery);
    } catch (err) {
        next(new AppError('Error updating gallery', 500));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const gallery = await Gallery.findByPk(req.params.id, {
            include: [{ model: Image, as: 'images' }]
        });
        
        if (!gallery) {
            return next(new AppError('Gallery not found', 404));
        }

        // Eliminar archivos físicos de las imágenes
        if (gallery.images && gallery.images.length > 0) {
            gallery.images.forEach(image => {
                const filePath = path.join(__dirname, '..', 'uploads', image.imageFile);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        await gallery.destroy();
        res.status(204).send();
    } catch (err) {
        next(new AppError('Error deleting gallery', 500));
    }
};
