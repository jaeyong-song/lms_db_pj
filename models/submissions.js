module.exports = function(sequelize, DataTypes) {
    let submission = sequelize.define("submission", {
        submissionID: {
            field: "submission_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        questionID: {
            field: "question_id",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        stuID: {
            field: "stu_id",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        score: {
            field: "score",
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: false
        }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    })
    submission.associate = function(models) {
        submission.belongsTo(models.student, {
            foreignKey: "stu_id"
        })
        submission.belongsTo(models.question, {
            foreignKey: "question_id"
        })
    }
    return submission;
}