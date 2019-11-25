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
        type: {
            field: "type",
            type: DataTypes.INTEGER, //0=단답형, 1=객관식 
            unique: false,
            allowNull: false
        },
        title: {
            field: "title",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        question: {
            field: "question",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        answer: {
            field: "answer",
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
        realDifficulty: {
            field: "real_difficulty",
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: true
        },
        timeLimit: {
            field: "time_limit",
            type: DataTypes.INTEGER, //seconds
            unique: false,
            allowNull: false
        },
        bogi1: {
            field: "bogi1",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        bogi2: {
            field: "bogi2",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        bogi3: {
            field: "bogi3",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        bogi4: {
            field: "bogi",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        },
        bogi5: {
            field: "bogi5",
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        }

    });
    question.associate = function(models) {
        question.belongsTo(models.lecture, {
            foreignKey: "lecture_id"
        })
        question.belongsTo(models.user, {
            foreignKey: "user_id"
        })
        question.hasMany(models.parameter, {
            foreignKey: "question_id"
        })
        question.hasMany(models.question_keyword, {
            foreignKey: "question_id"
        })
        // question.belongsTo(models.selection, {
        //     foreignKey: "selection_id"
        // })
        question.belongsToMany(models.set, {
            through: "question_set",
            foreignKey: "question_id"
        })
    }
    return question;
}