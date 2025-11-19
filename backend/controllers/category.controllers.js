const db = require("../models");
const Category = db.categories;
const { AppError } = require('../middleware/errorHandler');

exports.create = async (req, res, next) => {
    try {
        const category = await Category.create({
            name: req.body.name,
            description: req.body.description,
            userId: req.user.id
        });
        res.status(201).json(category);
    } catch (err) {
        next(new AppError('Error creating category', 500));
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            where: { userId: req.user.id },
            order: [['id', 'DESC']]
        });
        res.json(categories);
    } catch (err) {
        next(new AppError('Error retrieving categories', 500));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const category = await Category.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!category) {
            return next(new AppError('Category not found', 404));
        }
        res.json(category);
    } catch (err) {
        next(new AppError('Error retrieving category', 500));
    }
};

exports.update = async (req, res, next) => {
    try {
        const category = await Category.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!category) {
            return next(new AppError('Category not found', 404));
        }

        await category.update({
            name: req.body.name,
            description: req.body.description
        });
        res.json(category);
    } catch (err) {
        next(new AppError('Error updating category', 500));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const category = await Category.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!category) {
            return next(new AppError('Category not found', 404));
        }

        await category.destroy();
        res.status(204).send();
    } catch (err) {
        next(new AppError('Error deleting category', 500));
    }
};
