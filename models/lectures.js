module.exports = function(sequelize, DataTypes) {
    let lecture = sequelize.define("lecture", {
        lectureID: {
            field: "lecture_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        subjectID: {
            field: "subject_id",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        name: {
            field: "lecture_name",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        tchID: {
            field: "tch_id",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        }
    });
    lecture.associate = function(models) {
        lecture.hasOne(models.teacher, {
            foreignKey: "tch_id"
        });
        lecture.belongsTo(models.subject, {
            foreignKey: "subject_id"
        })
    }
    return lecture;
}