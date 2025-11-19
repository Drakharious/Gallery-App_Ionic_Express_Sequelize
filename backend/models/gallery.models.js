module.exports = (sequelize, Sequelize) => {
    const Gallery = sequelize.define("gallery", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        categoryId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        coverImageId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        coverImage: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });

    return Gallery;
};
