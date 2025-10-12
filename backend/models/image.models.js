module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define("image", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        customUrl: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        imageFile: {
            type: Sequelize.STRING,
            allowNull: false
        },
        galleryId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return Image;
};
