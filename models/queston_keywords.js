module.exports = function(sequelize, DataTypes) {
    let question_keyword = sequelize.define("question_keyword", {
        questionID: {
            field: "question_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        question_keyword: {
            field: "question_keyword",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        lectureID: {
            field: "lecture_id",
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
    });
    question_keyword.associate = function(models) {
        // question_keyword.belongsToMany(models.question, {
        //     through: "question_keyword_question",
        //     foreignKey: "question_keyword"
        // })
        // question_keyword.belongsToMany(models.lecture, {
        //     through: "question_keyword_lecture",
        //     foreignKey: "lecture_id"
        // })
    }
    return question_keyword;
}