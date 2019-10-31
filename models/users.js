module.exports = function(sequelize, DataTypes) {
    let user = sequelize.define("user", {
        userID: {
            field: "user_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        emailID: {
            field: "email_id",
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        name: {
            field: "name",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        type: {
            field: "type",
            // 학생이면 0, 강사면 1
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        password: {
            field: "password",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        }
    });
    user.associate = function (models) {
        user.hasMany(models.student, {
            foreignKey: "user_id"
        });
        user.hasMany(models.teacher, {
            foreignKey: "user_id"
        })
    }
    return user;
}