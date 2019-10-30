module.exports = function (sequelize, DataTypes) {
    let Customer = sequelize.define("Customer", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        middleName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(2),
            allowNull: false
        },
        zipCode: {
            type: DataTypes.INTEGER(5),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        }
    });

    Customer.associate = function (models) {
        // Customer.belongsToMany(models.Customer, { as: 'Principals', foreignKey: 'primaryId', through: 'RelationsCC', onDelete: 'CASCADE' });
        // Customer.belongsToMany(models.Customer, { as: 'Relatives', foreignKey: 'relativeId', through: 'RelationsCC', onDelete: 'CASCADE' });
        Customer.hasMany(models.Vehicle, {onDelete: "Cascade"});
        Customer.hasMany(models.Transaction, {onDelete: "Cascade"});
    }
    return Customer;
};