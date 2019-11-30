module.exports = function(sequelize, DataTypes) {
    let bankParameter = sequelize.define("bank_parameter", {
        bankParameterID: {
            field: "bank_parameter_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        bankQuestionID: {
            field: "bank_question_id",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        answer: {
            field: "answer",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
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
    bankParameter.associate = function(models) {
        bankParameter.belongsTo(models.bank_question, {
            foreignKey: "bank_question_id",
            onDelete: 'cascade'
        })
    }
    return bankParameter;
}