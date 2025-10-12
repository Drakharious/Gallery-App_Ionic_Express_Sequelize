const dbConfig = require("../config/db.config.js");
const logger = require("../config/logger");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: (msg) => logger.debug(msg),
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

sequelize.authenticate()
    .then(() => logger.info('Database connection established successfully'))
    .catch(err => {
        logger.error('Unable to connect to database:', err);
        process.exit(1);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.galleries = require("./gallery.models.js")(sequelize, Sequelize);
db.images = require("./image.models.js")(sequelize, Sequelize);

db.galleries.hasMany(db.images, { as: "images", foreignKey: "galleryId", onDelete: "CASCADE" });
db.images.belongsTo(db.galleries, { foreignKey: "galleryId" });

module.exports = db;