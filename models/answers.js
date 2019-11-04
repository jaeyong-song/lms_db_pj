module.exports = function(sequelize, DataTypes) {
    let answer = sequelize.define("answer", {
        answerID: {
            field: "answer_id",
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
            allowNull: false,
        },
        ans1: {
            field: "ans1",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        ans2: {
            field: "ans2",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        ans3: {
            field: "ans3",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        ans4: {
            field: "ans4",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        ans5: {
            field: "ans5",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        }
    })
    answer.associate = function(models) {
        answer.belongsTo(models.question, {
            foreignKey: "question_id"
        })
        answer.hasMany(models.parameter, {
            foreignKey: "answer_id"
        })
    }
    return answer;
}