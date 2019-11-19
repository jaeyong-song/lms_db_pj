module.exports = function(sequelize, DataTypes) {
    let users_subjects = sequelize.define("users_subjects", {
        type: {
            field: "type",
            // student, teacher
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        subjectID: {
            field: "subject_id",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        userID: {
            field: "user_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        }
    });
    users_subjects.associate = function(models) {
        users_subjects.belongsTo(models.user, {
            foreignKey: "user_id"
        });
        users_subjects.belongsToMany(models.subject, {
            through: "users_subjects_subject",
            foreignKey: "subject_id"
        });
    }
    return users_subjects;
}