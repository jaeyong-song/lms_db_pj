module.exports = function(sequelize, DataTypes) {
    let teacher = sequelize.define("teacher", {
        tchID: {
            field: "tch_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userID: {
            field: "user_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        }
    });
    teacher.associate = function(models) {
        teacher.belongsTo(models.user, {
            foreignKey: "user_id"
        })
    }
    return teacher;
}