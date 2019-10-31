module.exports = function(sequelize, DataTypes) {
    let student = sequelize.define("student", {
        stuID: {
            field: "stu_id",
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
    student.associate = function(models) {
        student.belongsTo(models.user, {
            foreignKey: "user_id"
        })
    }
    return student;
}