module.exports = function(sequelize, DataTypes) {
    let lecture_keyword = sequelize.define("lecture_keyword", {
        keywordID: {
            field: "keyword_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        lectureID: {
            field: "lecture_id",
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        lecture_keyword: {
            field: "lecture_keyword",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        importance: {
            field: "importance",
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: false
        }
    });
    lecture_keyword.associate = function(models) {
        lecture_keyword.belongsToMany(models.lecture, {
            through: "lecture_keyword_lecture",
            foreignKey: "lecture_id"
        });
    }
    return lecture_keyword;
}