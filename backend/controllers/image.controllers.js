const db = require("../models");
const Image = db.images;
const Gallery = db.galleries;
const { AppError } = require('../middleware/errorHandler');
const { generateRandomName, generateRandomDescription, generateRandomUrl } = require('../utils/randomGenerator');
const fs = require('fs');
const path = require('path');

exports.create = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('No image file provided', 400));
        }

        const gallery = await Gallery.findOne({
            where: { id: req.params.galleryId, userId: req.user.id }
        });
        if (!gallery) {
            fs.unlinkSync(req.file.path);
            return next(new AppError('Gallery not found', 404));
        }

        let customUrl = req.body.customUrl || generateRandomUrl();
        
        const existingUrl = await Image.findOne({ where: { customUrl } });
        if (existingUrl) {
            customUrl = generateRandomUrl();
        }

        const image = await Image.create({
            name: req.body.name || generateRandomName(),
            description: req.body.description || generateRandomDescription(),
            customUrl: customUrl,
            imageFile: req.file.filename,
            galleryId: req.params.galleryId
        });

        res.status(201).json(image);
    } catch (err) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        next(new AppError('Error creating image', 500));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const gallery = await Gallery.findOne({
            where: { id: req.params.galleryId, userId: req.user.id }
        });
        if (!gallery) {
            return next(new AppError('Gallery not found', 404));
        }

        const images = await Image.findAll({
            where: { galleryId: req.params.galleryId },
            order: [['id', 'DESC']]
        });
        res.json(images);
    } catch (err) {
        next(new AppError('Error retrieving images', 500));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const image = await Image.findByPk(req.params.id);
        if (!image) {
            return next(new AppError('Image not found', 404));
        }
        res.json(image);
    } catch (err) {
        next(new AppError('Error retrieving image', 500));
    }
};

exports.update = async (req, res, next) => {
    try {
        const image = await Image.findByPk(req.params.id, {
            include: [{ model: Gallery, required: true, where: { userId: req.user.id } }]
        });
        if (!image) {
            return next(new AppError('Image not found', 404));
        }

        const updateData = {};
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.description !== undefined) updateData.description = req.body.description;

        if (Object.keys(updateData).length === 0) {
            return res.json(image);
        }

        await image.update(updateData);
        res.json(image);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const image = await Image.findByPk(req.params.id, {
            include: [{ model: Gallery, required: true, where: { userId: req.user.id } }]
        });
        if (!image) {
            return next(new AppError('Image not found', 404));
        }

        const filePath = path.join(__dirname, '..', 'uploads', image.imageFile);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await image.destroy();
        res.status(204).send();
    } catch (err) {
        next(new AppError('Error deleting image', 500));
    }
};
