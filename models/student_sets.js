module.exports = function(sequelize, DataTypes) {
    let studentSet = sequelize.define("student_set", {
        setScore: {
            field: "set_score",
            type: DataTypes.DOUBLE,
            unique: false,
            allowNull: false
        }
    })
    return studentSet;
}