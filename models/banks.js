module.exports = function(sequelize, DataTypes) {
    let bank = sequelize.define("bank", {
        bankID: {
            field: "bank_id",
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
            field: "name",
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        }
    });
    bank.associate = function(models) {
        bank.belongsTo(models.teacher, {
            foreignKey: "tch_id"
        })
        bank.hasMany(models.bank_question, {
            foreignKey: "bank_id"
        });
    }
    return bank;
}