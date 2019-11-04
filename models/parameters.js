module.exports = function(sequelize, DataTypes) {
    let parameter = sequelize.define("parameter", {
        parameterID: {
            field: "parameter_id",
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
        answerID: {
            field: "answer_id",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        p1: {
            field: "p1",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        p2: {
            field: "p2",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        p3: {
            field: "p3",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        p4: {
            field: "p4",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        p5: {
            field: "p5",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        }
    })
    parameter.associate = function(models) {
        parameter.belongsTo(models.question, {
            foreignKey: "question_id"
        })
        parameter.belongsTo(models.answer, {
            foreignKey: "answer_id"
        })
    }
    return parameter;
}