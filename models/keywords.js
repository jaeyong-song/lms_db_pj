module.exports = function(sequelize, DataTypes) {
    let keyword = sequelize.define("keyword", {
        keywordID: {
            field: "keyword_id",
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        keyword: {
            field: "keyword",
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        importance: {
            field: "importance",
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: false
        }
    });
    keyword.associate = function(models) {
        keyword.belongsToMany(models.question, {
            through: "question_keyword",
            foreignKey: "keyword_id"
        })
    }
    return keyword;
}