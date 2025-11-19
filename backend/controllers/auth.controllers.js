const db = require("../models");
const User = db.users;
const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/errorHandler');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return next(new AppError('Email already registered', 400));
        }

        const user = await User.create({ name, email, password });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        next(new AppError('Error registering user', 500));
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(new AppError('Invalid credentials', 401));
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return next(new AppError('Invalid credentials', 401));
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        next(new AppError('Error logging in', 500));
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'createdAt']
        });
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        res.json(user);
    } catch (err) {
        next(new AppError('Error retrieving user', 500));
    }
};
