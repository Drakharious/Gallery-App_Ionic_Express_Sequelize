module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return Category;
};
