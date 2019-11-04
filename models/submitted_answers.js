module.exports = function(sequelize, DataTypes) {
    let submittedAnswer = sequelize.define("submitted_answer", {
        answer: {
            field: "answer",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        }
    })
    return submittedAnswer;
}