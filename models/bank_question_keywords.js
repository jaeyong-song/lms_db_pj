module.exports = function(sequelize, DataTypes) {
    let bank_question_keyword = sequelize.define("bank_question_keyword", {
        bankQuestionID: {
            field: "bank_question_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        bank_question_keyword: {
            field: "bank_question_keyword",
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
    bank_question_keyword.associate = function(models) {
        // bank_question_keyword.belongsToMany(models.bank_question, {
        //      through: "bank_question_keyword_bankquestion",
        //      foreignKey: "bank_question_keyword"
        //  })
        // bank_question_keyword.belongsToMany(models.lecture, {
        //     through: "bank_question_keyword_lecture",
        //     foreignKey: "lecture_id"
        // })
    }
    return bank_question_keyword;
}