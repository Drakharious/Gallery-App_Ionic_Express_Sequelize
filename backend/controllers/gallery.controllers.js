const db = require("../models");
const Gallery = db.galleries;
const Image = db.images;
const { AppError } = require('../middleware/errorHandler');
const fs = require('fs');
const path = require('path');

exports.create = async (req, res, next) => {
    try {
        const gallery = await Gallery.create({
            name: req.body.name,
            userId: req.user.id,
            categoryId: req.body.categoryId || null
        });
        res.status(201).json(gallery);
    } catch (err) {
        next(new AppError('Error creating gallery', 500));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;
        const categoryId = req.query.categoryId;

        const whereClause = { userId: req.user.id };
        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        const { count, rows } = await Gallery.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['id', 'DESC']],
            include: [
                {
                    model: Image,
                    as: 'images',
                    attributes: ['id', 'name', 'imageFile']
                },
                {
                    model: db.categories,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ]
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
        const gallery = await Gallery.findOne({
            where: { id: req.params.id, userId: req.user.id },
            include: [
                {
                    model: Image,
                    as: 'images'
                },
                {
                    model: db.categories,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ]
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
        const gallery = await Gallery.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!gallery) {
            return next(new AppError('Gallery not found', 404));
        }

        const updateData = {};
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.categoryId !== undefined) updateData.categoryId = req.body.categoryId;
        if (req.body.coverImageId !== undefined) updateData.coverImageId = req.body.coverImageId;
        
        // Si se sube una nueva imagen de portada
        if (req.file) {
            // Eliminar la imagen de portada anterior si existe
            if (gallery.coverImage) {
                const oldFilePath = path.join(__dirname, '..', 'uploads', gallery.coverImage);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            updateData.coverImage = req.file.filename;
            updateData.coverImageId = null; // Limpiar coverImageId si se usa archivo personalizado
        }

        await gallery.update(updateData);
        res.json(gallery);
    } catch (err) {
        next(new AppError('Error updating gallery', 500));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const gallery = await Gallery.findOne({
            where: { id: req.params.id, userId: req.user.id },
            include: [{ model: Image, as: 'images' }]
        });
        
        if (!gallery) {
            return next(new AppError('Gallery not found', 404));
        }

        // Eliminar imagen de portada personalizada si existe
        if (gallery.coverImage) {
            const coverPath = path.join(__dirname, '..', 'uploads', gallery.coverImage);
            if (fs.existsSync(coverPath)) {
                fs.unlinkSync(coverPath);
            }
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
