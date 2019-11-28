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
        });
        teacher.belongsToMany(models.subject, {
            through: "teacher_subject",
            foreignKey: "tch_id"
        })
        teacher.hasMany(models.bank_question, {
            foreignKey: "tch_id"
        })
    }
    return teacher;
}