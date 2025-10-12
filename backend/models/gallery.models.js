module.exports = (sequelize, Sequelize) => {
    const Gallery = sequelize.define("gallery", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Gallery;
};
