module.exports = function(sequelize, DataTypes) {
    let question = sequelize.define("question", {
        questionID: {
            field: "question_id",
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
        },
        lectureID: {
            field: "lecture_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        qType: {
            field: "q_type",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        ask: {
            field: "ask",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        content: {
            field: "content",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        difficulty: {
            field: "difficulty",
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: false
        },
        score: {
            field: "score",
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: false
        },
        timeLimit: {
            field: "time_limit",
            type: DataTypes.DATE,
            unique: false,
            allowNull: false
        }
    });
    question.associate = function(models) {
        question.belongsTo(models.lecture, {
            foreignKey: "lecture_id"
        })
        question.belongsTo(models.user, {
            foreignKey: "user_id"
        })
        question.belongsToMany(models.keyword, {
            through: "question_keyword",
            foreignKey: "question_id"
        })
        question.hasMany(models.parameter, {
            foreignKey: "question_id"
        })
        question.hasMany(models.answer, {
            foreignKey: "question_id"
        })
        question.belongsTo(models.selection, {
            foreignKey: "question_id"
        })
    }
    return question;
}