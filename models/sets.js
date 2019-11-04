module.exports = function(sequelize, DataTypes) {
    let set = sequelize.define("set", {
        setID: {
            field: "set_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        tchID: {
            field: "tch_id",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        name: {
            field: "set_name",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        num: {
            field: "num",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        avgDifficulty: {
            field: "avg_difficulty",
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: false
        },
        totalScore: {
            field: "total_score",
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: false
        }
        
    })
    set.associate = function(models) {
        set.belongsToMany(models.question, {
            through: "question_set",
            foreignKey: "set_id"
        })
        set.belongsToMany(models.student, {
            through: "student_set",
            foreignKey: "set_id"
        })
    }
    return set;
}