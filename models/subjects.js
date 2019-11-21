module.exports = function(sequelize, DataTypes) {
    let subject = sequelize.define("subject", {
        subjectID: {
            field: "subject_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            field: "name",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        limit: {
            field: "limit",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        // 대표강사 ID
        tchID: {
            field: "tch_id",
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        }
    });
    subject.associate = function(models) {
        subject.belongsTo(models.teacher, {
            foreignKey: "tch_id"
        });
        subject.hasMany(models.lecture, {
            foreignKey: "subject_id"
        });
        subject.hasMany(models.users_subjects, {
            foreignKey: "subject_id"
        });
        // 별도 속성 추가가 없기 때문에 M:N 테이블 자동 생성되도록함.
        subject.belongsToMany(models.student, {
            through: "student_subject",
            foreignKey: "subject_id"
        })
        subject.belongsToMany(models.teacher, {
            through: "teacher_subject",
            foreignKey: "subject_id"
        })
    }
    return subject;
}