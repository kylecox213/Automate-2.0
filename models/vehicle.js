module.exports = function (sequelize, DataTypes) {
    let Vehicle = sequelize.define("Vehicle", {
        make: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        plateNumber: {
            type: DataTypes.STRING(8),
            allowNull: true
        },
        vin: {
            type: DataTypes.STRING(17),
            allowNull: true
        }
    });

    Vehicle.associate = function (models) {
        Vehicle.hasMany(models.Transaction, {onDelete: "Cascade"});
        Vehicle.belongsTo(models.Customer, {onDelete: "Cascade"});
    }

    return Vehicle;
};