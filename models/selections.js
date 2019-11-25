module.exports = function(sequelize, DataTypes) {
    let selection = sequelize.define("selection", {
        selectionID: {
            field: "selection_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
        },
        questionID: {
            field: "question_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
        },
        s1: {
            field: "s1",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        s2: {
            field: "s2",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        s3: {
            field: "s3",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        s4: {
            field: "s4",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        s5: {
            field: "s5",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        }
    })
    selection.associate = function(models) {
        selection.belongsTo(models.question, {
            foreignKey: "question_id"
        })
    }
    return selection;
}