require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const logger = require("./config/logger");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:8100",
    credentials: true
};
app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const db = require("./models");

const syncDatabase = async () => {
    try {
        await db.sequelize.sync();
        logger.info('Database synced successfully');
    } catch (error) {
        logger.error('Database sync failed:', error);
        process.exit(1);
    }
};

syncDatabase();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to galleries application." });
});

require("./routes/gallery.routes.js")(app);
require("./routes/image.routes.js")(app);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});