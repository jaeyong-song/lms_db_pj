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
        // 강의는 대표 선생님 한명 존재
        teacher.belongsTo(models.lecture, {
            foreignKey: "tch_id"
        })
        teacher.belongsTo(models.subject, {
            foreignKey: "tch_id"
        })
        teacher.belongsTo(models.user, {
            foreignKey: "user_id"
        });
        teacher.belongsToMany(models.subject, {
            through: "teacher_subject"
        })
    }
    return teacher;
}