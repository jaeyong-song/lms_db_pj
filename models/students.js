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
        student.belongsToMany(models.subject, {
            through: "student_subject",
            foreignKey: "stu_id"
        })
        student.belongsToMany(models.set, {
            through: "student_set",
            foreignKey: "stu_id"
        })
        student.hasMany(models.submission, {
            foreignKey: "stu_id"
        })
    }
    return student;
}