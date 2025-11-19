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

db.users = require("./user.models.js")(sequelize, Sequelize);
db.categories = require("./category.models.js")(sequelize, Sequelize);
db.galleries = require("./gallery.models.js")(sequelize, Sequelize);
db.images = require("./image.models.js")(sequelize, Sequelize);

// User -> Categories (1:N)
db.users.hasMany(db.categories, { as: "categories", foreignKey: "userId", onDelete: "CASCADE" });
db.categories.belongsTo(db.users, { foreignKey: "userId" });

// User -> Galleries (1:N)
db.users.hasMany(db.galleries, { as: "galleries", foreignKey: "userId", onDelete: "CASCADE" });
db.galleries.belongsTo(db.users, { foreignKey: "userId" });

// Category -> Galleries (1:N)
db.categories.hasMany(db.galleries, { as: "galleries", foreignKey: "categoryId", onDelete: "SET NULL" });
db.galleries.belongsTo(db.categories, { as: "category", foreignKey: "categoryId" });

// Gallery -> Images (1:N)
db.galleries.hasMany(db.images, { as: "images", foreignKey: "galleryId", onDelete: "CASCADE" });
db.images.belongsTo(db.galleries, { foreignKey: "galleryId" });

module.exports = db;