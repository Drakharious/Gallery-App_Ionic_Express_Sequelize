const logger = require('../config/logger');

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    logger.error({
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method
    });

    if (process.env.NODE_ENV === 'production') {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.isOperational ? err.message : 'Internal server error'
        });
    } else {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            stack: err.stack
        });
    }
};

module.exports = { AppError, errorHandler };
